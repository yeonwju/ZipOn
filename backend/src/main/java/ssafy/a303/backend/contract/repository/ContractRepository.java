package ssafy.a303.backend.contract.repository;

import org.apache.commons.lang3.text.translate.NumericEntityUnescaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.contract.entity.Contract;

import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {

}
