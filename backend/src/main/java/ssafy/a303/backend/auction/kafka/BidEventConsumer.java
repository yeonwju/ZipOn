package ssafy.a303.backend.auction.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;

@Slf4j
@Service
public class BidEventConsumer {
    @KafkaListener(
            topics = "auction-bid",
            groupId = "auction-bid-group"
    )
    public void consume(BidEventMessage message){
        log.info("[Kafka] 입찰 이벤트 수신 - auctionSeq={}, userSeq={}, amount={}, bidAt={}"
        ,message.auctionSeq(), message.userSeq(), message.amount(), message.bidAt());
    }
}
