//package ssafy.a303.backend.sms.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.sql.Timestamp;
//
//@Entity
//@Table(name = "sms")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Sms {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int smsSeq;
//    @Column
//    private int userSeq;
//    @Column(length = 11)
//    private String phoneNumber;
//    @Column(length = 6)
//    private String smsCode;
//    @CreationTimestamp
//    private Timestamp createdAt;
//    @Column
//    private Timestamp expiredAt;
//    @Column
//    private boolean verified;
//    @Column
//    private int mailedToday;
//}
