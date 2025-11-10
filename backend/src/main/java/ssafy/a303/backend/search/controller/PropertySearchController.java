package ssafy.a303.backend.search.controller;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.search.dto.PageResponseDto;
import ssafy.a303.backend.search.dto.PropertyDocument;
import ssafy.a303.backend.search.dto.SearchRequestDto;
import ssafy.a303.backend.search.dto.SearchResponseDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.search.service.PropertySearchService;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Tag(name="검색")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/properties/search")
public class PropertySearchController {

    private final PropertySearchService propertySearchService;
    private final PropertyRepository propertyRepository;

    /**
     * 검색 조회 api
     * @param q
     * @param si
     * @param gu
     * @param dong
     * @param depositMin
     * @param depositMax
     * @param mnRentMin
     * @param mnRentMax
     * @param feeMin
     * @param feeMax
     * @param areaMin
     * @param areaMax
     * @param roomCountMin
     * @param roomCountMax
     * @param floorMin
     * @param floorMax
     * @param facings
     * @param buildingTypes
     * @param page
     * @param size
     * @param sortField
     * @param sortOrder
     * @return
     * @throws IOException
     */
    @Operation(
            summary = "검색 조회 및 매물 3분류 조회",
            description = "키워드와 필터링으로 검색한 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "매물 검색 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ResponseDTO.class)
                    )
            )
    })
    @GetMapping("")
    public ResponseEntity<ResponseDTO<PageResponseDto<SearchResponseDto>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String si,
            @RequestParam(required = false) String gu,
            @RequestParam(required = false) String dong,

            @RequestParam(required = false) Long depositMin,
            @RequestParam(required = false) Long depositMax,
            @RequestParam(required = false) Integer mnRentMin,
            @RequestParam(required = false) Integer mnRentMax,
            @RequestParam(required = false) Integer feeMin,
            @RequestParam(required = false) Integer feeMax,

            @RequestParam(required = false) Double areaMin,
            @RequestParam(required = false) Double areaMax,
            @RequestParam(required = false) Short roomCountMin,
            @RequestParam(required = false) Short roomCountMax,
            @RequestParam(required = false) Short floorMin,
            @RequestParam(required = false) Short floorMax,

            @RequestParam(required = false) List<String> facings,
            @RequestParam(required = false, name="building_type") List<String> buildingTypes,

            @RequestParam(required = false) Boolean isAuc,
            @RequestParam(required = false) Boolean isBrk,
            @RequestParam(required = false) Boolean hasBrk,

            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder
    ) throws IOException {

        SearchRequestDto req = new SearchRequestDto(
                q, si, gu, dong,
                depositMin, depositMax,
                mnRentMin, mnRentMax,
                feeMin, feeMax,
                areaMin, areaMax,
                roomCountMin, roomCountMax,
                floorMin, floorMax,
                facings, buildingTypes,
                isAuc, isBrk, hasBrk,
                page, size,
                sortField, sortOrder
        );

        /** ES 검색 */
        SearchResponse<PropertyDocument> resp = propertySearchService.search(req);
        long total = (resp.hits().total() == null) ? 0L : resp.hits().total().value();

        /** ES hit → SearchResponseDto 변환 */
        // ES 값을 우선 사용하고,
        // DB에서만 존재하는 필드만 보강해서 반환
        List<SearchResponseDto> items = resp.hits().hits().stream()
                .map(this::toDto)
                .filter(Objects::nonNull)
                .toList();

        PageResponseDto<SearchResponseDto> pageDto =
                new PageResponseDto<>(total, page, size, items);

        return ResponseDTO.ok(pageDto, "검색 성공");
    }

    /** ES _id → Integer */
    private static Integer toIntOrNull(String s) {
        if (s == null) return null;
        try { return Integer.valueOf(s); } catch (NumberFormatException e) { return null; }
    }

    /** Hit -> SearchResponseDto 매핑
     * ES에서 제공되는 값은 ES 사용
     * DB에서만 갖고 있는 thumbnail, address만 propertySeq로 조회*/
    private SearchResponseDto toDto(Hit<PropertyDocument> hit) {
        PropertyDocument src = hit.source();
        if (src == null) return null;

        Integer propertySeq = toIntOrNull(hit.id());

        /** DB 보강 */
        Property p = (propertySeq == null)
                ? null
                : propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElse(null);

        String thumbnail = (p != null) ? p.getThumbnail() : null;
        String address = (p != null) ? p.getAddress() : null;

        return new SearchResponseDto(
                hit.id(), // id
                toIntOrNull(hit.id()), // propertySeq
                src.getLessorNm(), // lessorNm
                thumbnail, // thumbnail
                src.getTitle(), // title
                src.getDescription(), // snippet (하이라이트나 요약)
                src.getBuildingType(), // buildingType (Enum Building)
                address, // address
                src.getDeposit(), // deposit
                src.getMnRent(), // mnRent
                src.getFee(), // fee
                src.getArea(), // area
                src.getAreaP(), // areaP
                src.getRoomCnt(), // room_count
                src.getFloor(), // floor
                src.getIsAuc(),
                src.getIsBrk(),
                src.getHasBrk(),

                src.getCreatedAt() // created_at
        );
    }
}
