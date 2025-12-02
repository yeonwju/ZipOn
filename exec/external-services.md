# 2️⃣ **프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서**

## **클라우드 및 인프라 서비스**

### AWS EC2

- 메인 애플리케이션 & 인프라 컨테이너 호스팅

### AWS S3

- 버킷: zipon-media
- 용도: 여러 매물 이미지 저장

### DB / 캐시

- PostgreSQL 18 (zipondev-postgres)
- Redis (zipondev-redis)

### 로깅 / 검색

- Elasticsearch 8.17.2 (zipondev-elasticsearch)
- 부동산/경매 검색 인덱스

### 경매

- Kafka 3.8.0 (zipondev-kafka)

### 실시간 영상/통신

- OpenVidu Server 2.29.0 (Docker: openvidu/openvidu-server:2.29.0)
- Kurento Media Server (KMS) 컨테이너
- 용도: 라이브 방송, 경매 스트리밍, 화상/음성 통신

## **외부 API / SaaS 서비스**

### OAuth 로그인

- Google OAuth 2.0

### 알림

- Firebase Cloud Messaging (FCM)

### 기업 정보 조회

- 공공데이터포털 - 국세청\_사업자등록정보 진위확인 및 상태조회 서비스
- Bizno 기업정보 API

### 문자 전송 서비스

- Solapi
