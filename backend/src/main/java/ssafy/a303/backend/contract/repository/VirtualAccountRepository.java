package ssafy.a303.backend.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.contract.entity.VirtualAccount;

import java.util.Optional;

public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Integer> {

    Optional<VirtualAccount> findByContractSeq(Integer contractSeq);
}
