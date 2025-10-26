package ssafy.a303.backend.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.entity.user.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findUserByEmailAndDeletedAtIsNull(String email);
}
