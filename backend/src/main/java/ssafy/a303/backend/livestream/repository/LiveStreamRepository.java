package ssafy.a303.backend.livestream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.livestream.entity.LiveStream;
import ssafy.a303.backend.user.entity.User;

public interface LiveStreamRepository extends JpaRepository<LiveStream, Integer> {
}
