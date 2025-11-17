package ssafy.a303.backend.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.contract.entity.FinanceProduct;

import java.util.Optional;

@Repository
public interface FinanceProductRepository extends JpaRepository<FinanceProduct, Integer> {
    Optional<FinanceProduct> findByBankCode(String bankCode);
}
