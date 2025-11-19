package ssafy.a303.backend.property.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.entity.PropertyAucInfo;

import java.util.Optional;

public interface PropertyAucInfoRepository extends JpaRepository<PropertyAucInfo, Integer> {
    Optional<PropertyAucInfo> findByProperty(Property property);

    //1) general
    Page<PropertyAucInfo> findByIsAucPrefAndProperty_DeletedAtIsNull(
            Boolean isAucPref,
            Pageable pageable
    );

    //2) broker
    Page<PropertyAucInfo> findByIsBrkPrefAndProperty_DeletedAtIsNull(
            Boolean isBrkPref,
            Pageable pageable
    );

    // 3) auction
//    Page<PropertyAucInfo> findByIsAucPrefAndProperty_DeletedAtIsNull(
//            Boolean isAucPref,
//            Pageable pageable
//    );


}
