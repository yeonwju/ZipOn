package ssafy.a303.backend.chat.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * 채팅방 생성 요청 DTO
 * ------------------------------------------------------
 * 매물 상세 페이지에서 '채팅하기' 버튼 클릭 시 사용.
 * 매물(property)의 ID를 전달하여, 해당 매물의 임대인(user_seq)과
 * 현재 로그인한 사용자 간의 1:1 채팅방을 생성합니다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomCreateRequestDto {

    @JsonProperty("isAucPref")
    @Schema(description = "중개인 희망 여부", example = "true")
    @NotNull
    private Boolean aucPref;  // 중개인 희망 여부

    @Schema(description = "매물 ID", example = "1")
    @NotNull
    private Integer propertySeq;  // 매물 ID

}
