package ssafy.a303.backend.security.jwt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "token_pairs",
        indexes = {
                @Index(name = "idx_tp_acc_ref_used", columnList = "accessJti, refreshJti, used")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenPair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int tokenSeq;
    @Column
    String accessJti;
    @Column
    String refreshJti;
    @Column
    boolean used;
}
