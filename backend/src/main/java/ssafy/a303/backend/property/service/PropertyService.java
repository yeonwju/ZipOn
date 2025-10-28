package ssafy.a303.backend.property.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAddressResponseDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final StorageService storageService;

    /**
     * 매물 등록 단계 중 첫단계,
     * 매물의 주인과 주소 및 위경도 등록하기.
     * 이후 등기부등본 검증.
     * @param req
     * @param lessorSeqFromAuth
     * @param lessorNameFromAuth
     * @return
     */
    @Transactional
    public PropertyAddressResponseDto submitAddress(PropertyAddressRequestDto req,
                                                    Integer lessorSeqFromAuth,
                                                    String lessorNameFromAuth) {
        // 이미 등록된 매물인지 검증
        if(propertyRepository.existsByAddressAndLessorSeq(req.address(), lessorSeqFromAuth)){
            throw new IllegalArgumentException("이미 동일 주소의 매물이 등록되어 있습니다.");
        }

        // 임대인 id, 이름, 매물 주소, 위도, 경도 db에 저장
        Property entity = Property.builder()
                .lessorSeq(lessorSeqFromAuth)
                .lessorNm(lessorNameFromAuth)
                .address(req.address())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .build();

        Property saved = propertyRepository.save(entity);


        return new PropertyAddressResponseDto(
                saved.getPropertySeq(),
                saved.getLessorNm(),
                saved.getAddress(),
                saved.getLatitude(),
                saved.getLongitude()
        );
    }

    /**
     * 등기부등본 pdf 파일 업로드
     * @param propertySeq
     * @param lessorSeq
     * @param file
     * @return
     */
    public String uploadCertificatePdf(Integer propertySeq, Integer lessorSeq, MultipartFile file) {
        // 해당 매물이 유효한지 검증
        Property property = propertyRepository.findByPropertySeqAndLessorSeq(propertySeq, lessorSeq)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 등록한 매물을 찾을 수 없습니다."));

        // 파일이 유효한지 검증
        if(file == null || file.isEmpty()) throw new IllegalArgumentException("빈 파일 입니다.");

        // 파일 타입이 pdf인지 검증
        String contentType = file.getContentType();
        if(contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new IllegalArgumentException("PDF 파일만 업로드할 수 있습니다.");
        }

        // S3에 pdf 파일 업로드
        String url = storageService.uploadPdf(file, "certificates/%d/".formatted(propertySeq));

        // db에 pdf 파일 url 업로드 및 검증 상태 등록
        property.saveCertificateUrl(url);
        property.updateIsCertificated(false); //업로드 시점엔 미검증 상태
        return url;
    }

    public void VerifyCertificate(Integer propertySeq, Integer lessorSeq, boolean verified) {
        //매물이 유효한지 검증
        Property property = propertyRepository.findByPropertySeqAndLessorSeq(propertySeq, lessorSeq)
                .orElseThrow(() -> new IllegalArgumentException("매물을 찾을 수 없습니다."));
        //매물의 검증 여부 업데이트
        property.updateIsCertificated(verified);
    }

}
