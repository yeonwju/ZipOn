package ssafy.a303.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.broker.entity.Broker;
import ssafy.a303.backend.broker.repository.BrokerRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.dto.response.MeResponseDTO;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BrokerRepository brokerRepository;

    public MeResponseDTO getUser(int userSeq){
        Optional<User> opt =  userRepository.findById(userSeq);
        if(opt.isEmpty()) throw new CustomException(ErrorCode.USER_NOT_FOUND);
        User user = opt.get();
        Optional<Broker> optB = brokerRepository.findBrokerByUserUserSeq(userSeq);
        return new MeResponseDTO(
                user.getEmail(),
                user.getNickname(),
                user.getName(),
                user.getTel(),
                user.getBirth(),
                user.getProfileImg(),
                user.getRole().name(),
                user.getName() != null,
                optB.isPresent()
        );
    }
}
