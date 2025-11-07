package ssafy.a303.backend.broker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.broker.entity.Company;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Optional<Company> findCompanyByTaxSeq(String taxSeq);
}
