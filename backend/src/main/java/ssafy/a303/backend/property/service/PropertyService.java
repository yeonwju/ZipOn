package ssafy.a303.backend.property.service;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.AuctionStatus;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.helper.KoreaClock;
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
import ssafy.a303.backend.search.dto.SearchResponseDto;
import ssafy.a303.backend.search.service.PropertySearchService;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.*;
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
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;

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

        User lessor = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 매물 정보 등록
        Property p = Property.builder()
                .lessor(lessor)
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
        certificationRepository.save(c);

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

        /** 중개인 없이 스스로 경매 라이브 진행하면 바로 Auction 테이블에 경매 정보 저장 */
        if(!req.isBrkPref() && req.isAucPref()) {
            Auction a = Auction.builder()
                    .user(lessor)
                    .property(p)
                    .strmDate(req.aucAt().toLocalDate())
                    .strmStartTm(req.aucAt().toLocalTime())
                    .strmEndTm(req.aucAt().toLocalTime().plusHours(1))
                    .auctionEndAt(LocalDateTime.of(
                            req.aucAt().toLocalDate().plusDays(1),
                            LocalTime.parse("12:00:00")
                    ))
                    .status(AuctionStatus.ACCEPTED)
                    .build();
            auctionRepository.save(a);
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

        /** 매칭이 성사되어 라이브가 진행되는 경매 정보 가져오기 */
        Auction auction = auctionRepository.findByProperty_PropertySeqAndStatus(propertySeq, AuctionStatus.ACCEPTED)
                .orElse(null);

        LocalDateTime liveAt = null;
        if(auction == null) {
            liveAt = null;
        } else {
            liveAt = LocalDateTime.of(auction.getStrmDate(), auction.getStrmStartTm());
        }

        /** 중개인 없이 자기가 경매 라이브하는 경우 분기 처리 */
        Integer auctionSeq = null;

        if(auction == null) {
            auctionSeq = null;
        } else {
            auctionSeq = auction.getAuctionSeq();
        }

        /** 라이브가 끝난 상태인지 */
        Boolean isLiveDone = false;
        if(auction != null) {
            LocalDateTime liveEndAt = LocalDateTime.of(auction.getStrmDate(), auction.getStrmEndTm());
            isLiveDone = LocalDateTime.now(KoreaClock.getClock()).isAfter(liveEndAt);
        }

        DetailResponseDto detail = new DetailResponseDto(
                p.getLessor().getUserSeq(), p.getLessor().getProfileImg(), liveAt, p.getBrkSeq(), auctionSeq, p.getPropertySeq(), p.getLessorNm(), p.getPropertyNm(), p.getContent(),
                p.getAddress(), p.getLatitude(), p.getLongitude(), p.getBuildingType(),
                p.getArea(), p.getAreaP(),
                p.getDeposit(), p.getMnRent(), p.getFee(),
                images,
                p.getPeriod(), p.getFloor(), p.getFacing(), p.getRoomCnt(), p.getBathroomCnt(), p.getConstructionDate(),
                p.getParkingCnt(), p.getHasElevator(), p.getPetAvailable(),
                aucInfo.getIsAucPref(), aucInfo.getIsBrkPref(),
                p.getHasBrk(),
                aucInfo.getAucAt(), aucInfo.getAucAvailable(), isLiveDone,
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
        if(userSeq == null || !Objects.equals(userSeq, p.getLessor().getUserSeq()))
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
                p.getPropertySeq()
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

        //ES 색인 삭제
        propertySearchService.deleteIndex(p.getPropertySeq());
    }

    /**
     * 매물 타입별로 조회
     */
    public Page<ListResponseDto> listByType(String type, Pageable pageable) {

        Page<PropertyAucInfo> page;

        switch (type.toLowerCase()) {
            case "general" -> {
                page = propertyAucInfoRepository
                        .findByIsAucPrefAndProperty_DeletedAtIsNull(false, pageable);
            }
            case "broker" -> {
                page = propertyAucInfoRepository
                        .findByIsAucPrefAndIsBrkPrefAndProperty_HasBrkAndProperty_DeletedAtIsNull(
                                false,true, false, pageable
                        );
            }
            case "auction" -> {
                page = propertyAucInfoRepository
                        .findByIsAucPrefAndIsBrkPrefAndProperty_DeletedAtIsNull(
                                true, false, pageable
                        );
            }
            default -> throw new CustomException(ErrorCode.REQUEST_TYPE_ERROR);
        }

        return page.map(this::toDto);
    }

    private ListResponseDto toDto(PropertyAucInfo aucInfo) {
        Property p = aucInfo.getProperty();

        String createdAtStr = p.getCreatedAt().toString();

        String lessorNm = p.getLessorNm();
        if (lessorNm == null && p.getLessor() != null) {
            lessorNm = p.getLessor().getName();
        }

        String buildingType = (p.getBuildingType() != null)
                ? p.getBuildingType().name()
                : null;

        Boolean hasBrk = p.getHasBrk();

        Short roomCnt = p.getRoomCnt() != null ? p.getRoomCnt().shortValue() : null;
        Short floor = p.getFloor() != null ? p.getFloor().shortValue() : null;

        return new ListResponseDto(
                p.getPropertySeq(),
                p.getLatitude(),
                p.getLongitude(),
                lessorNm,
                p.getThumbnail(),
                p.getPropertyNm(),
                p.getContent(),
                buildingType,
                p.getAddress(),
                p.getDeposit(),
                p.getMnRent(),
                p.getFee(),
                p.getArea(),
                p.getAreaP(),
                roomCnt,
                floor,
                aucInfo.getIsAucPref(),
                aucInfo.getIsBrkPref(),
                hasBrk,
                createdAtStr
        );
    }

}
