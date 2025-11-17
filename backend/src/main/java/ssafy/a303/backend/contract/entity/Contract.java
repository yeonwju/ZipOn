package ssafy.a303.backend.contract.entity;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.contract.enums.ContractStatus;

import java.sql.Timestamp;

@Entity
@Table(name = "contract")
@Getter
@Setter
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_seq")
    private Integer contractSeq;

    @Column(name = "property_seq")
    private Integer propertySeq;

    @Column(name = "auc_mn_rent")
    private Integer aucMnRent;

    @Column(name = "lessor_seq")
    private Integer lessorSeq;

    @Column(name = "lessee_seq")
    private Integer lesseeSeq;

    @Column(name = "brk_seq")
    private Integer brkSeq;

    @Column(name = "is_agree")
    private Boolean isAgree;

    @Column(name = "is_risky")
    private Boolean isRisky;

    @Column(name = "contract_status")
    private ContractStatus contractStatus;

    @Column(name = "is_first_paid")
    private Boolean isFirstPaid;

    @Column(name = "is_received")
    private Boolean isReceived;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    /** 계약 상태 변경 */
    public void updateStatus (ContractStatus status) {
        this.contractStatus = status;
    }

}
