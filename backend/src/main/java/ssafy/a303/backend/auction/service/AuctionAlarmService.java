package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.projection.AuctionAlarmProjection;
import ssafy.a303.backend.auction.repository.AuctionAlarmRepository;

@Service
@RequiredArgsConstructor
public class AuctionAlarmService {
    private final AuctionAlarmRepository repo;

    public Slice<AuctionAlarmProjection> getMyAlarmsScroll(int userSeq, Long cursor, int size) {
        return repo.findMyAlarmsCursor(
                userSeq,
                cursor,                             // 첫 페이지면 null
                PageRequest.of(0, size) // 무한 스크롤: 항상 page=0, size만 지정
        );
    }
}