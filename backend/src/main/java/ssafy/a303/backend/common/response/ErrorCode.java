package ssafy.a303.backend.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // --- 회원가입 외부 API ---
    EXTERNAL_API_ERROR(502, HttpStatus.BAD_GATEWAY, "외부 API 연동 중 오류가 발생했습니다."),
    EXTERNAL_API_LIMIT(429, HttpStatus.TOO_MANY_REQUESTS, "내일 오세요"),
    USER_NOT_FOUND(404, HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    SMS_NOT_SENDED(404, HttpStatus.NOT_FOUND, "해당 번호로 전송한 코드가 없습니다."),
    CODE_NOT_VALID(400, HttpStatus.BAD_REQUEST, "번호가 틀렸습니다."),

    // 401 UNAUTHORIZED
    USER_NOT_AUTHENTICATED(401, HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),

    // JWT 관련 에러 코드,
    INVALID_TOKEN(401, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(401, HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_CREDENTIALS(401, HttpStatus.UNAUTHORIZED, "잘못된 인증 정보입니다."),
    TOKEN_TYPE_MISMATCH(401, HttpStatus.UNAUTHORIZED, "토큰 타입이 잘못되었습니다."),
    ACCESS_REFRESH_MISMATCH(401, HttpStatus.UNAUTHORIZED, "사용자 정보가 일치하지 않습니다."),

    // 사업장
    INVALID_TAX_SEQ(404, HttpStatus.NOT_FOUND, "해당 사업자 등록 번호는 운영 중이지 않습니다."),

    // JSON
    JSON_SERIALIZE_ERROR(400, HttpStatus.BAD_REQUEST, "역직렬화를 실패하였습니다."),
    JSON_DESERIALIZE_ERROR(400, HttpStatus.BAD_REQUEST, "역직렬화를 실패하였습니다."),


    // 경매
    AUCTION_NOT_FOUND(404, HttpStatus.NOT_FOUND, "해당 경매가 존재하지 않습니다."),
    AUCTION_NOT_IN_PROGRESS(404, HttpStatus.NOT_FOUND, "해당 경매가 진행중이지 않습니다."),
    AUCTION_UNABLE_TO_START(404, HttpStatus.NOT_FOUND, "해당 경매가 진행 가능한 시간이 아닙니다."),
    AMOUNT_MAX_VALUE(400,HttpStatus.BAD_REQUEST,"21억 이상 입찰할 수 없습니다."),
    ALREADY_BID(409, HttpStatus.CONFLICT, "이미 입찰하였습니다."),

    // 경매/방송 알람
    ALARM_ALREADY_EXIST(406, HttpStatus.NOT_ACCEPTABLE, "이미 알람이 저장되었습니다."),

    // ┌────────────참고용───────────────────────────
    //400 BAD REQUEST
    BAD_REQUEST(400, HttpStatus.BAD_REQUEST, "잘못된 접근입니다."),
    INVALID_PAGINATION(400, HttpStatus.BAD_REQUEST, "잘못된 페이지네이션 값입니다."),
    INVALID_REQUEST_PARAM(400, HttpStatus.BAD_REQUEST, "잘못된 요청 파라미터입니다."),


    // 403 FORBIDDEN
    ACCESS_DENIED(403, HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    USER_DISABLED(403, HttpStatus.FORBIDDEN, "비활성화된 계정입니다."),

    //404 NOT FOUND,
    NOT_FOUND(404, HttpStatus.NOT_FOUND, "해당 API를 찾을 수 없습니다."),

    //405 METHOD NOT ALLOWED
    METHOD_NOT_ALLOWED(405, HttpStatus.METHOD_NOT_ALLOWED, "지원하지 않는 메소드입니다."),

    //429 TOO MANY REQUESTS
    TOO_MANY_REQUESTS(429, HttpStatus.TOO_MANY_REQUESTS, "요청 횟수를 초과하였습니다."),

    //500 INTERNAL SERVER ERROR
    INTERNAL_SERVER_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다."),

    //회원가입 관련 에러코드
    //400 BAD REQUEST
    PHONE_AUTH_EXPIRED(410, HttpStatus.GONE, "인증번호가 만료되었거나 존재하지 않습니다."),

    //409 CONFLICT
    USER_ALREADY_EXISTS(409, HttpStatus.CONFLICT, "이미 가입된 사용자입니다."),
    EMAIL_ALREADY_EXISTS(409, HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    INVALID_EMAIL_FORMAT(400, HttpStatus.BAD_REQUEST, "유효하지 않은 이메일 형식입니다."),

    // 송금 관련 에러 추가
    ACCOUNT_NOT_FOUND(404, HttpStatus.NOT_FOUND, "계좌를 찾을 수 없습니다."),
    INSUFFICIENT_BALANCE(400, HttpStatus.BAD_REQUEST, "잔액이 부족합니다."),
    INVALID_ACCOUNT_NUMBER(400, HttpStatus.BAD_REQUEST, "유효하지 않은 계좌번호입니다."),
    TRANSFER_LIMIT_EXCEEDED(400, HttpStatus.BAD_REQUEST, "이체 한도를 초과했습니다."),
    SAME_ACCOUNT_TRANSFER(400, HttpStatus.BAD_REQUEST, "동일한 계좌로는 이체할 수 없습니다."),
    ACCOUNT_HOLDER_MISMATCH(400, HttpStatus.BAD_REQUEST, "예금주명이 일치하지 않습니다."),
    TRANSFER_FAILED(500, HttpStatus.INTERNAL_SERVER_ERROR, "송금 처리 중 오류가 발생했습니다."),

    ACCOUNT_CREATE_FAILED(500, HttpStatus.INTERNAL_SERVER_ERROR, "계좌 생성에 실패했습니다."),

    // 회원정보 수정
    ALREADY_SAME_VALUE(409, HttpStatus.CONFLICT, "기존 값과 동일합니다."),
    PHONE_ALREADY_EXISTS(409, HttpStatus.CONFLICT, "이미 사용 중인 전화번호입니다."),

    //회원 탈퇴
    USER_ALREADY_DELETED(409, HttpStatus.CONFLICT, "이미 탈퇴된 사용자입니다."),

    // FAST API 연결
    AI_NO_RESPONSE(500, HttpStatus.BAD_GATEWAY, "AI 서버와 연결을 실패했습니다."),

    // 사진 등록
    IMAGE_LIMIT_EXCEEDS(500, HttpStatus.BAD_REQUEST, "이미지는 최대 20장까지 업로드할 수 있습니다."),

    // PDF 검증
    EMPTY_PDF_FILE(400, HttpStatus.BAD_REQUEST, "파일이 비어 있습니다."),
    ONLY_PDF_ALLOWED(400, HttpStatus.UNSUPPORTED_MEDIA_TYPE, "PDF 파일만 업로드 가능합니다."),
    VERIFICATION_FAILED(400, HttpStatus.BAD_REQUEST, "등기부등본이 매물 정보와 일치하지 않습니다."),
    JSON_TYPE_ERROR(400, HttpStatus.BAD_REQUEST, "요청 JSON 형식이 올바르지 않습니다."),

    // 매물 관련
    ADDRESS_DUPLICATE(400, HttpStatus.BAD_REQUEST, "이미 동일 주소의 매물이 등록되어 있습니다."),
    PROPERTY_NOT_FOUND(400, HttpStatus.BAD_REQUEST, "해당 매물이 삭제되었거나 존재하지 않습니다."),
    AUC_INFO_NOT_FOUND(400, HttpStatus.BAD_REQUEST, "해당 매물의 경매 정보가 존재하지 않습니다."),
    CERTIFICATION_INFO_NOT_FOUND(400, HttpStatus.BAD_REQUEST, "매물의 검증정보가 존재하지 않습니다."),

    NO_AUTHORIZATION(401, HttpStatus.UNAUTHORIZED, "수정 권한이 없습니다. 직접 등록한 매물만 수정할 수 있습니다."),


    // 매물 사진 S3
    EMPTY_IMG_FILE(400, HttpStatus.BAD_REQUEST, "이미지 파일이 비어 있습니다."),
    ONLY_IMG_ALLOWED(400, HttpStatus.BAD_REQUEST, "이미지 파일만 업로드 가능합니다."),
    S3_UPLOAD_FAILED(400, HttpStatus.BAD_REQUEST, "S3 업로드 실패"),

    // 중개 및 경매 신청
    DUPLICATE_NOT_ALLOWED(400, HttpStatus.BAD_REQUEST, "동일 매물에 대한 중복 신청이 불가합니다."),
    TIME_NOT_ALLOWED(400, HttpStatus.BAD_REQUEST, "시작 시간을 종료 시간보다 앞서야 합니다."),
    DATE_NOT_ALLOWED(400, HttpStatus.BAD_REQUEST, "과거 날짜로는 경매를 신청할 수 없습니다."),
    CANCEL_NO_AUTH(401, HttpStatus.UNAUTHORIZED, "취소 권한이 없습니다. 본인이 신청한 건만 취소가능합니다."),
    CANCEL_IMPOSSIBLE(400, HttpStatus.BAD_REQUEST, "취소불가"),

    // 임대인 중개인 매칭
    READ_NO_AUTH(401, HttpStatus.UNAUTHORIZED, "본인 소유 매물의 중개 신청만 조회할 수 있습니다."),
    ACCEPT_NO_AUTH(401, HttpStatus.UNAUTHORIZED, "해당 매물의 임대인만 중개인을 선택할 수 있습니다."),
    ALREADY_PROCESSED(400, HttpStatus.BAD_REQUEST, "이미 중개가 성사되었거나, 취소된 요청입니다."),

    //계약 관련
    AI_CONTRACT_ERROR(500, HttpStatus.BAD_GATEWAY, "AI 서버 응답 없음"),
    AI_EMPTY_RESPONSE(400, HttpStatus.BAD_REQUEST, "AI 서버에서 빈 응답이 돌아왔습니다."),

    // STOMP 관련
    INVALID_AUTH_HEADER(401, HttpStatus.UNAUTHORIZED, "Authorization 헤더가 없거나 형식이 올바르지 않습니다. (예: Bearer <JWT>)"),
    INVALID_DESTINATION(400, HttpStatus.BAD_REQUEST, "STOMP 구독 경로(destination)가 누락되었거나 올바르지 않습니다. (예: /sub/chat/{roomId})"),
    INVALID_ROOM_ID(400, HttpStatus.BAD_REQUEST, "채팅방 ID 형식이 올바르지 않습니다. (숫자여야 합니다.)"),
    UNAUTHORIZED_CHAT_ACCESS(403, HttpStatus.FORBIDDEN, "해당 채팅방에 접근 권한이 없습니다."),
    UNSUPPORTED_CATEGORY(400, HttpStatus.BAD_REQUEST, "지원하지 않는 구독 카테고리입니다."),

    // 채팅 관련
    CHAT_SELF_NOT_ALLOWED(400, HttpStatus.BAD_REQUEST, "자기 자신과는 채팅할 수 없습니다."),
    CHAT_ROOM_NOT_FOUND(404, HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."),
    CHAT_MESSAGE_SAVE_FAILED(500, HttpStatus.INTERNAL_SERVER_ERROR, "채팅 메시지 저장 중 오류가 발생했습니다."),
    CHAT_PARTICIPANT_NOT_FOUND(404, HttpStatus.NOT_FOUND, "채팅 참여자를 찾을 수 없습니다."),
    INVALID_CHAT_REQUEST(400, HttpStatus.BAD_REQUEST, "잘못된 채팅 요청입니다."),
    BROKER_NOT_FOUND(404, HttpStatus.NOT_FOUND, "중개인 정보를 찾을 수 없습니다."),

    // OpenVidu / Live Stream 관련 ---
    OPENVIDU_SESSION_CREATE_FAILED(500, HttpStatus.INTERNAL_SERVER_ERROR, "라이브 방송 세션 생성에 실패했습니다."),
    OPENVIDU_TOKEN_CREATE_FAILED(500, HttpStatus.INTERNAL_SERVER_ERROR, "OpenVidu 접속 토큰 발급에 실패했습니다."),
    OPENVIDU_SESSION_NOT_FOUND(404, HttpStatus.NOT_FOUND, "존재하지 않는 방송 세션입니다."),
    LIVE_STREAM_NOT_FOUND(404, HttpStatus.NOT_FOUND, "해당 라이브 방송을 찾을 수 없습니다."),
    LIVE_STREAM_ALREADY_ENDED(400, HttpStatus.BAD_REQUEST, "이미 종료된 라이브 방송입니다."),
    LIVE_STREAM_NOT_OWNER(403, HttpStatus.FORBIDDEN, "방송을 종료할 권한이 없습니다."),
    OPENVIDU_SESSION_CLOSE_FAILED(500, HttpStatus.INTERNAL_SERVER_ERROR, "라이브 방송 종료 중 오류가 발생했습니다."),

    ;
    // ────────────────────────────────────────────────────
    private final int code;
    private final HttpStatus httpStatus;
    private final String message;
}
