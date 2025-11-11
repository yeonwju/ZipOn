package ssafy.a303.backend.broker.dto.request;

import java.util.Arrays;
import java.util.List;

public record CompanyStatusRequest(List<String> b_no) {

    public static CompanyStatusRequest of (String... taxSeqs){
        return new CompanyStatusRequest(Arrays.asList(taxSeqs));
    }
}
