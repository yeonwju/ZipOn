package ssafy.a303.backend.contract.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.config.AiClient;
import ssafy.a303.backend.contract.dto.response.AiRawResponseDto;
import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;

@Service
@RequiredArgsConstructor
public class ContractAiService {

    private final AiClient aiClient;

    public AiRawResponseDto verifyByAi(MultipartFile file) {
        return aiClient.verifyContract(file);
    }


}
