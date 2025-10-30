package ssafy.a303.backend.finace.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.common.component.SSAFYAPI;
import ssafy.a303.backend.finace.dto.UserIdDTO;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final SSAFYAPI ssafyapi;

//    public String getFinanceKey(String email){
//        UserIdDTO userIdDTO = UserIdDTO.builder()
//                .userId(email)
//                .build();
//    }

}
