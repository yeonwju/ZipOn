package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.repository.BidOnGoingRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidOnGoingService {

    private final BidOnGoingRepository bidOnGoingRepository;
    private final int LIMIT = 10;

    public void updateRanking(BidEventMessage message) {
        bidOnGoingRepository.updateScore(message);
    }


}
