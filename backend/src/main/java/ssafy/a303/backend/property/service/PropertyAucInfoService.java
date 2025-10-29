package ssafy.a303.backend.property.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.property.dto.request.PropertyAucInfoUpdateRequestDto;
import ssafy.a303.backend.property.dto.response.PropertyAucInfoUpdateResponseDto;
import ssafy.a303.backend.property.entity.Property;
import ssafy.a303.backend.property.entity.PropertyAucInfo;
import ssafy.a303.backend.property.repository.PropertyAucInfoRepository;
import ssafy.a303.backend.property.repository.PropertyRepository;

@Service
@RequiredArgsConstructor
public class PropertyAucInfoService {

    private final PropertyAucInfoRepository aucInfoRepository;
    private final PropertyRepository propertyRepository;

    private void assertCanEdit(Integer lessorSeq, Integer userSeq) {
        if(userSeq == null || !userSeq.equals(lessorSeq)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }
    }

    @Transactional
    public PropertyAucInfoUpdateResponseDto updateAucInfo(Integer propertySeq, PropertyAucInfoUpdateRequestDto req,
                                                          Integer userSeq) {
        // 해당 매물 존재 여부 확인
        Property p = propertyRepository.findByPropertySeqAndDeletedAtIsNull(propertySeq)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 삭제된 매물입니다."));

        // 수정 권한 확인
        assertCanEdit(p.getLessorSeq(), userSeq);

        // 매물의 경매 정보 조회
        PropertyAucInfo aucInfo = aucInfoRepository.findByPropertySeq(propertySeq)
                .orElseThrow(() -> new IllegalArgumentException("경매 정보가 없습니다."));

        // 부분 수정 반영
        if(req.isAucPref() != null) aucInfo.updateIsAucPref(req.isAucPref());
        if(req.isBrkPref() != null) aucInfo.updateIsBrkPref(req.isBrkPref());
        if(req.aucAt() != null) aucInfo.updateAucAt(req.aucAt());
        if(req.aucAvailable() != null) aucInfo.updateAucAvailable(req.aucAvailable());

        // 수정 사항 저장.
        aucInfoRepository.save(aucInfo);

        return new PropertyAucInfoUpdateResponseDto(
                p.getPropertySeq(), aucInfo.getIsAucPref(), aucInfo.getIsBrkPref(),
                aucInfo.getAucAt(), aucInfo.getAucAvailable()
        );
    }
}
