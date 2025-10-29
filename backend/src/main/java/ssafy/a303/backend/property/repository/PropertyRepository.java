package ssafy.a303.backend.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.property.entity.Property;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {
    // 소유권 확인
    boolean existsByAddressAndLessorSeq(String address, Integer lessorSeq);

    Optional<Property> findByPropertySeqAndLessorSeq(Integer propertySeq, Integer lessorSeq);

    // (삭제되지 않은) 매물 조회
    Optional<Property> findByPropertySeqAndDeletedAtIsNull(Integer propertySeq);
}
