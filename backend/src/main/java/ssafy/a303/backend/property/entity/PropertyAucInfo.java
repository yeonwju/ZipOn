package ssafy.a303.backend.property.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "property_auction_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyAucInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_auc_seq")
    private Integer propertyAucSeq;

    @OneToOne
    @JoinColumn(name = "property_seq", referencedColumnName = "property_seq", unique = true, nullable = false)
    private Property property;

    @Column(name = "is_auc_pref")
    private Boolean isAucPref;

    @Column(name = "is_brk_pref")
    private Boolean isBrkPref;

    @Column(name = "auc_at")
    private String aucAt;

    @Column(name = "auc_available")
    private String aucAvailable;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public void updateIsAucPref(Boolean isAucPref) {
        this.isAucPref = isAucPref;
    }

    public void updateIsBrkPref(Boolean isBrkPref) {
        this.isBrkPref = isBrkPref;
    }

    public void updateAucAt(String aucAt) {
        this.aucAt = aucAt;
    }

    public void updateAucAvailable(String aucAvailable) {
        this.aucAvailable = aucAvailable;
    }
}
