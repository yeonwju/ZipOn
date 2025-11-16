package ssafy.a303.backend.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.contract.entity.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {


}
