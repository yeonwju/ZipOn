package ssafy.a303.backend.dto;

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
    public static <T>ResponseEntity<ResponseDTO<T>> badRequest (String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO<>(null, message, HttpStatus.BAD_REQUEST));
    }
    public static <T>ResponseEntity<ResponseDTO<T>> unauthorized (String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseDTO<>(null, message, HttpStatus.UNAUTHORIZED));
    }
    public static <T>ResponseEntity<ResponseDTO<T>> forbidden (String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseDTO<>(null, message, HttpStatus.FORBIDDEN));
    }
    public static <T>ResponseEntity<ResponseDTO<T>> notFound (String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO<>(null, message, HttpStatus.NOT_FOUND));
    }
    public static <T>ResponseEntity<ResponseDTO<T>> internalServerError (String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO<>(null, message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}
