package ssafy.a303.backend.property.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;
import ssafy.a303.backend.property.dto.request.PropertyDetailRequestDto;

import java.util.List;

public class CreatePropertyMultipart {
    @Schema(description = "요청 DTO(JSON)")
    public PropertyDetailRequestDto req;

    @ArraySchema(
            arraySchema = @Schema(description = "이미지들"),
            schema = @Schema(type = "string", format = "binary")
    )
    public List<MultipartFile> images;

}
