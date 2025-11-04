package ssafy.a303.backend.property.service;

import ssafy.a303.backend.property.util.PdfCodeGenerator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.config.AiClient;
import ssafy.a303.backend.property.dto.response.VerificationResultResponseDto;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final AiClient aiClient;

    public VerificationResultResponseDto verifyPdf(MultipartFile pdf, String regiNm, String regiBirth, String address) {

        // 1) 기본 검증
        if(pdf == null || pdf.isEmpty()) {
            throw new CustomException(ErrorCode.EMPTY_PDF_FILE);
        }
        String ct = pdf.getContentType();
        if(ct==null || !ct.equalsIgnoreCase("application/pdf")) {
            throw new CustomException(ErrorCode.ONLY_PDF_ALLOWED);
        }

        // 서버에서 PDF CODE 생성
        String pdfCode = PdfCodeGenerator.next("REG");

        // AI 동기 호출, boolean 수신
        VerificationResultResponseDto result;
        try {
            result = aiClient.verifySync(pdfCode, pdf, regiNm, regiBirth, address);
        } catch (CustomException ce) {
            // AiClient 내부에서 CustomException 던지는 경우 그대로 전달
            throw ce;
        } catch (Exception ex) {
            // 기타 예외는 공통 에러로 랩핑
            throw new CustomException(ErrorCode.AI_NO_RESPONSE, ex);
        }

        // 검증 결과 판단
        if(!result.isCertificated()){
            throw new CustomException(ErrorCode.VERIFICATION_FAILED);
        }

        // 결과를 dto로 변환
        return new VerificationResultResponseDto(pdfCode, result.isCertificated(), result.riskScore(), result.riskReason());
    }
}
