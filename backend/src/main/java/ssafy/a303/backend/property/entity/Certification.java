package ssafy.a303.backend.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.property.enums.VerificationStatus;

import java.sql.Timestamp;

@Entity
@Table(name = "certification")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @Column(name = "property_seq")
    private Integer propertySeq;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "property_seq")
    private Property property;

    @Column(name = "pdf_code")
    private String pdfCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "verificaton_status")
    private VerificationStatus verificationStatus;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_reason")
    private String riskReason;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

}
