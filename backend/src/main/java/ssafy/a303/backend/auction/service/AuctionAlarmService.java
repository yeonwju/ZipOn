package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.projection.AuctionAlarmProjection;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionAlarm;
import ssafy.a303.backend.auction.repository.AuctionAlarmRepository;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionAlarmService {
    private final AuctionAlarmRepository auctionAlarmRepository;
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;

    // 저장
    public void save(int userSeq, int auctionSeq){
        if(auctionAlarmRepository.existsByUser_UserSeqAndAuction_AuctionSeq(userSeq, auctionSeq))
            throw new CustomException(ErrorCode.ALARM_ALREADY_EXIST);
        User user = userRepository.findById(userSeq).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Auction auction = auctionRepository.findById(auctionSeq).orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));
        AuctionAlarm auctionAlarm = new AuctionAlarm();
        auctionAlarm.setUser(user);
        auctionAlarm.setAuction(auction);
        auctionAlarmRepository.save(auctionAlarm);
    }
    public void delete(int userSeq, int auctionSeq){
        int result = auctionAlarmRepository.deleteByUser_UserSeqAndAuction_AuctionSeq(userSeq, auctionSeq);
        if(result == 0) throw new CustomException(ErrorCode.BAD_REQUEST);
    }

    // 알람 대상자 찾기
    // 시작할 때
    public List<AuctionAlarmProjection> getAuctionAlarmStartTarget(LocalDate strmDate,LocalTime strmStartTm){
        return auctionAlarmRepository.findAuctionAlarmStartTargets(strmDate, strmStartTm);
    }
    // 끝날 때
    public List<AuctionAlarmProjection> getAuctionAlarmEndTarget(LocalDate strmDate,LocalTime strmStartTm){
        return auctionAlarmRepository.findAuctionAlarmStartTargets(strmDate, strmStartTm);
    }
    // 사용자 알람 읽기
    public Slice<AuctionAlarmProjection> getMyAlarmsScroll(int userSeq, Long cursor, int size) {
        return auctionAlarmRepository.findMyAlarmsCursor(
                userSeq,
                cursor,                             // 첫 페이지면 null
                PageRequest.of(0, size) // 무한 스크롤: 항상 page=0, size만 지정
        );
    }


}