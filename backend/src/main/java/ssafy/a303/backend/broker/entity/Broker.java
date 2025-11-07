package ssafy.a303.backend.broker.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.user.entity.User;

@Entity
@Getter
@Setter
@Table(name = "broker")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Broker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer brkSeq;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;
    @Column
    private Integer cncldCnt;
    @Column
    private Integer mediateCnt;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_seq", nullable = false)
    private Company company;
}
