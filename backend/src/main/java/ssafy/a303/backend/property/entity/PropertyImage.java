package ssafy.a303.backend.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "property_image")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer propertyImageSeq;

    @Column(name = "property_seq")
    private Integer propertySeq;

    @Column(name = "s3_key")
    private String s3Key;

    @Column(name = "img_order")
    private Integer imgOrder;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;
}
