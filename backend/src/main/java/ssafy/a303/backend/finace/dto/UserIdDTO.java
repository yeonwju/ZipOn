package ssafy.a303.backend.finace.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

@Getter
@Setter
@Builder
public class UserIdDTO {
    String apiKey;
    @Value("${ssafyApiKey}")
    String userId;
}
