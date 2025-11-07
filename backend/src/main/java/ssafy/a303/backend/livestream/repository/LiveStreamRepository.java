package ssafy.a303.backend.livestream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.livestream.entity.LiveStream;
import ssafy.a303.backend.user.entity.User;

import java.util.List;
import java.util.Optional;

public interface LiveStreamRepository extends JpaRepository<LiveStream, Integer> {

    // 진행 중인 방송 목록
    List<LiveStream> findByStatusOrderByStartAtDesc(LiveStream status);

    // 특정 경매의 방송
    //Optional<LiveStream> findByAuctionAndStatus(Auction auction, LiveStream status);

}
