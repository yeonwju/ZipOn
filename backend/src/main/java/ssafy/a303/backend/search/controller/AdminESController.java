package ssafy.a303.backend.search.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.search.service.PropertySearchService;

@RestController
@RequestMapping("/api/v1/admin/es")
@RequiredArgsConstructor
public class AdminESController {

    private final PropertySearchService searchService;

    /**
     * 전체 매물 재색인
     */
    @PostMapping("/reindex/all")
    public ResponseEntity<String> reindexAll() {
        searchService.reindexAllProperties();
        return ResponseEntity.ok("모든 매물을 ES에 재색인했습니다.");
    }

    /**
     * 집주인 직접 경매하는 매물만 재색인 (property 2, 6, 14)
     */
    @PostMapping("/reindex/{propertySeq}")
    public ResponseEntity<String> reindexOwnerAuction(@PathVariable Integer propertySeq) {
        searchService.reindexOne(propertySeq);
        return ResponseEntity.ok(propertySeq +"번 ES 재색인 완료");
    }

}
