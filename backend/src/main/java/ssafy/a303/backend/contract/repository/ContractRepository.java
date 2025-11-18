package ssafy.a303.backend.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.contract.entity.Contract;

import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {
    
    //마이페이지 매물에 관한 계약 seq seq 값 조회
    Optional<Contract> findTopByPropertySeqOrderByCreatedAtDesc(Integer propertySeq);
    
}
