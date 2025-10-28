package ssafy.a303.backend.property.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.property.dto.request.PropertyAddressRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAddressResponseDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.repository.PropertyRepository;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    @Transactional
    public PropertyAddressResponseDto submitAddress(PropertyAddressRequestDto req,
                                                    Integer lessorSeqFromAuth,
                                                    String lessorNameFromAuth) {
        if(propertyRepository.existsByAddressAndLessorSeq(req.address(), lessorSeqFromAuth)){
            throw new IllegalArgumentException("이미 동일 주소의 매물이 등록되어 있습니다.");
        }

        Property entity = Property.builder()
                .lessorSeq(lessorSeqFromAuth)
                .lessorNm(lessorNameFromAuth)
                .address(req.address())
                .build();

        Property saved = propertyRepository.save(entity);

        return new PropertyAddressResponseDto(
                saved.getPropertySeq(),
                saved.getLessorNm(),
                saved.getAddress()
        );
    }
}
