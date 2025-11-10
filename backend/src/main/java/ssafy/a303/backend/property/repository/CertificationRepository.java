package ssafy.a303.backend.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.property.entity.Certification;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Integer> {


}
