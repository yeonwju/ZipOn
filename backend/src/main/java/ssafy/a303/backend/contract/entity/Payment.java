package ssafy.a303.backend.contract.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.a303.backend.contract.enums.PaymentStatus;
import ssafy.a303.backend.contract.enums.PaymentType;

import java.sql.Timestamp;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_seq")
    private Integer paymentSeq;

    @Column(name = "contract_seq", nullable = false)
    private Integer contractSeq;

    @Column(name = "virtual_account_seq")
    private Integer virtualAccountSeq;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 30)
    private PaymentType paymentType;

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus;

    @Column(name = "paid_at")
    private Timestamp paidAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;
}
