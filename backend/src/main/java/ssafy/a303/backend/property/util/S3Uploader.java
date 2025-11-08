package ssafy.a303.backend.property.util;

import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class S3Uploader {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final S3Client s3Client;
    private final S3Presigner presigner;

    public String uploadImage(Integer propertySeq, MultipartFile file) {

        /** 빈 파일 체크 */
        if(file.isEmpty()) throw new CustomException(ErrorCode.EMPTY_IMG_FILE);

        /** 확장자 체크 */
        String contentType = file.getContentType();
        if(contentType == null || !contentType.startsWith("image/")) {
            throw new CustomException(ErrorCode.ONLY_IMG_ALLOWED);
        }

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains(".")) ?
                original.substring(original.lastIndexOf('.') + 1) : "bin";

        String key = "properties/%d/%s.%s".formatted(
                propertySeq, UUID.randomUUID(), ext.toLowerCase()
        );

        try {
            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
//                    .acl(ObjectCannedACL.PUBLIC_READ) // public으로 열 때만 사용
                    .build();

            s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));
            return key;

        } catch (IOException e) {
            throw new CustomException(ErrorCode.S3_UPLOAD_FAILED, e);
        }
    }

    /** 프리사인드 get url */
    public String presignedGetUrl(String key, Duration ttl) {
        GetObjectRequest get = GetObjectRequest.builder()
                .bucket(bucket).key(key).build();

        GetObjectPresignRequest preReq = GetObjectPresignRequest.builder()
                .signatureDuration(ttl == null ? Duration.ofHours(12) : ttl)
                .getObjectRequest(get)
                .build();

        return presigner.presignGetObject(preReq).url().toString();
    }

    /** 버킷이 퍼블릭인 경우 정적 공개 URL */
    public String publicUrl(String key) {
        return "https://%s.s3.%s.amazonaws.com/%s".formatted(bucket, s3Client.utilities().region().id(), key);
    }

    /** 업로드 롤백용 삭제 */
    public void delete(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket).key(key).build());
    }

}
