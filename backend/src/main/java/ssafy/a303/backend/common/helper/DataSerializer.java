package ssafy.a303.backend.common.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;

@Slf4j
@RequiredArgsConstructor
public class DataSerializer {
    private static final ObjectMapper objectMapper = init();

    private static ObjectMapper init(){
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
    public static <T> T deserialize(String data, Class<T> clazz){
        try {
            return objectMapper.readValue(data, clazz);
        } catch (JsonProcessingException e){
            log.error("[DataSerializer.deserialize] data={}, clazz={}", data, clazz, e);
            throw new CustomException(ErrorCode.JSON_DESERIALIZE_ERROR);
        }
    }

    public static <T> T deserialize(Object data, Class<T> clazz) {
        return objectMapper.convertValue(data, clazz);
    }

    public static String serialize(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            log.error("[DataSerializer.serialize] object={}", object, e);
            throw new CustomException(ErrorCode.JSON_SERIALIZE_ERROR);
        }
    }
}
