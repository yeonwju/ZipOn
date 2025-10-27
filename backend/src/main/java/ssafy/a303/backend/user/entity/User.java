package ssafy.a303.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userSeq;
    @Column(nullable = false, length = 64)
    private String email;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false, length = 50)
    private String name;
    @Column(length = 13)
    private String tel;
    @Column(length = 10)
    private String birth;
    @Column
    private String profileImg;
    @Enumerated
    @Column
    private Role role;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Column
    private LocalDateTime deletedAt;
}