package ssafy.a303.backend.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import ssafy.a303.backend.common.exception.CustomException;

import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.http.MediaType;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.dto.response.VerificationResultResponseDto;

@Component
@Slf4j
public class AiClient {

    private final WebClient client;

    public AiClient(@Value("${ai.base-url:http://localhost:8080}") String baseUrl, WebClient.Builder builder) {
        this.client = builder.baseUrl(baseUrl).build(); // 항상 초기화
    }

    public VerificationResultResponseDto verifySync(String pdfCode, MultipartFile pdf, String regiNm, String regiBirth, String address) {

        MultipartBodyBuilder mb = new MultipartBodyBuilder();
        mb.part("pdfCode", pdfCode);
        mb.part("regiNm", regiNm);
        mb.part("regiBirth", regiBirth);
        mb.part("address", address);

        mb.part("file", pdf.getResource())
                .filename(pdf.getOriginalFilename() != null ? pdf.getOriginalFilename() : "certification.pdf")
                .contentType(MediaType.APPLICATION_PDF);

        log.info("AI 서버로 요청을 보내기 직전입니다.");

        VerificationResultResponseDto res = client.post()
                .uri("/verify")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(mb.build()))
                .retrieve()
                .bodyToMono(VerificationResultResponseDto.class)
                .block();

        if(res == null) {
            throw new CustomException(ErrorCode.AI_NO_RESPONSE);
        }
        return res;
    }

}
