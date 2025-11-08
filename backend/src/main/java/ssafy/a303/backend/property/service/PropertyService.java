package ssafy.a303.backend.property.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;
import ssafy.a303.backend.property.dto.request.PropertyUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.*;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.entity.PropertyAucInfo;
import ssafy.a303.backend.property.entity.PropertyImage;
import ssafy.a303.backend.property.repository.PropertyAucInfoRepository;
import ssafy.a303.backend.property.repository.PropertyImageRepository;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.property.util.S3Uploader;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyAucInfoRepository propertyAucInfoRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final S3Uploader s3Uploader;

    /**
     * 매물 등록 단계 중 첫단계,
     * 매물의 주인과 주소 및 위경도 등록하기.
     * 이후 등기부등본 검증.
     * @param req
     * @param lessorSeqFromAuth
     * @return
     */
    @Transactional
    public PropertyAddressResponseDto submitAddress(PropertyAddressRequestDto req,
                                                    Integer lessorSeqFromAuth) {
        // 이미 등록된 매물인지 검증
        if(propertyRepository.existsByAddressAndLessorSeq(req.address(), lessorSeqFromAuth)){
            throw new CustomException(ErrorCode.ADDRESS_DUPLICATE);
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
                .build();
        propertyRepository.save(p);

        // 경매, 중개인 희망 등록
        PropertyAucInfo aucInfo = PropertyAucInfo.builder()
                .propertySeq(p.getPropertySeq())
                .isAucPref(req.isAucPref())
                .isBrkPref(req.isBrkPref())
                .aucAt(req.aucAt())
                .aucAvailable(req.aucAvailable())
                .build();
        propertyAucInfoRepository.save(aucInfo);

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

                    // 외부 노출 URL 방식
                    imageUrls.add(s3Uploader.presignedGetUrl(key, Duration.ofHours(12)));
                }
            } catch (Exception e) {
                for (String k : s3keys) {
                    try {
                        s3Uploader.delete(k);
                    } catch (Exception ignore) {
                    }
                    throw e;
                }
            }
        }
        return new PropertyRegiResponseDto(
                p.getPropertySeq(),
                p.getLessorNm(),
                p.getPropertyNm(),
                p.getContent(),
                p.getAddress(),
                p.getLatitude(),
                p.getLongitude(),
                p.getBuildingType(),
                p.getArea(),
                p.getAreaP(),
                p.getDeposit(),
                p.getMnRent(),
                p.getFee(),
                s3keys,
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
                p.getIsLinked(),
                aucInfo.getAucAt(),
                aucInfo.getAucAvailable()
        );
    }
    /**
     * 매물 상세 정보 조회
     * @param propertySeq
     * @return
     */
    @Transactional
    public DetailResponseDto getPropertyDetail(Integer propertySeq) {
        Property p = propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));

        PropertyAucInfo aucInfo = propertyAucInfoRepository.findByPropertySeq(propertySeq)
                .orElseThrow(() -> new CustomException(ErrorCode.AUC_INFO_NOT_FOUND));

        // 이미지 리스트
        List<String> images = propertyImageRepository.findByPropertySeqOrderByImgOrderAsc(propertySeq)
                .stream()
                .map(img -> img.getS3Key())
                .toList();

        DetailResponseDto detail = new DetailResponseDto(
                propertySeq, p.getLessorNm(), p.getPropertyNm(), p.getContent(),
                p.getAddress(), p.getLatitude(), p.getLongitude(),
                p.getArea(), p.getAreaP(),
                p.getDeposit(), p.getMnRent(), p.getFee(),
                images,
                p.getPeriod(), p.getFloor(), p.getFacing(), p.getRoomCnt(), p.getBathroomCnt(), p.getConstructionDate(),
                p.getParkingCnt(), p.getHasElevator(), p.getPetAvailable(),
                aucInfo.getIsAucPref(), aucInfo.getIsBrkPref(),
                p.getIsLinked(),
                aucInfo.getAucAt(), aucInfo.getAucAvailable()
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
