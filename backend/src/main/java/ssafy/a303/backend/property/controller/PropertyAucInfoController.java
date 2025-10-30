package ssafy.a303.backend.property.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.common.dto.ResponseDTO;
import ssafy.a303.backend.property.dto.request.PropertyAucInfoUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAucInfoUpdateResponseDto;
import ssafy.a303.backend.property.repository.PropertyAucInfoRepository;
import ssafy.a303.backend.property.service.PropertyAucInfoService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/properties/auc")
public class PropertyAucInfoController {

    private final PropertyAucInfoService aucInfoService;

    @PatchMapping("/{propertySeq}")
    public ResponseEntity<ResponseDTO<PropertyAucInfoUpdateResponseDto>> updateAucInfo(@PathVariable Integer propertySeq,
                                                                                       @RequestBody PropertyAucInfoUpdateRequestDto req,
//                                                           @AuthenticationPrincipal Integer userSeq,
                                                                                       @RequestParam Integer userSeq)
    {
        PropertyAucInfoUpdateResponseDto response = aucInfoService.updateAucInfo(propertySeq, req, userSeq);
        return ResponseDTO.ok(response, "매물 경매 정보가 수정되었습니다.");
    }
}
