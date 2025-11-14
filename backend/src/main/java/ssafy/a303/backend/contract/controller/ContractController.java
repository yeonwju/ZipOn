package ssafy.a303.backend.contract.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.contract.dto.response.AiRawResponseDto;
import ssafy.a303.backend.contract.dto.response.ContractAiResponseDto;
import ssafy.a303.backend.contract.service.ContractAiService;
import ssafy.a303.backend.contract.util.ContractTextFormatter;

import java.awt.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contracts")
public class ContractController {

    private final ContractAiService aiService;

    @PostMapping(value = "/verify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO<ContractAiResponseDto>> verifyContract(@RequestPart("file") MultipartFile file)
    {
        // AI 평가 받기
        AiRawResponseDto rawResult = aiService.verifyByAi(file);
        // 문단을 문장 단위로 나누기
        ContractAiResponseDto lines = ContractTextFormatter.splitToLines(rawResult.getRawLine());
        // 프로트로 배열로 전달
        return ResponseDTO.ok(lines,"계약서 검증 결과입니다.");

    }
}
