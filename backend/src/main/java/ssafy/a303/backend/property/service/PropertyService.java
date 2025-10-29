package ssafy.a303.backend.property.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;
import ssafy.a303.backend.property.dto.response.DetailResponseDto;
import ssafy.a303.backend.property.dto.response.PropertyAddressResponseDto;
import ssafy.a303.backend.property.dto.response.PropertyMapDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.entity.PropertyAucInfo;
import ssafy.a303.backend.property.repository.PropertyAucInfoRepository;
import ssafy.a303.backend.property.repository.PropertyImageRepository;
import ssafy.a303.backend.property.repository.PropertyRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyAucInfoRepository propertyAucInfoRepository;
    private final PropertyImageRepository propertyImageRepository;

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
                .lessorNm(req.lessorNm())
                .propertyNm(req.propertyNm())
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
    @Transactional
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

    /**
     * 등기부등본 검증 여부를 fast api에서 받아서 등록.
     * @param propertySeq
     * @param lessorSeq
     * @param verified
     */
    @Transactional
    public void verifyCertificate(Integer propertySeq, Integer lessorSeq, boolean verified) {
        //매물이 유효한지 검증
        Property property = propertyRepository.findByPropertySeqAndLessorSeq(propertySeq, lessorSeq)
                .orElseThrow(() -> new IllegalArgumentException("매물을 찾을 수 없습니다."));
        //매물의 검증 여부 업데이트
        property.updateIsCertificated(verified);
    }

    /**
     * 매물 상세 정보 등록
     * @param propertySeq
     * @param lessorSeq
     * @param req
     */
    @Transactional
    public void submitPropertyDetail(Integer propertySeq, Integer lessorSeq, PropertyDetailRequestDto req) {
        // 매물 소유권 확인
        Property p = propertyRepository.findByPropertySeqAndLessorSeq(propertySeq, lessorSeq)
                .orElseThrow(()->new IllegalArgumentException("매물을 찾을 수 없거나 권한이 없습니다."));

        // 상세 정보 등록
        if (req.content() != null) p.setContent(req.content());
        if (req.area() != null) p.setArea(req.area());
        if (req.areaP() != null) p.setAreaP(req.areaP());
        if (req.deposit() != null) p.setDeposit(req.deposit());
        if (req.mnRent() != null) p.setMnRent(req.mnRent());
        if (req.fee() != null) p.setFee(req.fee());
        if (req.thumbnail() != null) p.setThumbnail(req.thumbnail());
        if (req.period() != null) p.setPeriod(req.period());
        if (req.floor() != null) p.setFloor(req.floor());
        if (req.facing() != null) p.setFacing(req.facing());
        if (req.roomCnt() != null) p.setRoomCnt(req.roomCnt());
        if (req.bathroomCnt() != null) p.setBathroomCnt(req.bathroomCnt());
        if (req.constructionDate() != null) p.setConstructionDate(req.constructionDate());
        if (req.parkingCnt() != null) p.setParkingCnt(req.parkingCnt());
        if (req.hasElevator() != null) p.setHasElevator(req.hasElevator());
        if (req.petAvailable() != null) p.setPetAvailable(req.petAvailable());

        // 경매, 중개인 희망 등록
        PropertyAucInfo info = propertyAucInfoRepository.findByPropertySeq(propertySeq)
                .orElseGet(()->PropertyAucInfo.builder()
                        .propertySeq(propertySeq)
                        .build());

        if (req.isAucPref() != null) info.setIsAucPref(req.isAucPref());
        if (req.isBrkPref() != null) info.setIsBrkPref(req.isBrkPref());
        if (req.aucAt() != null) info.setAucAt(req.aucAt());
        if (req.aucAvailable() != null) info.setAucAvailable(req.aucAvailable());

        propertyAucInfoRepository.save(info);
    }

    /**
     * 매물 상세 정보 조회
     * @param propertySeq
     * @return
     */
    @Transactional
    public DetailResponseDto getPropertyDetail(Integer propertySeq) {
        Property p = propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElseThrow(() -> new IllegalArgumentException("해당 매물을 조회할 수 없습니다."));

        PropertyAucInfo aucInfo = propertyAucInfoRepository.findByPropertySeq(propertySeq)
                .orElseThrow(() -> new IllegalArgumentException("해당 매물 경매 정보가 없습니다."));


        // 이미지 리스트
        List<String> images = propertyImageRepository.findByPropertySeqOrderBySortOrderAsc(propertySeq)
                .stream()
                .map(img -> img.getS3Key())
                .toList();

        DetailResponseDto detail = new DetailResponseDto(
                p.getLessorNm(),
                p.getPropertyNm(),
                p.getContent(),
                p.getAddress(),
                p.getLatitude(),
                p.getLongitude(),
                p.getArea(),
                p.getAreaP(),
                p.getDeposit(),
                p.getMnRent(),
                p.getFee(),
                images,
                p.getPeriod(),
                p.getFloor(),
                p.getFacing(),
                p.getRoomCnt(),
                p.getBathroomCnt(),
                p.getConstructionDate(),
                p.getParkingCnt(),
                p.getHasElevator(),
                p.getPetAvailable(),
                aucInfo.getIsAucPref(),
                aucInfo.getIsBrkPref(),
                aucInfo.getAucAt(),
                aucInfo.getAucAvailable()
        );
        return detail;
    }

    /**
     * 지도 좌표 전체/부분 조회
     * @param minLat
     * @param maxLat
     * @param minLng
     * @param maxLng
     * @return
     */
    @Transactional
    public List<PropertyMapDto> getMapPoints(Integer minLat, Integer maxLat, Integer minLng, Integer maxLng) {
        return propertyRepository.findForMap(minLat, maxLat, minLng, maxLng);
    }
}
