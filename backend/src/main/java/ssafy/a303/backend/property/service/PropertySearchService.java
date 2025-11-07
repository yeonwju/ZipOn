package ssafy.a303.backend.property.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.property.dto.elastic.PropertyDocument;
import ssafy.a303.backend.property.dto.elastic.SearchRequestDto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertySearchService {

    /** ES Java API Client)*/
    private final ElasticsearchClient es;

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
        if (notBlank(r.si()))   filters.add(term("si",   r.si()));  //시
        if (notBlank(r.gu()))   filters.add(term("gu",   r.gu()));  // 구
        if (notBlank(r.dong())) filters.add(term("dong", r.dong()));  // 동

        // 가격 범위 필터
        addRange(filters, "deposit",   r.depositMin(), r.depositMax());
        addRange(filters, "mnRent",   r.mnRentMin(),  r.mnRentMax());
        addRange(filters, "fee",       r.feeMin(),     r.feeMax());

        // 조건 범위 필터
        addRange(filters, "area",      r.areaMin(),    r.areaMax());
        addRange(filters, "roomCnt",r.roomCountMin(), r.roomCountMax());
        addRange(filters, "floor",     r.floorMin(),   r.floorMax());

        // 다중 값 필터
        if (nonEmpty(r.facings()))       filters.add(terms("facing", r.facings()));
        if (nonEmpty(r.buildingTypes())) filters.add(terms("buildingType", r.buildingTypes()));

        /** 최종 bool 조립*/
        Query finalQuery;
        if (must.isEmpty() && filters.isEmpty()) {
            finalQuery = Query.of(q -> q.matchAll(m -> m));
        } else {
            finalQuery = Query.of(q -> q.bool(b -> {
                if (!must.isEmpty())    b.must(must);
                if (!filters.isEmpty()) b.filter(filters);
                return b;
            }));
        }

        /** 정렬 */
        String sortField = (r.sortField() == null || r.sortField().isBlank()) ? "createdAt" : r.sortField();
        SortOrder sortOrder = ("asc".equalsIgnoreCase(r.sortOrder())) ? SortOrder.Asc : SortOrder.Desc;

        /** 쿼리 확인 */
        var resp = es.search(s -> s
                        .index(index)
                        .query(finalQuery),
                JsonNode.class
        );

        resp.hits().hits().forEach(h -> {
            log.info("ID={}", h.id());
            log.info("SRC={}", h.source().toPrettyString()); // _source JSON 확인
        });


        /** ES 검색 실행 */
        // highlight: title, description 하이라이트 필요시 사용
        return es.search(s -> s
                        .index(index)
                        .query(finalQuery)
                        .from(from)
                        .size(size)
                        .sort(so -> so.field(f -> f.field(sortField).order(sortOrder)))
                        .trackTotalHits(t -> t.enabled(true))
                        .highlight(h -> h.fields("title", f -> f).fields("description", f -> f)),
                PropertyDocument.class
        );

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
    private static Query term(String field, String value) {
        return Query.of(q -> q.term(t -> t
                .field(field)
                .value(v -> v.stringValue(value))
        ));
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
