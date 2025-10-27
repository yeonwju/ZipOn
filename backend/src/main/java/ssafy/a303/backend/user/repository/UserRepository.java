package ssafy.a303.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.user.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findUserByEmailAndDeletedAtIsNull(String email);
}
