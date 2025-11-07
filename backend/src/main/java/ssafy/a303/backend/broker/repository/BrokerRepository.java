package ssafy.a303.backend.broker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.broker.entity.Broker;

import java.util.Optional;

public interface BrokerRepository extends JpaRepository<Broker, Integer> {
    Optional<Broker> findBrokerByUserUserSeq(int userSeq);
}
