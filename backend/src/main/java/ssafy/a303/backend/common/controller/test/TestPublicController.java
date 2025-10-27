package ssafy.a303.backend.common.controller.test;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.dto.ResponseDTO;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
public class TestPublicController {

    private final String testString;
    private final String testString2;

    TestPublicController(@Value("${GOOGLE_CLIENT_ID}") String testString,
                   @Value("${GOOGLE_CLIENT_SECRET}") String testString2){
        this.testString = testString;
        this.testString2 = testString2;
    }

    @GetMapping("/test")
    public ResponseEntity<ResponseDTO<Map<String, String>>> test() {
        Map<String, String > map = new HashMap<>();
        map.put("GOOGLE_CLIENT_ID", testString);
        map.put("GOOGLE_CLIENT_SECRET", testString2);

        return ResponseDTO.ok(map, "test connect");
    }
}
