package ssafy.a303.backend.contract.dto.common;

import org.w3c.dom.stylesheets.LinkStyle;

public record CreateRes(
        String bankCode,
        String accountNo,
        CurrencyInfo currency
) {
}
