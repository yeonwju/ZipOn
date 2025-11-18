package ssafy.a303.backend.auction.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.auction.service.BidRankService;

@Service
@RequiredArgsConstructor
public class BidEventProducer {

    private final BidRankService bidRankService;
    private static final String TOPIC = "auction-bid";
    private final KafkaTemplate<String, BidEventMessage> kafkaTemplate;

    public void sendBid(BidEventMessage message){
        bidRankService.check(message);
        String key = String.valueOf(message.auctionSeq());
        kafkaTemplate.send(TOPIC, key, message);
    }

}
