package ssafy.a303.backend.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.property.entity.Certification;

import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Integer> {

        Optional<Certification> findByPropertySeq(Integer propertySeq);
}
