package ssafy.a303.backend.mypage.service;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.AttendanceStatus;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.mypage.dto.MyAuctionResponseDto;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
public class MyPageService {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;

    public MyPageService(UserRepository userRepository, AuctionRepository auctionRepository) {
        this.userRepository = userRepository;
        this.auctionRepository = auctionRepository;
    }

    /**
     * 나의 경매 참여 내역 + 각 경매별 순위를 단일 쿼리로 조회
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
                    .attendanceStatus((AttendanceStatus) row[3])
                    .address((String) row[4])
                    .bidAmount((Integer) row[5])
                    .bidRank(((Long) row[6]).intValue()) // COUNT 결과는 Long
                    .build();
        }).collect(Collectors.toList());
    }
}
