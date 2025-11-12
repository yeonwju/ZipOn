package ssafy.a303.backend.property.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.*;
import ssafy.a303.backend.property.entity.Certification;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.entity.PropertyAucInfo;
import ssafy.a303.backend.property.entity.PropertyImage;
import ssafy.a303.backend.property.enums.VerificationStatus;
import ssafy.a303.backend.property.repository.CertificationRepository;
import ssafy.a303.backend.property.repository.PropertyAucInfoRepository;
import ssafy.a303.backend.property.repository.PropertyImageRepository;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.property.util.S3Uploader;
import ssafy.a303.backend.search.service.PropertySearchService;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyAucInfoRepository propertyAucInfoRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final CertificationRepository certificationRepository;
    private final S3Uploader s3Uploader;
    private final PropertySearchService propertySearchService;

    @Value("${app.s3.expose:presigned}")
    private String exposeMode;

    /**
     * 매물 상세 정보 등록
     * @param userSeq
     * @param req
     * @param images
     * @return
     */
    @Transactional
    public PropertyRegiResponseDto submitDetail(Integer userSeq, PropertyDetailRequestDto req, List<MultipartFile> images) {

        //로그인 유저와 등록하려는 사람의 이름이 동일한지.
        //token에 이름 정보


        // 매물 정보 등록
        Property p = Property.builder()
                .lessorSeq(userSeq)
                .address(req.address())
                .propertyNm(req.propertyNm())
                .buildingType(req.buildingType())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .lessorNm(req.lessorNm())
                .content(req.content())
                .area(req.area())
                .areaP(req.areaP())
                .deposit(req.deposit())
                .mnRent(req.mnRent())
                .fee(req.fee())
                .period(req.period())
                .floor(req.floor())
                .facing(req.facing())
                .roomCnt(req.roomCnt())
                .constructionDate(req.constructionDate())
                .bathroomCnt(req.bathroomCnt())
                .parkingCnt(req.parkingCnt())
                .hasElevator(req.hasElevator())
                .petAvailable(req.petAvailable())
                .hasBrk(false)
                .isCertificated(req.isCertificated())
                .build();
        propertyRepository.save(p);

        // 경매, 중개인 희망 등록
        PropertyAucInfo aucInfo = PropertyAucInfo.builder()
                .property(p)
                .isAucPref(req.isAucPref())
                .isBrkPref(req.isBrkPref())
                .aucAt(req.aucAt())
                .aucAvailable(req.aucAvailable())
                .build();
        propertyAucInfoRepository.save(aucInfo);

        Certification c = Certification.builder()
                .propertySeq(p.getPropertySeq())
                .pdfCode(req.pdfCode())
                .riskScore(req.riskScore())
                .riskReason(req.riskReason())
                .verificationStatus(VerificationStatus.PASSED)
                .build();

        // 이미지 S3 업로드
        List<String> s3keys = new ArrayList<>();
        List<String> imageUrls = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            if (images.size() >= 20) {
                throw new CustomException(ErrorCode.IMAGE_LIMIT_EXCEEDS);
            }

            int sortOrder = 1;
            try {
                for (MultipartFile file : images) {
                    if (file.isEmpty()) continue;

                    String key = s3Uploader.uploadImage(p.getPropertySeq(), file);
                    s3keys.add(key);

                    PropertyImage img = PropertyImage.builder()
                            .propertySeq(p.getPropertySeq())
                            .s3Key(key)
                            .imgOrder(sortOrder++)
                            .build();
                    propertyImageRepository.save(img);

                    // 외부 노출 임시 URL 방식
                    imageUrls.add(s3Uploader.presignedGetUrl(key, Duration.ofHours(12)));
                }

                /** 첫번째 사진을 썸네일로 설정 */
                if(!s3keys.isEmpty()) {
                    p.updateThumbnail(s3keys.get(0));
                }

                log.info("[PropertyService] 저장된 썸네일 sw key = {}", s3keys.get(0));

            } catch (Exception e) {
                for (String k : s3keys) {
                    try {
                        s3Uploader.delete(k);
                    } catch (Exception ignore) {
                    }
                }
                throw e;
            }
        }

        /** ES 색인 */
        try {
            propertySearchService.setIndex(p);
        } catch (Exception e) {
            log.error("[ES] 매물 최종 등록 이후, 색인 실패, propertySeq = {}", p.getPropertySeq(), e);
        }

        return new PropertyRegiResponseDto(
                p.getPropertySeq()
        );
    }

    /**
     * 매물 상세 정보 조회
     * @param propertySeq
     * @return
     */
    @Transactional
    public DetailResponseDto getPropertyDetail(Integer propertySeq) {

        /** 매물 존재 확인 */
        Property p = propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        /** 경매 정보 확인 */
        PropertyAucInfo aucInfo = propertyAucInfoRepository.findByProperty(p)
                .orElseThrow(() -> new CustomException(ErrorCode.AUC_INFO_NOT_FOUND));

        /** AI 등기부등본 검증 확인 */
        Certification cert = certificationRepository.findByPropertySeq(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CERTIFICATION_INFO_NOT_FOUND));

        /** 이미지 정보 매핑 */
        List<PropertyImage> propertyImages = propertyImageRepository.findByPropertySeqOrderByImgOrderAsc(propertySeq);

        List<ImageDto> images = propertyImages.stream()
                .map(img -> new ImageDto(
                        img.getS3Key(),
                        toUrl(img.getS3Key()),
                        img.getImgOrder()
                ))
                .toList();

        DetailResponseDto detail = new DetailResponseDto(
                propertySeq, p.getLessorNm(), p.getPropertyNm(), p.getContent(),
                p.getAddress(), p.getLatitude(), p.getLongitude(), p.getBuildingType(),
                p.getArea(), p.getAreaP(),
                p.getDeposit(), p.getMnRent(), p.getFee(),
                images,
                p.getPeriod(), p.getFloor(), p.getFacing(), p.getRoomCnt(), p.getBathroomCnt(), p.getConstructionDate(),
                p.getParkingCnt(), p.getHasElevator(), p.getPetAvailable(),
                aucInfo.getIsAucPref(), aucInfo.getIsBrkPref(),
                p.getHasBrk(),
                aucInfo.getAucAt(), aucInfo.getAucAvailable(),
                cert.getPdfCode(), p.getIsCertificated(), cert.getRiskScore(), cert.getRiskReason()
        );
        return detail;
    }

    private String toUrl(String key) {
        if ("public".equalsIgnoreCase(exposeMode)) {
            return s3Uploader.publicUrl(key);
        }
        // default = presigned 12h
        return s3Uploader.presignedGetUrl(key, java.time.Duration.ofHours(12));
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
    public List<PropertyMapDto> getMapPoints(Double minLat, Double maxLat, Double minLng, Double maxLng) {
        return propertyRepository.findForMap(minLat, maxLat, minLng, maxLng);
    }

    /**
     * 수정/삭제 가능 여부
     * 해당 유저가 등록한 매물인지 확인
     * @param p
     * @param userSeq
     */
    public void assertCanEdit(Property p, Integer userSeq) {
        if(userSeq == null || !Objects.equals(userSeq, p.getLessorSeq()))
            throw new CustomException(ErrorCode.NO_AUTHORIZATION);
    }

    /**
     * 매물 수정
     * @param propertySeq
     * @param req
     * @param userSeq
     * @return
     */
    @Transactional
    public PropertyUpdateResponseDto updateProperty(Integer propertySeq, PropertyUpdateRequestDto req, Integer userSeq){
        Property p = propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        assertCanEdit(p, userSeq);

        if (req.content() != null) p.setContent(req.content());
        if (req.area() != null) p.setArea(req.area());
        if (req.areaP() != null) p.setAreaP(req.areaP());
        if (req.deposit() != null) p.setDeposit(req.deposit());
        if (req.mnRent() != null) p.setMnRent(req.mnRent());
        if (req.fee() != null) p.setFee(req.fee());
        if (req.period() != null) p.setPeriod(req.period());
        if (req.floor() != null) p.setFloor(req.floor());
        if (req.facing() != null) p.setFacing(req.facing());
        if (req.roomCnt() != null) p.setRoomCnt(req.roomCnt());
        if (req.bathroomCnt() != null) p.setBathroomCnt(req.bathroomCnt());
        if (req.constructionDate() != null) p.setConstructionDate(req.constructionDate());
        if (req.parkingCnt() != null) p.setParkingCnt(req.parkingCnt());
        if (req.hasElevator() != null) p.setHasElevator(req.hasElevator());
        if (req.petAvailable() != null) p.setPetAvailable(req.petAvailable());

        return new PropertyUpdateResponseDto(
                p.getPropertySeq(), p.getContent(), p.getArea(), p.getAreaP(),
                p.getDeposit(), p.getMnRent(), p.getFee(),
                p.getPeriod(), p.getFloor(), p.getFacing(), p.getRoomCnt(), p.getBathroomCnt(),
                p.getConstructionDate(), p.getParkingCnt(), p.getHasElevator(), p.getPetAvailable()
        );
    }

    /**
     * 매물 삭제, 삭제일시 저장.
     * @param propertySeq
     * @param userSeq
     */
    @Transactional
    public void deleteProperty(Integer propertySeq, Integer userSeq) {
        Property p =propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        assertCanEdit(p, userSeq);
        p.delete(OffsetDateTime.now(ZoneId.of("Asia/Seoul")).toString());
    }

}
