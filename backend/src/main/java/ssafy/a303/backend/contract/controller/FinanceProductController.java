package ssafy.a303.backend.contract.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.contract.entity.FinanceProduct;
import ssafy.a303.backend.contract.service.FinanceProductService;

@RestController
@RequestMapping("/api/v1/finance/products")
@RequiredArgsConstructor
public class FinanceProductController {

    private final FinanceProductService financeProductService;

    @PostMapping("/create")
    public ResponseEntity<FinanceProduct> initDemandDepositProduct() {

        // 예시: 한국은행 수시입출금 상품 하나 만들기
        FinanceProduct product = financeProductService.createDemandDepositProduct(
                "001",
                "가상계좌",
                "안전계약을 위한 가상계좌입니다."
        );

        return ResponseEntity.ok(product);
    }
}
