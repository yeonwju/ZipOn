package ssafy.a303.backend.property.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface StorageService {

    // 등기부등본 pdf 업로드
    String uploadPdf(MultipartFile file, String keyPrefix);
}
