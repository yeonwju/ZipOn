package ssafy.a303.backend.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDTO <T> {
    private final T data;
    private final String message;
    private final int status;
    private final long timestamp;

    @Builder
    public ResponseDTO(T data, String message, HttpStatus status) {
        this.data = data;
        this.message = message;
        this.status = status.value();
        this.timestamp = System.currentTimeMillis();
    }

    public static <T>ResponseEntity<ResponseDTO<T>> ok (T data, String message) {
        return ResponseEntity.ok(new ResponseDTO<>(data, message, HttpStatus.OK));
    }
    public static <T>ResponseEntity<ResponseDTO<T>> created (T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseDTO<>(data, message, HttpStatus.CREATED));
    }

    public static ResponseDTO<?> fail(ErrorCode errorCode, String customMessage) {
        return ResponseDTO.builder()
                .status(errorCode.getHttpStatus())
                .message(customMessage)
                .data(null)
                .build();
    }

    public static ResponseDTO<?> fail(ErrorCode errorCode) {
        return ResponseDTO.builder()
                .status(errorCode.getHttpStatus())
                .message(errorCode.getMessage())
                .data(null)
                .build();
    }
}
