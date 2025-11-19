package ssafy.a303.backend.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.chat.dto.request.ChatMessageRequestDto;
import ssafy.a303.backend.chat.dto.request.ChatRoomCreateRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.dto.response.ChatNotificationDto;
import ssafy.a303.backend.chat.dto.response.ChatRoomResponseDto;
import ssafy.a303.backend.chat.dto.response.MyChatListResponseDto;
import ssafy.a303.backend.chat.entity.*;
import ssafy.a303.backend.chat.repository.*;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.helper.KoreaClock;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.property.util.S3Uploader;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@Log4j2
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final ChatNotificationPubSubService chatNotificationPubSubService;
    private final S3Uploader s3Uploader;

    // 생성자에서 @Lazy 적용하여 순환 참조 해결
    public ChatService(
            ChatRoomRepository chatRoomRepository,
            ChatMessageRepository chatMessageRepository,
            ChatParticipantRepository chatParticipantRepository,
            MessageReadStatusRepository messageReadStatusRepository,
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            @Lazy ChatNotificationPubSubService chatNotificationPubSubService, S3Uploader s3Uploader
    ) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.chatParticipantRepository = chatParticipantRepository;
        this.messageReadStatusRepository = messageReadStatusRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.chatNotificationPubSubService = chatNotificationPubSubService;
        this.s3Uploader = s3Uploader;
    }

    /**
     * 1:1 채팅방 생성 or 기존 방 반환
     * isNew = true → 새로 만든 방
     * isNew = false → 기존 방 존재
     */
    public ChatRoomResponseDto createOrGetRoom(ChatRoomCreateRequestDto requestDto, Integer userSeq) {

        User requester = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Property property = propertyRepository.findById(requestDto.getPropertySeq())
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        // 채팅 상대 결정
        User opponent;
        if (requestDto.getAucPref()) { // 중개인
            Integer brkSeq = Optional.ofNullable(property.getBrkSeq())
                    .orElseThrow(() -> new CustomException(ErrorCode.BROKER_NOT_FOUND));

            opponent = userRepository.findById(brkSeq)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        } else { // 임대인
            opponent = userRepository.findById(property.getLessor().getUserSeq())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }

        // 자기 자신과 채팅 방지
        if (requester.getUserSeq().equals(opponent.getUserSeq())) {
            throw new CustomException(ErrorCode.CHAT_SELF_NOT_ALLOWED);
        }

        // 기존 방 조회
        Optional<ChatRoom> existingRoom =
                chatParticipantRepository.findExistingPrivateRoom(requester.getUserSeq(), opponent.getUserSeq());

        ChatRoom chatRoom;
        boolean isNew;

        if (existingRoom.isPresent()) { // 기존 방
            chatRoom = existingRoom.get();
            isNew = false;
        } else { // 신규 생성
            chatRoom = ChatRoom.builder()
                    .property(property)
                    .name("채팅방-" + requester.getName() + "-" + opponent.getName())
                    .build();
            chatRoomRepository.save(chatRoom);

            chatParticipantRepository.save(ChatParticipant.builder().chatRoom(chatRoom).user(requester).build());
            chatParticipantRepository.save(ChatParticipant.builder().chatRoom(chatRoom).user(opponent).build());

            isNew = true;

            // 새 채팅방 생성 시 상대방에게 알림 전송
            try {

                String requesterProfile = requester.getProfileImg() != null
                        ? s3Uploader.presignedGetUrl(requester.getProfileImg(), Duration.ofHours(12))
                        : null;

                ChatNotificationDto notification = ChatNotificationDto.builder()
                        .roomSeq(chatRoom.getId())
                        .sender(ChatNotificationDto.SenderDto.builder()
                                .userSeq(requester.getUserSeq())
                                .name(requester.getName())
                                .nickname(requester.getNickname())
                                .profileImg(requesterProfile)
                                .build())
                        .content(requester.getNickname() + "님이 채팅을 시작했습니다.")
                        .sentAt(LocalDateTime.now(KoreaClock.getClock()))
                        .unreadCount(0) // 새 채팅방이므로 아직 읽지 않은 메시지 없음
                        .build();

                String channel = "user:notifications:" + opponent.getUserSeq();
                String jsonMessage = new ObjectMapper()
                        .registerModule(new JavaTimeModule())
                        .writeValueAsString(notification);

                chatNotificationPubSubService.publish(channel, jsonMessage);
                log.info("[CHAT][CREATE] 새 채팅방 알림 발송 → opponent={}, roomSeq={}",
                        opponent.getUserSeq(), chatRoom.getId());
            } catch (Exception e) {
                log.error("[CHAT][CREATE] 채팅방 생성 알림 발송 실패", e);
                // 알림 실패해도 채팅방 생성은 성공으로 처리
            }
        }

        String opponentProfile = opponent.getProfileImg() != null
                ? s3Uploader.presignedGetUrl(opponent.getProfileImg(), Duration.ofHours(12))
                : null;

        return ChatRoomResponseDto.builder()
                .roomSeq(chatRoom.getId())
                .newRoom(isNew)
                .opponent(ChatRoomResponseDto.OpponentDto.builder()
                        .userSeq(opponent.getUserSeq())
                        .name(opponent.getName())
                        .nickname(opponent.getNickname())
                        .profileImg(opponentProfile)
                        .build())
                .build();
    }

    /**
     * 내 채팅방 리스트 조회
     * --------------------------------------------------------------------
     * 로그인한 사용자가 참여 중인 모든 1:1 채팅방 목록을 조회한다.
     * 반환 정보 구성:
     * - opponent : 상대방 사용자 정보
     * - lastMessage : 최근 메시지 내용/시각 + 내가 보낸 메시지인지 여부
     * - unreadCount : 내가 읽지 않은 메시지 개수
     * 화면 예시:
     *   [프로필 이미지]  상대방 이름
     *   마지막 메시지 내용 ...       (읽지 않은 메시지 뱃지)
     *   마지막 메시지 보낸 시간
     */
    public List<MyChatListResponseDto> getMyChatRooms(Integer userSeq) {

        // 실제 User 엔티티 조회
        User me = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 응답 리스트
        List<MyChatListResponseDto> result = new ArrayList<>();

        // 3) 내가 참여 중인 모든 채팅방 목록 조회
        List<ChatParticipant> myParticipations = chatParticipantRepository.findAllByUser(me);

        for (ChatParticipant cp : myParticipations) {

            ChatRoom room = cp.getChatRoom();

            /*
             * 4) 채팅방 참여자 중 '나를 제외한 사용자' = 상대방
             *    (1:1 채팅 가정이므로 항상 2명 존재)
             */
            User partner = room.getParticipants().stream()
                    .map(ChatParticipant::getUser)
                    .filter(u -> !u.getUserSeq().equals(me.getUserSeq())) // 나 제외
                    .findFirst()
                    .orElse(null); // 안전 처리 (이론상 null이면 안 됨)

            /*
             * 5) 최근 메시지 조회
             *    - 최하단에 삽입되는 구조이므로 "sentAt DESC LIMIT 1"
             */
            ChatMessage lastMessage = chatMessageRepository
                    .findTopByChatRoomOrderBySentAtDesc(room)
                    .orElse(null);

            /*
             * 6) 읽지 않은 메시지 개수 조회
             *    - "나 기준"으로 읽음 여부가 저장됨
             */
            long unread = messageReadStatusRepository.countByChatRoomAndUserAndIsReadFalse(room, me);

            // partner 프로필 presigned URL 적용
            String partnerProfile = (partner != null && partner.getProfileImg() != null)
                    ? s3Uploader.presignedGetUrl(partner.getProfileImg(), Duration.ofHours(12))
                    : null;

            /*
             * 7) DTO 변환
             *    ← 여기서 핵심은 "opponent" 와 "lastMessage" 를
             *       각각 하위 객체로 구조화하여 FE가 처리하기 쉽게 하는 것.
             */
            result.add(
                    MyChatListResponseDto.builder()
                            .roomSeq(room.getId())
                            .partner(partner != null
                                    ? MyChatListResponseDto.PartnerDto.builder()
                                    .userSeq(partner.getUserSeq())
                                    .name(partner.getName())
                                    .nickname(partner.getNickname())
                                    .profileImg(partnerProfile)
                                    .build()
                                    : null
                            )
                            .lastMessage(lastMessage != null
                                    ? MyChatListResponseDto.LastMessageDto.builder()
                                    .content(lastMessage.getContent())
                                    .sentAt(lastMessage.getSentAt())
                                    .build()
                                    : null
                            )
                            .unreadCount((int) unread)
                            .build()
            );
        }

        return result;
    }

    /**
     * 특정 채팅방 메시지 목록 조회
     */
    public List<ChatMessageResponseDto> getChatHistory(Integer roomSeq) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        List<ChatMessageResponseDto> result = new ArrayList<>();

        for (ChatMessage m : chatMessageRepository.findByChatRoomOrderBySentAtAsc(chatRoom)) {

            String senderProfile = m.getSender().getProfileImg() != null
                    ? s3Uploader.presignedGetUrl(m.getSender().getProfileImg(), Duration.ofHours(12))
                    : null;

            ChatMessageResponseDto.SenderDto senderDto = ChatMessageResponseDto.SenderDto.builder()
                    .userSeq(m.getSender().getUserSeq())
                    .name(m.getSender().getName())
                    .nickname(m.getSender().getNickname())
                    .profileImg(senderProfile)
                    .build();

            result.add(ChatMessageResponseDto.builder()
                    .messageSeq(m.getId())
                    .roomSeq(roomSeq)
                    .sender(senderDto)
                    .content(m.getContent())
                    .sentAt(m.getSentAt())
                    .build());
        }

        return result;
    }

    /**
     * STOMP 구독 시 채팅방 참여자 검증
     * WebSocket 연결 시 해당 유저가 해당 채팅방의 참여자인지 확인한다.
     *
     * @param userSeqString STOMP 인증에서 넘어온 사용자 seq (문자열)
     * @param roomSeq STOMP 구독하려는 채팅방 ID
     * @return 참여 중이면 true, 아니면 false
     */
    public boolean isRoomParticipant(String userSeqString, Integer roomSeq) {

        // 문자열로 전달된 userSeq → 정수 변환
        Integer userSeq = Integer.valueOf(userSeqString);

        // 사용자 조회 (존재하지 않으면 예외 발생)
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 채팅방 조회 (존재하지 않으면 예외 발생)
        ChatRoom chatRoom = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        // 이 방에 이 유저가 "참가자"인지 확인
        boolean exists = chatParticipantRepository.existsByChatRoomAndUser(chatRoom, user);

        log.info("[CHAT][AUTH] STOMP 구독 권한 확인 → userSeq={}, roomSeq={}, 참여여부={}", userSeq, roomSeq, exists);

        return exists;
    }

    /**
     * 메시지 저장 + 읽음 상태 생성 + 응답 DTO 반환
     * @return 저장된 메시지의 응답 DTO
     */
    public ChatMessageResponseDto saveMessage(Integer roomSeq, ChatMessageRequestDto requestDto, User sender) {

        // 채팅방 조회 (없으면 예외)
        ChatRoom chatRoom = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        // 메시지 엔티티 생성 및 저장
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(requestDto.getContent())
                .sentAt(LocalDateTime.now(KoreaClock.getClock()))
                .build();
        chatMessageRepository.save(message);

        // 참여자별 읽음 상태 생성
        List<ChatParticipant> participants = chatParticipantRepository.findAllByChatRoom(chatRoom);
        for (ChatParticipant participant : participants) {
            messageReadStatusRepository.save(MessageReadStatus.builder()
                    .chatMessage(message)
                    .chatRoom(chatRoom)
                    .user(participant.getUser())
                    // 보낸 사람은 이미 읽은 상태, 나머지는 미확인 상태
                    .isRead(participant.getUser().equals(sender))
                    .build());
        }

        // 변경됨: 메시지 발신자 프로필 presigned URL 적용
        String senderProfile = sender.getProfileImg() != null
                ? s3Uploader.presignedGetUrl(sender.getProfileImg(), Duration.ofHours(12))
                : null;

        // 응답 DTO 로 변환
        ChatMessageResponseDto.SenderDto senderDto = ChatMessageResponseDto.SenderDto.builder()
                .userSeq(sender.getUserSeq())
                .name(sender.getName())
                .nickname(sender.getNickname())
                .profileImg(senderProfile)
                .build();

        return ChatMessageResponseDto.builder()
                .messageSeq(message.getId())
                .roomSeq(chatRoom.getId())
                .sender(senderDto)
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }

    /**
     * 채팅방의 상대방(수신자) 찾기
     * @param roomSeq 채팅방 ID
     * @param senderSeq 발신자 ID
     * @return 수신자 User 엔티티
     */
    public User getRecipient(Integer roomSeq, Integer senderSeq) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        // 채팅방 참여자 중 발신자가 아닌 사람 = 수신자
        return chatRoom.getParticipants().stream()
                .map(ChatParticipant::getUser)
                .filter(user -> !user.getUserSeq().equals(senderSeq))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * 메시지 읽음 처리
     */
    public void readMessages(Integer roomSeq, Integer userSeq) {

        User reader = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        ChatRoom room = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        for (MessageReadStatus status : messageReadStatusRepository.findByChatRoomAndUser(room, reader)) {
            if (!status.isRead()) status.markRead();
        }
    }

    /**
     * 채팅방 나가기
     */
    public void leaveRoom(Integer roomId, Integer userSeq) {
        // 1. 채팅방 조회
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        // 2. 사용자 조회
        User currentUser = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 3. 참여자 엔티티 조회
        ChatParticipant participant = chatParticipantRepository.findByChatRoomAndUser(room, currentUser)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_PARTICIPANT_NOT_FOUND));

        // 4. 채팅방에서 나가는 사용자를 제거
        chatParticipantRepository.delete(participant);

        // 5. 남은 참여자 수 확인 후 방 제거 여부 결정
        List<ChatParticipant> remainingParticipants = chatParticipantRepository.findAllByChatRoom(room);
        if (remainingParticipants.isEmpty()) {
            chatRoomRepository.delete(room);
        }
    }
}
