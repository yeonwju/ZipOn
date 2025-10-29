package ssafy.a303.backend.security.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.security.jwt.entity.TokenPair;

import java.util.Optional;

public interface TokenPairRepository extends JpaRepository<TokenPair, Integer> {
    Optional<TokenPair> findByAccessJtiAndRefreshJtiAndUsedFalse(String AccessJti, String refreshJti);
}
