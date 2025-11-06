package ssafy.a303.backend.property.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.property.dto.elastic.PropertyDocument;
import ssafy.a303.backend.property.dto.elastic.SearchRequestDto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PropertySearchService {

    private final ElasticsearchClient es;

    @Value("${elasticsearch.index.property:my_index}")
    private String index;

    public SearchResponse<PropertyDocument> search(SearchRequestDto r) throws IOException {

        // 페이지가 0 이상
        int page = (r.page() == null || r.page() < 0) ? 0 : r.page();
        // 사이즈가 0 초과
        int size = (r.size() == null || r.size() <= 0) ? 10 : r.size();
        //총 몇개 인지
        int from = page * size;

        // 1. must 검색어
        Query mustQuery = (r.q() == null || r.q().isBlank())
                ? Query.of(q -> q.matchAll(m -> m))
                : Query.of(q -> q.multiMatch(mm -> mm
                .query(r.q())
                .fields("title^3,description^2,searchable")
        ));

        // 2. filter
        List<Query> filters = new ArrayList<>();

        // 지역 필터
        if (notBlank(r.si()))   filters.add(term("si",   r.si()));  //시
        if (notBlank(r.gu()))   filters.add(term("gu",   r.gu()));  // 구
        if (notBlank(r.dong())) filters.add(term("dong", r.dong()));  // 동

        // 범위 필터
        addRange(filters, "deposit",   r.depositMin(), r.depositMax());
        addRange(filters, "mn_rent",   r.mnRentMin(),  r.mnRentMax());
        addRange(filters, "fee",       r.feeMin(),     r.feeMax());
        addRange(filters, "area",      r.areaMin(),    r.areaMax());
        addRange(filters, "room_count",r.roomCountMin(), r.roomCountMax());
        addRange(filters, "floor",     r.floorMin(),   r.floorMax());

        // 다중 값 필터(terms)
        if (nonEmpty(r.facings()))       filters.add(terms("facing", r.facings()));
        if (nonEmpty(r.buildingTypes())) filters.add(terms("building_type", r.buildingTypes()));

        // 3. bool 조립
        Query boolQuery = Query.of(q -> q.bool(b -> b.must(mustQuery).filter(filters)));

        // 4. 정렬
        String sortField = (r.sortField() == null || r.sortField().isBlank()) ? "created_at" : r.sortField();
        SortOrder sortOrder = ("asc".equalsIgnoreCase(r.sortOrder())) ? SortOrder.Asc : SortOrder.Desc;

        // 5. 검색 실행
        return es.search(s -> s
                        .index(index)
                        .query(boolQuery)
                        .from(from)
                        .size(size)
                        .sort(so -> so.field(f -> f.field(sortField).order(sortOrder)))
                        .trackTotalHits(t -> t.enabled(true))
                        .highlight(h -> h
                                .fields("title", f -> f)
                                .fields("description", f -> f)
                        )
                // 필요 시 응답 필드 축소
                // .source(src -> src.filter(f -> f.includes(List.of(
                //    "title","description","si","gu","dong","facing",
                //    "deposit","mn_rent","fee","area","area_p","room_count","floor",
                //    "building_type","created_at"
                // ))))
                , PropertyDocument.class
        );

    }

    // ---------- 유틸들 ----------

    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
    private static boolean nonEmpty(List<?> l) {
        return l != null && !l.isEmpty();
    }

    /** 문자열 term (keyword) */
    private static Query term(String field, String value) {
        return Query.of(q -> q.term(t -> t
                .field(field)
                .value(v -> v.stringValue(value))
        ));
    }

    /** terms (keyword 리스트) */
    private static Query terms(String field, List<String> values) {
        return Query.of(q -> q.terms(ts -> ts
                .field(field)
                .terms(t -> t.value(values.stream()
                        .filter(Objects::nonNull)
                        .map(v -> FieldValue.of(v)) // 문자열 리스트를 FieldValue 리스트로
                        .toList()))
        ));
    }

    /** 범위 필터 (숫자형 전반: Long/Integer/Double/Short v 대응) */
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
