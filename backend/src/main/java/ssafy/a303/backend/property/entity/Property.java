package ssafy.a303.backend.property.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.boot.context.properties.bind.DefaultValue;
import ssafy.a303.backend.property.enums.Building;
import ssafy.a303.backend.property.enums.Facing;
import ssafy.a303.backend.property.enums.VerificationStatus;
import ssafy.a303.backend.user.entity.User;

import java.sql.Timestamp;

@Entity
@Table(name="property")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_seq")
    private Integer propertySeq;

    @OneToOne(mappedBy = "property", fetch = FetchType.LAZY)
    private PropertyAucInfo aucInfo;

    // 임대인 이름
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lessor_seq", nullable = false)
    private User lessor;

    // 중개인 user seq
    @Column(name = "brk_seq")
    private Integer brkSeq;

    // 매물 설명
    @Column(name = "content")
    private String content;

    //매물 주인 이름
    @Column(name = "lessor_nm", length = 50)
    private String lessorNm; 

    // 매물 이름
    @Column(name = "property_nm", length = 100)
    private String propertyNm;

    // 건물 타입
    @Enumerated(EnumType.STRING)
    private Building buildingType;

    @Column(name = "address", nullable = false, length = 150)
    private String address;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "is_certificated")
    private Boolean isCertificated; // 등기부등본 확인 여부

    @Column(name = "area")
    private Double area;

    @Column(name = "area_p")
    private Integer areaP; //평수

    @Column(name = "deposit")
    private Long deposit;

    @Column(name = "mn_rent")
    private Integer mnRent;

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
    private Byte roomCnt;

    @Column(name = "bathroom_cnt")
    private Byte bathroomCnt;

    @Column(name = "construction_date", length = 20)
    private String constructionDate;

    @Column(name = "parking_cnt")
    private Byte parkingCnt;

    @Column(name = "has_elevator")
    private Boolean hasElevator;

    @Column(name = "pet_available")
    private Boolean petAvailable;

    @Column(name = "min_auc")
    private Integer minAuc;

    @Column(name = "deleted_at", length = 50)
    private String deletedAt;

    @Column(name = "traded_at", length = 50)
    private String tradedAt;

    //중개인 매칭 완료 되었는지
    @Column(name = "has_brk")
    @ColumnDefault("false")
    private Boolean hasBrk;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;


    public void updateIsCertificated(Boolean isCertificated){
        this.isCertificated = isCertificated;
    }

    public void updateThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public void delete(String deletedAt){
        this.deletedAt = deletedAt;
    }
}
