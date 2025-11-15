package ssafy.a303.backend.notice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.notice.dto.request.FcmTokenRequest;
import ssafy.a303.backend.notice.entity.FcmToken;
import ssafy.a303.backend.notice.repository.FcmTokenRepository;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FcmTokenService {

    private final FcmTokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public void registerToken(int userSeq, FcmTokenRequest request) {
        String token = request.getToken();
        User user = userRepository.getReferenceById(userSeq);

        tokenRepository.findByToken(token)
                .ifPresentOrElse(
                        existingToken -> {
                            // 이미 있는 토큰 → user 갱신
                            existingToken.setUser(user);
                        },
                        () -> {
                            // 새 토큰 저장
                            FcmToken newToken = FcmToken.builder()
                                    .user(user)
                                    .token(token)
                                    .build();
                            tokenRepository.save(newToken);
                        }
                );
    }

}
