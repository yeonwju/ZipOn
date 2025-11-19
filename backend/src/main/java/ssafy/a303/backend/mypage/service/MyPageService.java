package ssafy.a303.backend.mypage.service;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.contract.entity.Contract;
import ssafy.a303.backend.contract.enums.ContractStatus;
import ssafy.a303.backend.contract.repository.ContractRepository;
import ssafy.a303.backend.mypage.dto.MyAuctionResponseDto;
import ssafy.a303.backend.mypage.dto.MyBrokerResponseDto;
import ssafy.a303.backend.mypage.dto.MyPropertyResponseDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.property.util.S3Uploader;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ssafy.a303.backend.auction.entity.BidStatus.ACCEPTED;

@Service
@Transactional
@Log4j2
public class MyPageService {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final PropertyRepository propertyRepository;
    private final ContractRepository contractRepository;
    private final S3Uploader s3Uploader;

    public MyPageService(UserRepository userRepository, AuctionRepository auctionRepository, PropertyRepository propertyRepository, ContractRepository contractRepository, S3Uploader s3Uploader) {
        this.userRepository = userRepository;
        this.auctionRepository = auctionRepository;
        this.propertyRepository = propertyRepository;
        this.contractRepository = contractRepository;
        this.s3Uploader = s3Uploader;
    }

    /**
     * 나의 경매 참여 내역+각 경매별 순위를 단일 쿼리로 조회
     */
    public List<MyAuctionResponseDto> getMyAuctions(Integer userSeq) {

        //1. User 조회
        userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        //2. 해당 유저가 참여한 경매 내역 리스트 조회 (순위 포함)
        List<Object[]> results = auctionRepository.getMyAuctionsWithRank(userSeq);

        return results.stream().map(row -> {
            String thumbnail = (String) row[0];

            // 변경됨: 썸네일 presigned URL 적용
            String thumbnailUrl = (thumbnail != null && !thumbnail.isBlank())
                    ? s3Uploader.presignedGetUrl(thumbnail, Duration.ofHours(12))
                    : null;

            Integer auctionSeq = ((Integer) row[1]);
            Integer propertySeq = (Integer) row[2];
            BidStatus bidStatus = (BidStatus) row[3];
            String address = (String) row[4];
            Integer bidAmount = (Integer) row[5];
            int bidRank = ((Long) row[6]).intValue();

            // 계약 seq 조회
            Integer contractSeq = null;
            //계약 상태 조회
            ContractStatus contractStatus = null;

            if (bidStatus.equals(ACCEPTED)) {
                Optional<Contract> contractOpt = contractRepository
                        .findTopByPropertySeqOrderByCreatedAtDesc(propertySeq);

                if (contractOpt.isPresent()) {
                    Contract contract = contractOpt.get();
                    contractSeq = contract.getContractSeq();
                    contractStatus = contract.getContractStatus();
                }
            }

            return MyAuctionResponseDto.builder()
                    .thumbnail(thumbnailUrl)
                    .auctionSeq(auctionSeq)
                    .propertySeq(propertySeq)
                    .contractSeq(contractSeq)
                    .contractStatus(contractStatus)
                    .bidStatus(bidStatus)
                    .address(address)
                    .bidAmount(bidAmount)
                    .bidRank(bidRank)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * 나의 매물 내역 조회
     */
    public List<MyPropertyResponseDto> getMyProperties(Integer userSeq) {

        //1. User 조회
        userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        //2. 나의 매물 내역 조회 (lessor가 본인인 매물)
        List<Property> properties = propertyRepository.findByLessorUserSeq(userSeq);

        //3. DTO 변환
        return properties.stream().map(property -> {

            // 변경됨: 매물 썸네일 presigned URL 적용
            String thumbnailUrl = (property.getThumbnail() != null && !property.getThumbnail().isBlank())
                    ? s3Uploader.presignedGetUrl(property.getThumbnail(), Duration.ofHours(12))
                    : null;

            return MyPropertyResponseDto.builder()
                    .thumbnail(thumbnailUrl)
                    .propertySeq(property.getPropertySeq())
                    .buildingType(property.getBuildingType())
                    .address(property.getAddress())
                    .deposit(property.getDeposit() != null ? property.getDeposit().intValue() : 0)
                    .mnRent(property.getMnRent())
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * 나의 중개 내역 조회
     */
    public List<MyBrokerResponseDto> getMyBrokerage(Integer userSeq) {
        //1. User 조회
        userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        //2. 중개인이 중개한 경매 목록 조회
        List<Auction> auctions = auctionRepository.findByUserSeqWithProperty(userSeq);

        //3. DTO 변환
        return auctions.stream().map(auction -> {
            Property property = auction.getProperty();

            // 변경됨: 매물 썸네일 presigned URL 적용
            String thumbnailUrl = (property.getThumbnail() != null && !property.getThumbnail().isBlank())
                    ? s3Uploader.presignedGetUrl(property.getThumbnail(), Duration.ofHours(12))
                    : null;

            return MyBrokerResponseDto.builder()
                    .thumbnail(thumbnailUrl)
                    .propertySeq(property.getPropertySeq())
                    .auctionSeq(auction.getAuctionSeq())
                    .auctionStatus(auction.getStatus())
                    .buildingType(property.getBuildingType())
                    .address(property.getAddress())
                    .deposit(property.getDeposit() != null ? property.getDeposit().intValue() : 0)
                    .mnRent(property.getMnRent())
                    .build();
        }).collect(Collectors.toList());
    }

}
