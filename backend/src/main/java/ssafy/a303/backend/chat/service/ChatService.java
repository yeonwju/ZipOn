package ssafy.a303.backend.chat.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.chat.dto.request.ChatMessageRequestDto;
import ssafy.a303.backend.chat.dto.request.ChatRoomCreateRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.dto.response.ChatRoomResponseDto;
import ssafy.a303.backend.chat.dto.response.MyChatListResponseDto;
import ssafy.a303.backend.chat.entity.*;
import ssafy.a303.backend.chat.repository.*;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    /**
     * 1:1 채팅방 생성 or 기존 방 반환
     * isNew = true → 새로 만든 방
     * isNew = false → 기존 방 존재
     */
    public ChatRoomResponseDto createOrGetRoom(ChatRoomCreateRequestDto requestDto) {

        // 로그인 유저 ID
        Integer requesterSeq = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());

        User requester = userRepository.findById(requesterSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Property property = propertyRepository.findById(requestDto.getPropertySeq())
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        // 채팅 상대 결정
        User opponent;
        if (requestDto.isAucPref()) { // 중개인
            Integer brkSeq = Optional.ofNullable(property.getBrkSeq())
                    .orElseThrow(() -> new CustomException(ErrorCode.BROKER_NOT_FOUND));

            opponent = userRepository.findById(brkSeq)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        } else { // 임대인
            opponent = userRepository.findById(property.getLessorSeq())
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

        }

        return ChatRoomResponseDto.builder()
                .roomSeq(chatRoom.getId())
                .isNew(isNew)
                .opponent(ChatRoomResponseDto.OpponentDto.builder()
                        .userSeq(opponent.getUserSeq())
                        .name(opponent.getName())
                        .nickname(opponent.getNickname())
                        .build())
                .build();
    }

    /**
     * 내 채팅방 리스트 조회
     */
    public List<MyChatListResponseDto> getMyChatRooms() {

        // 1) 현재 로그인된 사용자 userSeq 가져오기 (JWT → SecurityContext)
        Integer userSeq = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());

        // 2) 사용자 정보 조회 (User 엔티티)
        User me = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<MyChatListResponseDto> result = new ArrayList<>();

        // 3) 내가 참여하고 있는 모든 채팅방 가져오기
        List<ChatParticipant> myParticipations = chatParticipantRepository.findAllByUser(me);

        for (ChatParticipant cp : myParticipations) {

            // 4) 해당 채팅방 엔티티
            ChatRoom room = cp.getChatRoom();

            // 5) 채팅방의 참여자 중 "나 아닌 사람 = 상대방" 찾기
            // .stream() List 같은 데이터 묶음을 반복문 없이 손쉽게 필터링/변환/검색
            User partner = room.getParticipants().stream()
                    .map(ChatParticipant::getUser)
                    .filter(u -> !u.getUserSeq().equals(me.getUserSeq())) // 나 제외
                    .findFirst()
                    .orElse(null); // 이론상 null이면 안되지만 안전 장치

            // 6) 해당 채팅방의 가장 최근 메시지(없을 수도 있음)
            ChatMessage lastMessage = chatMessageRepository
                    .findTopByChatRoomOrderBySentAtDesc(room)
                    .orElse(null);

            // 7) 내가 읽지 않은 메시지 개수 조회
            long unread = messageReadStatusRepository.countByChatRoomAndUserAndIsReadFalse(room, me);

            // 8) 최종 응답 DTO 생성
            result.add(MyChatListResponseDto.builder()
                    .roomSeq(room.getId())
                    .partnerSeq(partner != null ? partner.getUserSeq() : null)
                    .partnerName(partner != null ? partner.getName() : "알 수 없음")
                    .lastMessage(lastMessage != null ? lastMessage.getContent() : "")
                    .lastSentAt(lastMessage != null ? lastMessage.getSentAt() : null)
                    .unreadCount((int) unread)
                    .build());
        }

        // 9) 채팅방 목록 반환
        return result;
    }

    /**
     * ✅ 특정 채팅방 메시지 목록 조회
     */
    public List<ChatMessageResponseDto> getChatHistory(Integer roomSeq) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        List<ChatMessageResponseDto> result = new ArrayList<>();

        for (ChatMessage m : chatMessageRepository.findByChatRoomOrderBySentAtAsc(chatRoom)) {
            result.add(ChatMessageResponseDto.builder()
                    .messageSeq(m.getId())
                    .roomSeq(roomSeq)
                    .senderSeq(m.getSender().getUserSeq())
                    .senderName(m.getSender().getName())
                    .content(m.getContent())
                    .sentAt(m.getSentAt())
                    .build());
        }
        return result;
    }

    /**
     * ✅ STOMP 구독 시 채팅방 참여자 검증
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

        // ✅ 이 방에 이 유저가 "참가자"인지 확인
        boolean exists = chatParticipantRepository.existsByChatRoomAndUser(chatRoom, user);

        log.info("[CHAT][AUTH] STOMP 구독 권한 확인 → userSeq={}, roomSeq={}, 참여여부={}", userSeq, roomSeq, exists);

        return exists;
    }

    /**
     * ✅ 메시지 저장 + 읽음 상태 생성 + 응답 DTO 반환
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
                .sentAt(LocalDateTime.now())
                .build();
        chatMessageRepository.save(message);

        // ✅ 참여자별 읽음 상태 생성
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

        // 응답 DTO 로 변환
        return ChatMessageResponseDto.builder()
                .messageSeq(message.getId())
                .roomSeq(chatRoom.getId())
                .senderSeq(sender.getUserSeq())
                .senderName(sender.getName())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }

    /**
     * ✅ 메시지 읽음 처리
     */
    public void readMessages(Integer roomSeq) {

        Integer userSeq = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        User reader = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        ChatRoom room = chatRoomRepository.findById(roomSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        for (MessageReadStatus status : messageReadStatusRepository.findByChatRoomAndUser(room, reader)) {
            if (!status.isRead()) status.markRead();
        }
    }
}
