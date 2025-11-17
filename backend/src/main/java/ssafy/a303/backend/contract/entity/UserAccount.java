package ssafy.a303.backend.contract.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "user_account")
@Getter
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_account_seq")
    private Integer userAccountSeq;

    @Column(name = "user_seq")
    private Integer userSeq;

    @Column(name = "bank_code")
    private String bankCode;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_no")
    private String accountNo;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;
}
