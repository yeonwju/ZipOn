package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.projection.AuctionAlarmProjection;
import ssafy.a303.backend.auction.repository.AuctionAlarmRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionAlarmService {
    private final AuctionAlarmRepository repo;

    // 알람 대상자 찾기
    // 시작할 때
    public List<AuctionAlarmProjection> getAuctionAlarmStartTarget(LocalDate strmDate,LocalTime strmStartTm){
        return repo.findAuctionAlarmStartTargets(strmDate, strmStartTm);
    }
    // 끝날 때
    public List<AuctionAlarmProjection> getAuctionAlarmEndTarget(LocalDate strmDate,LocalTime strmStartTm){
        return repo.findAuctionAlarmStartTargets(strmDate, strmStartTm);
    }

    // 사용자 알람 읽기
    public Slice<AuctionAlarmProjection> getMyAlarmsScroll(int userSeq, Long cursor, int size) {
        return repo.findMyAlarmsCursor(
                userSeq,
                cursor,                             // 첫 페이지면 null
                PageRequest.of(0, size) // 무한 스크롤: 항상 page=0, size만 지정
        );
    }

}