package ssafy.a303.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.broker.entity.Broker;
import ssafy.a303.backend.broker.repository.BrokerRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.dto.response.MeResponseDTO;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;
import ssafy.a303.backend.user.util.S3ProfileUploader;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BrokerRepository brokerRepository;
    private final S3ProfileUploader s3ProfileUploader;

    public MeResponseDTO getUser(int userSeq){
        Optional<User> opt =  userRepository.findById(userSeq);
        if(opt.isEmpty()) throw new CustomException(ErrorCode.USER_NOT_FOUND);
        User user = opt.get();
        Optional<Broker> optB = brokerRepository.findBrokerByUserUserSeq(userSeq);
        return new MeResponseDTO(
                user.getUserSeq(),
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

    @Transactional
    public void userProfile(int userSeq, MultipartFile image){
        User user = userRepository.findById(userSeq).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        String key = s3ProfileUploader.uploadProfile(userSeq, image);
        user.setProfileImg(key);
    }
}
