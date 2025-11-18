package ssafy.a303.backend.user.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class S3ProfileUploader {
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final S3Client s3Client;

    /**
     * 프로필 이미지 업로드 (userSeq 당 1장)
     * 같은 userSeq로 다시 올리면 기존 이미지를 덮어씁니다.
     */
    public String uploadProfile(Integer userSeq, MultipartFile file) {

        /** 1. 빈 파일 체크 */
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.EMPTY_IMG_FILE);
        }

        /** 2. 확장자 및 이미지 MIME 타입 체크 */
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new CustomException(ErrorCode.ONLY_IMG_ALLOWED);
        }

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains(".")) ?
                original.substring(original.lastIndexOf('.') + 1) : "bin";

        ext = ext.toLowerCase(); // 파일 형식

        String key = "dev/uploads/profiles/%d/profile.%s".formatted(userSeq, ext);

        try {
            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));

            // 여기서는 key만 반환. URL은 기존 S3Uploader의 publicUrl / presignedGetUrl에서 처리 가능
            return key;

        } catch (IOException e) {
            throw new CustomException(ErrorCode.S3_UPLOAD_FAILED, e);
        }
    }
}
