package ssafy.a303.backend.auction.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.auction.dto.projection.AuctionAlarmProjection;
import ssafy.a303.backend.auction.service.AuctionAlarmService;
import ssafy.a303.backend.common.response.ResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auction/alarm")
@Tag(name = "AuctionAlarm", description = "경매 알람 API")
public class AuctionAlarmController {
    private final AuctionAlarmService auctionAlarmService;

    @Operation(
            summary = "경매 알람 등록",
            description = "특정 경매에 대해 로그인 사용자의 방송 알람을 등록합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "생성됨", content = @Content),
                    @ApiResponse(responseCode = "409", description = "이미 존재함", content = @Content),
                    @ApiResponse(responseCode = "404", description = "사용자/경매 없음", content = @Content)
            }
    )
    @PostMapping("/{auctionSeq}")
    public ResponseEntity<ResponseDTO<Void>> save(@AuthenticationPrincipal int userSeq, @PathVariable int auctionSeq) {
        auctionAlarmService.save(userSeq, auctionSeq);
        return ResponseDTO.created(null, "방송 알람 저장됨");
    }

    @Operation(
            summary = "경매 알람 삭제",
            description = "특정 경매에 대해 로그인 사용자의 방송 알람을 삭제합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "삭제됨", content = @Content),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청(알람 없음)", content = @Content)
            }
    )
    @DeleteMapping("/{auctionSeq}")
    public ResponseEntity<ResponseDTO<Void>> delete(@AuthenticationPrincipal int userSeq, @PathVariable int auctionSeq) {
        auctionAlarmService.delete(userSeq, auctionSeq);
        return ResponseDTO.ok(null, "방송 알람 삭제됨");
    }

    @Operation(
            summary = "내 알람 목록(무한 스크롤)",
            description = "로그인 사용자의 방송 알람 목록을 커서 기반으로 조회합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(schema = @Schema(implementation = AuctionAlarmProjection.class))
                    )
            }
    )
    @GetMapping
    public ResponseEntity<ResponseDTO<Slice<AuctionAlarmProjection>>> getList(
            @Parameter(hidden = true) @AuthenticationPrincipal int userSeq,
            @Parameter(description = "다음 페이지 커서(마지막 항목의 auctionAlarmSeq). 첫 페이지면 미전송") @RequestParam(required = false) Long cursor,
            @Parameter(description = "페이지 크기, 기본 10", example = "10") @RequestParam(defaultValue = "10") int size
    ) {
        Slice<AuctionAlarmProjection> list = auctionAlarmService.getMyAlarmsScroll(userSeq, cursor, size);
        return ResponseDTO.ok(list, "방송 알람 조회됨");
    }
}
