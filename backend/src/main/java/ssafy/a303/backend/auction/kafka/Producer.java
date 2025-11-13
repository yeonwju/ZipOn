package ssafy.a303.backend.auction.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;

@Service
@RequiredArgsConstructor
public class Producer {

    private static final String TOPIC = "auction-bid";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendBid(BidEventMessage message){

    }

}
