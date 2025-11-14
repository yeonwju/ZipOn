package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.a303.backend.auction.dto.request.BrkApplyRequestDto;
import ssafy.a303.backend.auction.dto.request.BrkCancelRequestDto;
import ssafy.a303.backend.auction.dto.response.BrkApplicantResponseDto;
import ssafy.a303.backend.auction.dto.response.BrkApplyResponseDto;
import ssafy.a303.backend.auction.dto.response.BrkCancelResponseDto;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;
import ssafy.a303.backend.auction.entity.AuctionCancler;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.search.service.PropertySearchService;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertySearchService searchService;

    /**
     * 중개 및 경매 신청 (중개인 -> 매물)
     * @param propertySeq
     * @param userSeq
     * @param req
     * @return
     */
    public BrkApplyResponseDto apply(Integer propertySeq, Integer userSeq, BrkApplyRequestDto req) {

        /** 매물, 중개신청인 존재 여부 확인 */
        Property property = propertyRepository.findById(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        /** 동일 매물 중복 신청 불가 */
        if (auctionRepository.existsActiveByPropertyAndUser(propertySeq, userSeq, AuctionStatus.REQUESTED)) {
            throw new CustomException(ErrorCode.DUPLICATE_NOT_ALLOWED);
        }

        boolean wantStrm = req != null
                && req.strmDate() != null
                && req.strmStartTm() != null
                && req.strmEndTm() != null;

        Auction.AuctionBuilder b = Auction.builder()
                .user(user)
                .property(property)
                .status(AuctionStatus.REQUESTED)
                .intro(req.intro());

        /** 중개만 신청 */
        if(!wantStrm) {
            Auction saved = auctionRepository.save(b.build());
            return BrkApplyResponseDto.of(saved);
        }

        /** 경매도 신청 */
        LocalDate date = req.strmDate();
        LocalTime start = req.strmStartTm();
        LocalTime end = req.strmEndTm();

        // 시작, 종료 시간 전후 검증
        if(!end.isAfter(start)) {
            throw new CustomException(ErrorCode.TIME_NOT_ALLOWED);
        }

        // 날짜가 현재보다 미래 시점인지 검증
        if(LocalDate.now().isAfter(date)) {
            throw new CustomException(ErrorCode.DATE_NOT_ALLOWED);
        }

        /** 경매종료 시점 설정 (방송 다음날 오후 12시) */
        LocalDateTime auctionEndAt = date.plusDays(1).atTime(12,0);

        Auction saved = auctionRepository.save(
                    b.strmDate(date)
                        .strmStartTm(start)
                        .strmEndTm(end)
                        .auctionEndAt(auctionEndAt)
                            .intro(req.intro())
                        .build()
        );
        return BrkApplyResponseDto.of(saved);
    }

    /** 중개인이 신청 취소 */
    public BrkCancelResponseDto cancelMyApply(Integer aucSeq, Integer userSeq, BrkCancelRequestDto req) {

        /** 본인이 신청한건지 확인 */
        Auction a = auctionRepository.findByAuctionSeqAndUser_UserSeq(aucSeq, userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CANCEL_NO_AUTH));

        if(a.getStatus() != AuctionStatus.REQUESTED) {
            throw new CustomException(ErrorCode.CANCEL_IMPOSSIBLE, "현재상태("+ a.getStatus()+")에서는 취소할 수 없습니다. (REQUESTED만 가능)");
        }

        a.setStatus(AuctionStatus.CANCELED);
        a.setCancelAt(LocalDateTime.now());
        a.setCancelBy(AuctionCancler.BROKER);
        a.setCancelReason(req != null ? req.reason() : null) ;

        return BrkCancelResponseDto.of(a);
    }

    /** REQUESTED, ACCEPTED 상태의 신청 리스트 조회 */
    public Page<BrkApplicantResponseDto> listApplicants(Integer propertySeq,
                                                        Integer userSeq,
                                                        Pageable pageable){
        Property p = propertyRepository.findById(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        if(!Objects.equals(p.getLessor().getUserSeq(), userSeq)) {
            throw new CustomException(ErrorCode.READ_NO_AUTH);
        }

        List<AuctionStatus> statuses = List.of(
                AuctionStatus.REQUESTED,
                AuctionStatus.ACCEPTED
        );

        Page<BrkApplicantResponseDto> result = auctionRepository.findApplicantsByPropertySeq(propertySeq, statuses, pageable);
        log.info("중개 신청 리스트 ={}", result.getContent().size());

        return result;
    }

    @Transactional
    public void acceptBrk(Integer userSeq, Integer auctionSeq) {
        // 1. 선택된 경매 조회
        Auction auction = auctionRepository.findById(auctionSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.AUCTION_NOT_FOUND));

        Property property = auction.getProperty();
        // 2. 현재 로그인한 사람이 이 매물의 임대인인지 확인
        if(!property.getLessor().getUserSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.ACCEPT_NO_AUTH);
        }
        //3. 이미 처리된 신청인지 확인
        if(auction.getStatus() != AuctionStatus.REQUESTED) {
            throw new CustomException(ErrorCode.ALREADY_PROCESSED);
        }

        // 매물에 중개인 user seq 기록
        property.setBrkSeq(auction.getUser().getUserSeq());
        property.setHasBrk(true);
        // 경매 상태 ACCEPTED로 변경
        auction.setStatus(AuctionStatus.ACCEPTED);
        // has_brk es 필드 갱신
        searchService.setIndex(property);
    }
}
