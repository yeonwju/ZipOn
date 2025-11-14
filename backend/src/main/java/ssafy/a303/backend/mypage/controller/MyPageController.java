package ssafy.a303.backend.mypage.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.mypage.dto.MyAuctionResponseDto;
import ssafy.a303.backend.mypage.service.MyPageService;

import java.util.List;

@Tag(name = "마이페이지")
@RestController
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
@Log4j2
public class MyPageController {

    private final MyPageService myPageService;
    
    /**
     * 나의 경매 참여 내역 조회
     */
    @Operation(
            summary = "나의 경매 참여 내역 조회",
            description = "현재 로그인한 사용자가 참여한 모든 경매 내역을 조회합니다. 각 경매에서의 입찰 순위도 함께 제공됩니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "경매 참여 내역 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MyAuctionResponseDto.class),
                            examples = @ExampleObject(
                                    name = "경매 참여 내역 조회 성공",
                                    value = """
                    {
                      "status": 200,
                      "message": "나의 경매 참여 내역을 조회했습니다.",
                      "data": [
                        {
                          "thumbnail": "https://picsum.photos/seed/property1/800/600",
                          "auctionSeq": 1,
                          "propertySeq": 1,
                          "attendanceStatus": "WAITING",
                          "address": "서울특별시 강남구 강남대로 396",
                          "bidAmount": 4800000,
                          "bidRank": 1
                        },
                        {
                          "thumbnail": "https://picsum.photos/seed/property2/800/600",
                          "auctionSeq": 2,
                          "propertySeq": 2,
                          "attendanceStatus": "ACCEPTED",
                          "address": "서울특별시 강남구 테헤란로 123",
                          "bidAmount": 9500000,
                          "bidRank": 1
                        }
                      ]
                    }
                    """
                            )
                    )
            )
    })
    @GetMapping("/auctions")
    public ResponseEntity<ResponseDTO<List<MyAuctionResponseDto>>> getMyAuctions(
            @Parameter(hidden = true) @AuthenticationPrincipal Integer userSeq) {

        List<MyAuctionResponseDto> response = myPageService.getMyAuctions(userSeq);

        return ResponseDTO.ok(response, "나의 경매 참여 내역을 조회했습니다.");
    }

}
