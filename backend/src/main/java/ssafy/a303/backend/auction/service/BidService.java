package ssafy.a303.backend.auction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.entity.Bid;
import ssafy.a303.backend.auction.entity.BidStatus;
import ssafy.a303.backend.auction.repository.BidRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.helper.KoreaClock;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.contract.entity.Contract;
import ssafy.a303.backend.contract.repository.ContractRepository;
import ssafy.a303.backend.property.entity.Property;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ContractRepository contractRepository;

    @Transactional
    public int acceptOffer(int userSeq, int auctionSeq) {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());

        // 1. 이 유저에게 현재 OFFERED 상태인 입찰 찾기
        Bid myBid = bidRepository
                .findBidByUser_UserSeqAndAuction_AuctionSeqAndStatus(
                        userSeq,
                        auctionSeq,
                        BidStatus.OFFERED
                )
                .orElseThrow(() -> new CustomException(ErrorCode.BID_NOT_FOUND));

        Auction auction = myBid.getAuction();

        // 2. 내 Bid를 ACCEPTED로 변경
        myBid.setStatus(BidStatus.ACCEPTED);
        myBid.setDecidedAt(now);

        // 3. 같은 경매의 다른 Bid 들 LOST 처리 (OFFERED / WAITING 대상)
        List<Bid> allBids = bidRepository.findByAuction_AuctionSeq(auctionSeq);

        for (Bid bid : allBids) {
            // 내 Bid는 건너뜀
            if (bid.getBidSeq().equals(myBid.getBidSeq())) {
                continue;
            }

            // 아직 결과가 안 난 상태들만 LOST 처리
            if (bid.getStatus() != BidStatus.ACCEPTED) {
                bid.setStatus(BidStatus.LOST);
                bid.setDecidedAt(now);
            }
        }

        // 4. 경매에 winnerSeq 설정
        auction.setWinnerSeq(userSeq);

        // 5. 계약서 테이블 삽입
        Property p = auction.getProperty();
        Contract contract = new Contract();
        contract.setPropertySeq(p.getPropertySeq());
        contract.setAucMnRent(myBid.getBidAmount());
        contract.setLessorSeq(p.getLessor().getUserSeq());
        contract.setLesseeSeq(userSeq);
        contract.setBrkSeq(auction.getUser().getUserSeq());
        contract.setIsAgree(false);

        contractRepository.save(contract);
        return contract.getContractSeq();
    }

    @Transactional
    public void rejectOffer(int userSeq, int auctionSeq) {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());

        // 1. 현재 이 유저에게 OFFERED 상태인 입찰 찾기
        Bid bid = bidRepository
                .findBidByUser_UserSeqAndAuction_AuctionSeqAndStatus(
                        userSeq,
                        auctionSeq,
                        BidStatus.OFFERED
                )
                .orElseThrow(() -> new CustomException(ErrorCode.BID_NOT_FOUND));

        // 2. 상태를 REJECTED로 변경
        bid.setStatus(BidStatus.REJECTED);
        bid.setDecidedAt(now);
    }

    public int getBidAmount(int userSeq, int auctionSeq) {
        Bid bid = bidRepository.findBidByUser_UserSeqAndAuction_AuctionSeqAndStatus(userSeq, auctionSeq, BidStatus.ACCEPTED).orElseThrow(
                () -> new CustomException(ErrorCode.BID_NOT_FOUND)
        );
        return bid.getBidAmount();
    }
}
