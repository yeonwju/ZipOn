package ssafy.a303.backend.contract.entity;

import jakarta.persistence.*;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.contract.enums.VirtualAccountStatus;

import java.sql.Timestamp;

@Entity
@Table(name = "virtual_account")
@Builder
public class VirtualAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "virtual_account_seq")
    private Integer virtualAccountSeq;

    // contract 테이블과 1:1 연결
    @Column(name = "contract_seq", nullable = false)
    private Integer contractSeq;

    // ssafy api에서 받은 계좌번호
    @Column(name = "account_no", nullable = false, length = 50)
    private String accountNo;

    // 은행 이름
    @Column(name = "bank_nm", nullable = false, length = 50)
    private String bankNm;

    // 첫월세
    @Column(name = "target_amount", nullable = false)
    private Integer targetAmount;

    // 현재 입금액
    @Column(name = "current_amount", nullable = false)
    private Integer currentAmount;

    //
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private VirtualAccountStatus status;

    @Column(name = "expired_at")
    private Timestamp expiredAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;


}
