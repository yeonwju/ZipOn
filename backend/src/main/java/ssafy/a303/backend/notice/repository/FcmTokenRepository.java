package ssafy.a303.backend.notice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.notice.entity.FcmToken;
import ssafy.a303.backend.user.entity.User;

import java.util.List;
import java.util.Optional;

public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {

    Optional<FcmToken> findByToken(String token);

    Optional<FcmToken> findTopByUserOrderByCreatedAtDesc(User user);
}
