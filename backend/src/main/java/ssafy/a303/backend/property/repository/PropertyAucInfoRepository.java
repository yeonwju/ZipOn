package ssafy.a303.backend.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.property.entity.PropertyAucInfo;

import java.util.Optional;

public interface PropertyAucInfoRepository extends JpaRepository<PropertyAucInfo, Integer> {
    Optional<PropertyAucInfo> findByPropertySeq(Integer propertySeq);
    boolean existsByPropertySeq(Integer propertySeq);
}
