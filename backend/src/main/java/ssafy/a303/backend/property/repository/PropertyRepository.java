package ssafy.a303.backend.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.property.entity.Property;

import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {
    boolean existsByAddressAndLessorSeq(String address, Integer lessorSeq);

    Optional<Property> findByPropertySeqAndLessorSeq(Integer propertySeq, Integer lessorSeq);
}
