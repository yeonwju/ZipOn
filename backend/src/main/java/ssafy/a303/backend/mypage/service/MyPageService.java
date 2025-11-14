package ssafy.a303.backend.mypage.service;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.mypage.dto.MyAuctionResponseDto;
import ssafy.a303.backend.mypage.dto.MyBrokerResponseDto;
import ssafy.a303.backend.mypage.dto.MyPropertyResponseDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
public class MyPageService {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final PropertyRepository propertyRepository;

    public MyPageService(UserRepository userRepository, AuctionRepository auctionRepository, PropertyRepository propertyRepository) {
        this.userRepository = userRepository;
        this.auctionRepository = auctionRepository;
        this.propertyRepository = propertyRepository;
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
            // Object[] 매핑
            // 0: thumbnail, 1: auctionSeq, 2: propertySeq, 3: status, 4: address, 5: bidAmount, 6: bidRank
            return MyAuctionResponseDto.builder()
                    .thumbnail((String) row[0])
                    .auctionSeq(((Integer) row[1]).longValue())
                    .propertySeq(((Integer) row[2]).longValue())
                    .bidStatus((BidStatus) row[3])
                    .address((String) row[4])
                    .bidAmount((Integer) row[5])
                    .bidRank(((Long) row[6]).intValue()) // COUNT 결과는 Long
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
        return properties.stream().map(property ->
                MyPropertyResponseDto.builder()
                        .thumbnail(property.getThumbnail())
                        .propertySeq(property.getPropertySeq())
                        .buildingType(property.getBuildingType())
                        .address(property.getAddress())
                        .deposit(property.getDeposit() != null ? property.getDeposit().intValue() : 0)
                        .mnRent(property.getMnRent())
                        .build()
        ).collect(Collectors.toList());
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
            return MyBrokerResponseDto.builder()
                    .thumbnail(property.getThumbnail())
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
