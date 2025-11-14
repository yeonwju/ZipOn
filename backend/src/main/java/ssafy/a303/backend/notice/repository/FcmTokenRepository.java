package ssafy.a303.backend.notice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.notice.entity.FcmToken;
import ssafy.a303.backend.user.entity.User;

import java.util.List;

public interface FcmTokenRepository extends JpaRepository<FcmToken, Integer> {

    List<FcmToken> findByUser(User user);

    boolean existsByToken(String token);
}
