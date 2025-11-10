package ssafy.a303.backend.search.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQueryBuilders;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.entity.PropertyAucInfo;
import ssafy.a303.backend.property.repository.PropertyAucInfoRepository;
import ssafy.a303.backend.search.dto.AddressParts;
import ssafy.a303.backend.search.dto.PropertyDocument;
import ssafy.a303.backend.search.dto.SearchRequestDto;
import ssafy.a303.backend.search.dto.SearchResponseDto;
import ssafy.a303.backend.search.util.AddressParser;

import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.time.temporal.WeekFields.ISO;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertySearchService {

    /** ES Java API Client)*/
    private final ElasticsearchClient es;
    private final PropertyAucInfoRepository aucInfoRepository;

    // 검색 대상 인덱스명
    @Value("${elasticsearch.index.property}")
    private String index;

    /**
     * 검색 조건을 ES DSL로 조립하여 실행.
     * ES 문서를 PropertyDocument 타입으로 역직렬화하여 반환
     * Controller는 이를 DTO로 매핑.
     * @param r
     * @return
     * @throws IOException
     */
    public SearchResponse<PropertyDocument> search(SearchRequestDto r) throws IOException {

        /** 페이징 파라미터 정규화 */
        // page >= 0, size > 0
        int page = (r.page() == null || r.page() < 0) ? 0 : r.page();
        int size = (r.size() == null || r.size() <= 0) ? 10 : r.size();
        int from = page * size;

        /** 정렬 */
        String sortField = (r.sortField() == null || r.sortField().isBlank()) ? "createdAt" : r.sortField();
        SortOrder sortOrder = ("asc".equalsIgnoreCase(r.sortOrder())) ? SortOrder.Asc : SortOrder.Desc;

        // must / filter 세팅
        List<Query> must = new ArrayList<>();
        List<Query> filters = new ArrayList<>();

        /** 검색어 */
        // 검색어(q)가 있을 때만 must 추가
        if (r.q() != null && !r.q().isBlank()) {
            must.add(Query.of(q -> q.multiMatch(mm -> mm
                    .query(r.q())
                    .fields(Arrays.asList("title^3", "description^2", "searchable"))
            )));
        }

        /** 필터 조건 */
        // 지역 필터
        if (notBlank(r.si()))   filters.add(termKeyword("si",   r.si().toLowerCase()));
        if (notBlank(r.gu()))   filters.add(termKeyword("gu",   r.gu().toLowerCase()));
        if (notBlank(r.dong())) filters.add(termKeyword("dong", r.dong().toLowerCase()));

        // 가격 범위 필터
        addRange(filters, "deposit",   r.depositMin(), r.depositMax());
        addRange(filters, "mn_rent",   r.mnRentMin(),  r.mnRentMax());
        addRange(filters, "fee",       r.feeMin(),     r.feeMax());

        // 조건 범위 필터
        addRange(filters, "area",      r.areaMin(),    r.areaMax());
        addRange(filters, "room_cnt",r.roomCountMin(), r.roomCountMax());
        addRange(filters, "floor",     r.floorMin(),   r.floorMax());

        // 다중 값 필터
        if (nonEmpty(r.facings()))       filters.add(terms("facing", r.facings()));
        if (nonEmpty(r.buildingTypes())) filters.add(terms("building_type", r.buildingTypes()));

        // 매물 조건
        if (r.isAuc() != null) filters.add(Query.of(q -> q.term(t -> t.field("is_auc").value(r.isAuc()))));
        if (r.isBrk() != null) filters.add(Query.of(q -> q.term(t -> t.field("is_brk").value(r.isBrk()))));
        if (r.hasBrk() != null) filters.add(Query.of(q -> q.term(t -> t.field("has_brk").value(r.hasBrk()))));

        /** 최종 bool 조립*/
        Query finalQuery = (must.isEmpty() && filters.isEmpty())
                ? Query.of(q -> q.matchAll(m -> m))
                : Query.of(q -> q.bool(b -> {
            if (!must.isEmpty())    b.must(must);
            if (!filters.isEmpty()) b.filter(filters);
            return b;
        }));

        /** 디버깅 */
        SearchResponse<JsonData> raw = es.search(s -> s
                        .index(index)
                        .query(finalQuery)
                        .from(from)
                        .size(1),
                JsonData.class
        );
        log.info("RAW SOURCE = " + raw.hits().hits().get(0).source().toJson().toString());

        SearchRequest req = new SearchRequest.Builder()
                .index(index)
                .query(finalQuery)
                .from(from)
                .size(size)
                .sort(so -> so.field(f -> f.field(sortField).order(sortOrder)))
                .trackTotalHits(t -> t.enabled(true))
                .highlight(h -> h.fields("title", f -> f).fields("description", f -> f))
                .build();

        return es.search(req, PropertyDocument.class);
    }

    public void setIndex(Property p) {
        PropertyDocument doc = toDoc(p);

        try {
            es.index(IndexRequest.of(ir -> ir
                    .index(index)
                    .id(String.valueOf(p.getPropertySeq())) //propertySeq로 es 색인
                    .document(doc)
            ));
            log.info("[ES] indexed property {}", p.getPropertySeq());
        } catch (Exception e) {
            log.error("[ES] index failed for property {}", p.getPropertySeq(), e);
        }
    }

    private PropertyDocument toDoc(Property p) {
        // 주소 파싱(도로명 기준)
        AddressParts parts = AddressParser.parse(p.getAddress());

        String createdAtStr = null;
        if (p.getCreatedAt() != null) {
            createdAtStr = p.getCreatedAt()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        }

        PropertyAucInfo aucInfo = aucInfoRepository.findByPropertySeq(p.getPropertySeq())
                .orElseThrow(() -> new CustomException(ErrorCode.AUC_INFO_NOT_FOUND));

        return PropertyDocument.builder()
                .title(p.getPropertyNm())
                .description(p.getContent())
                .si(parts.getSi() != null ? parts.getSi() : null)
                .gu(parts.getGu() != null ? parts.getGu() : null)
                .dong(parts.getDong() != null ? parts.getDong() : null)
                .facing(p.getFacing() == null ? null : p.getFacing().name())
                .lessorNm(p.getLessorNm())
                .buildingType(p.getBuildingType() == null ? null : p.getBuildingType().name())
                .deposit(p.getDeposit() == null ? null : p.getDeposit().longValue())
                .mnRent(p.getMnRent())
                .fee(p.getFee())
                .area(p.getArea() == null ? null : p.getArea().doubleValue())
                .areaP(p.getAreaP())
                .roomCnt(p.getRoomCnt() == null ? null : p.getRoomCnt().shortValue())
                .floor(p.getFloor() == null ? null : p.getFloor().shortValue())
                .isAuc(aucInfo.getIsAucPref())
                .isBrk(aucInfo.getIsBrkPref())
                .createdAt(createdAtStr)
                .build();
    }

    // ---------- utils ----------

    // 문자열 not blank
    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
    // 리스트 not empty
    private static boolean nonEmpty(List<?> l) {
        return l != null && !l.isEmpty();
    }

    // keyword
    private Query termKeyword(String field, String exact) {
        return Query.of(q -> q.term(t -> t.field(field).value(exact)));
    }

    // keyword 리스트
    private static Query terms(String field, List<String> values) {
        return Query.of(q -> q.terms(ts -> ts
                .field(field)
                .terms(t -> t.value(values.stream()
                        .filter(Objects::nonNull)
                        .map(v -> FieldValue.of(v)) // 문자열 리스트를 FieldValue 리스트로
                        .toList()))
        ));
    }

    // 범위 필터 (숫자형 전반: Long/Integer/Double/Short v 대응)
    private static void addRange(List<Query> filters, String field, Number min, Number max) {
        if (min == null && max == null) return;

        RangeQuery range = RangeQueryBuilders.number(n -> {
            n.field(field);
            if (min != null) n.gte(min.doubleValue());
            if (max != null) n.lte(max.doubleValue());
            return n;
        });

        filters.add(range._toQuery());
    }
}
