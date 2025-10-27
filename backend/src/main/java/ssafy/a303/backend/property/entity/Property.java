package ssafy.a303.backend.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ssafy.a303.backend.property.enums.Facing;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name="property")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_seq")
    private Integer propertySeq;

    @Column(name = "lessor_seq", nullable = false)
    private Integer lessorSeq;

    @Column(name = "brk_seq")
    private Integer brkSeq;

    @Column(name = "lessor_nm", length = 50)
    private String lessorName; //매물 주인 이름

    @Column(name = "property_nm", length = 100)
    private String propertyName;

    @Column(name = "address", nullable = false, length = 150)
    private String address;

    @Column(name = "latitude", nullable = false)
    private Integer latitude;

    @Column(name = "longitude", nullable = false)
    private Integer longitude;

    @Column(name = "is_certificated")
    private Boolean isCertificated; // 등기부등본 확인 여부

    @Column(name = "area")
    private Double area;

    @Column(name = "area_p")
    private Integer areaP; //평수

    @Column(name = "deposit")
    private Long deposit;

    @Column(name = "mn_rent")
    private Integer monthlyRent;

    @Column(name = "fee")
    private Integer fee; // 관리비

    @Column(name = "thumbnail")
    private String thumbnail; // 썸네일 사진 S3 주소

    @Column(name = "period")
    private Byte period;

    @Column(name = "floor")
    private Byte floor;

    @Enumerated(EnumType.STRING)
    private Facing facing; // 방향

    @Column(name = "room_cnt")
    private Byte roomCount;

    @Column(name = "bathroom_cnt")
    private Byte bathroomCount;

    @Column(name = "construction_date", length = 10)
    private String constructionDate;

    @Column(name = "parking_cnt")
    private Byte parkingCount;

    @Column(name = "has_elevator")
    private Boolean hasElevator;

    @Column(name = "pet_available")
    private Boolean petAvailable;

    @Column(name = "min_auc")
    private Integer minAuction;

    @Column(name = "deleted_at", length = 10)
    private String deletedAt;

    @Column(name = "traded_at", length = 10)
    private String tradedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

}
