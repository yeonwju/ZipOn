package ssafy.a303.backend.property.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAddressResponseDto;
import ssafy.a303.backend.property.service.PropertyService;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    /**
     * 매물 주소 등록.
     * @param req
     * @param principal
     * @return
     */
    @PostMapping("/address")
    public ResponseEntity<PropertyAddressResponseDto> submitAddress(
            @RequestBody PropertyAddressRequestDto req,
            @AuthenticationPrincipal Object principal
            ){

        PropertyAddressResponseDto response =
                propertyService.submitAddress(req, lessorSeq, lessorNm);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


}
