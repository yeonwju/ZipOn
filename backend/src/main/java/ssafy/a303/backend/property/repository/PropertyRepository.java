package ssafy.a303.backend.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.property.dto.response.PropertyMapDto;
import ssafy.a303.backend.property.entity.Property;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {

    // (삭제되지 않은) 매물 조회
    Optional<Property> findByPropertySeqAndDeletedAtIsNull(Integer propertySeq);

    // 매물 개별 조회
    // 지도 좌표 전체 조회
    // 지도 좌표 바운딩 박스 리밋 조회
    @Query("""
    select new ssafy.a303.backend.property.dto.response.PropertyMapDto(
        p.propertySeq, p.address, p.propertyNm, p.latitude, p.longitude,
        p.area, p.areaP, p.deposit, p.mnRent, p.fee, p.facing, p.roomCnt, p.floor, p.hasBrk,
        coalesce(ai.isAucPref, false), coalesce(ai.isBrkPref, false)
      )
      from Property p
      left join PropertyAucInfo ai
            on ai.property.propertySeq = p.propertySeq
      where (p.deletedAt is null or p.deletedAt = '')
        and p.latitude is not null and p.longitude is not null
        and (:minLat is null or p.latitude >= :minLat)
        and (:maxLat is null or p.latitude <= :maxLat)
        and (:minLng is null or p.longitude >= :minLng)
        and (:maxLng is null or p.longitude <= :maxLng)
    """)
    List<PropertyMapDto> findForMap(@Param("minLat") Double minLat,
                                    @Param("maxLat") Double maxLat,
                                    @Param("minLng") Double minLng,
                                    @Param("maxLng") Double maxLng);

    /**
     * 특정 유저가 등록한 매물 목록 조회 (삭제되지 않은 매물만)
     * 최신 등록 순으로 정렬
     */
    @Query("""
    SELECT p
    FROM Property p
    WHERE p.lessor.userSeq = :userSeq
    AND (p.deletedAt IS NULL OR p.deletedAt = '')
    ORDER BY p.createdAt DESC
    """)
    List<Property> findByLessorUserSeq(@Param("userSeq") Integer userSeq);

}
