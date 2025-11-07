package ssafy.a303.backend.property.dto.response;

public record PropertyAucInfoUpdateResponseDto(
        Integer propertySeq,
        Boolean isAucPref,
        Boolean isBrkPref,
        String aucAt,
        String aucAvailable
) {
}
