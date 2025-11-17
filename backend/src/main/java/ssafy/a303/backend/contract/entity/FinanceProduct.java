package ssafy.a303.backend.contract.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Entity
@Table(name = "finance_product")
@Getter
@Builder
@AllArgsConstructor
public class FinanceProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "finance_product_seq")
    private Long financeProductSeq;

    @Column(name = "bank_code", nullable = false, length = 10)
    private String bankCode;   // 예: "001"

    @Column(name = "bank_name", nullable = false, length = 50)
    private String bankName;   // 예: "한국은행"

    @Column(name = "account_type_unique_no", nullable = false, length = 50)
    private String accountTypeUniqueNo;

    @Column(name = "account_type_name", length = 50)
    private String accountTypeName; // "수시입출금"

    @Column(name = "account_name", length = 100)
    private String accountName; // 상품명

    @Column(name = "account_description", length = 255)
    private String accountDescription; // 상품설명
}
