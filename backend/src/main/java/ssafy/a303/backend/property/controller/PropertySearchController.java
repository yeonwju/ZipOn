package ssafy.a303.backend.property.controller;

import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.property.dto.elastic.PageResponseDto;
import ssafy.a303.backend.property.dto.elastic.PropertyDocument;
import ssafy.a303.backend.property.dto.elastic.SearchRequestDto;
import ssafy.a303.backend.property.dto.elastic.SearchResponseDto;
import ssafy.a303.backend.property.repository.PropertyRepository;
import ssafy.a303.backend.property.service.PropertySearchService;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
            @RequestParam(required = false, name="buildingType") List<String> buildingTypes,

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
                page, size,
                sortField, sortOrder
        );

        var resp = propertySearchService.search(req);
        long total = (resp.hits().total() == null) ? 0L : resp.hits().total().value();

        // ES _id → propertySeq 매핑 + DB 보강 → DTO 변환 (이전 로직 재사용)
        List<Hit<PropertyDocument>> hits = resp.hits().hits();
        List<Integer> ids = hits.stream().map(h -> toIntOrNull(h.id()))
                .filter(Objects::nonNull).toList();

        Map<Integer, PropertySummaryProjection> enrich = propertyRepository
                .findSummariesByIds(ids).stream()
                .collect(Collectors.toMap(PropertySummaryProjection::getPropertySeq, p -> p));

        List<SearchResponseDto> items = hits.stream()
                .map(hit -> toDto(hit, enrich))
                .filter(Objects::nonNull)
                .toList();

        PageResponseDto<SearchResponseDto> pageDto =
                new PageResponseDto<>(total, page, size, items);

        return ResponseDTO.ok(pageDto, "검색 성공");
    }


}
