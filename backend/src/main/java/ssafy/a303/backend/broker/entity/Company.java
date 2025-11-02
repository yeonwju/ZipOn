package ssafy.a303.backend.broker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer companySeq;
    @Column(name = "tax_seq", length = 12, nullable = false)
    private String taxSeq;
    @UpdateTimestamp
    @Column(name = "check_at")
    private LocalDate checkAt;

    @Column(name = "is_working")
    private Boolean isWorking;

    @Column(name = "ceo", length = 50)
    private String ceoName;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "address", length = 200)
    private String address;
}
