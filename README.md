# ZipOn - AI 검증 기반 실시간 부동산 안심 거래 플랫폼

## 📋 프로젝트 개요

ZipOn은 AI 기반 부동산 검증과 실시간 라이브 커머스를 결합한 부동산 거래 플랫폼입니다. 등기부등본 자동 검증, 계약서 불공정 조항 분석, 실시간 라이브 방송, 경매 시스템 등 다양한 기능을 제공합니다.

## 🏗️ 시스템 아키텍처
<img width="975" height="776" alt="image (4)" src="https://github.com/user-attachments/assets/bee14646-03fb-4768-88b5-0709e95f85fc" />

## 🗂️ ERD
<img width="1920" height="1304" alt="image-1" src="https://github.com/user-attachments/assets/71119f71-6fa9-4115-a1e5-d1d12101e7c0" />

## 🚀 주요 기능

### 1. AI 검증 시스템
- **등기부등본 자동 검증**: PDF 등기부등본을 AI가 분석하여 소유자 정보 일치 여부 확인
- **계약서 불공정 조항 분석**: 계약서를 업로드하면 불공정 조항을 자동으로 탐지하고 법률 근거와 함께 제공
- **위험도 평가**: 매물의 위험도를 점수화하여 제공

### 2. 부동산 검색 및 조회
- **지도 기반 검색**: Kakao Map API를 활용한 지도 기반 매물 검색
- **Elasticsearch 통합 검색**: 고성능 부동산 매물 검색
- **다양한 필터링**: 가격, 면적, 건물 유형, 지역 등 다양한 조건으로 필터링

### 3. 실시간 라이브 커머스
- **라이브 방송**: OpenVidu를 활용한 실시간 비디오 스트리밍
- **실시간 채팅**: WebSocket(STOMP) 기반 채팅 시스템
- **시청자 상호작용**: 좋아요, 시청자 수 실시간 표시
- **미니 플레이어**: 방송을 보면서 다른 페이지 탐색 가능

### 4. 경매 시스템
- **실시간 경매**: Kafka 기반 실시간 입찰 시스템
- **입찰 알림**: Firebase Cloud Messaging을 통한 실시간 알림
- **가상계좌 발급**: 경매 참여를 위한 가상계좌 발급

### 5. 1대1 채팅 시스템
- **실시간 1대1 채팅**: WebSocket(STOMP) 기반 실시간 메시지 송수신
- **채팅방 관리**: 매물 기반 채팅방 생성 (임대인 또는 중개인과 채팅)
- **채팅방 목록**: 내 채팅방 목록 조회 및 최근 메시지 미리보기
- **읽음 처리**: 읽지 않은 메시지 개수 표시 및 읽음 처리
- **채팅 히스토리**: 채팅방 입장 시 이전 대화 내역 자동 로드

### 6. 중개인 시스템
- **중개인 신청**: 매물에 대한 중개인 신청 및 선택
- **중개인 인증**: 사업자등록번호 검증 (공공데이터포털, Bizno API)

### 7. 사용자 기능
- **OAuth 로그인**: Google OAuth 2.0 기반 소셜 로그인
- **마이페이지**: 관심 매물, 경매 내역, 계약서 관리
- **PWA 지원**: 모바일 앱처럼 설치 가능한 웹 앱

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.0.0
- **Language**: TypeScript 5
- **UI Library**: 
  - Radix UI
  - Tailwind CSS 4
  - shadcn/ui
  - Material-UI
- **State Management**: Zustand, React Query
- **Real-time**: STOMP.js, OpenVidu Browser SDK
- **Map**: React Kakao Maps SDK
- **PWA**: next-pwa

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: PostgreSQL 18
- **Cache**: Redis
- **Search**: Elasticsearch 8.17.2
- **Message Queue**: Apache Kafka 3.8.0
- **WebSocket**: Spring WebSocket (STOMP)
- **Security**: Spring Security, JWT
- **File Storage**: AWS S3
- **Video Streaming**: OpenVidu 2.29.0
- **Notification**: Firebase Cloud Messaging
- **SMS**: Solapi

### AI
- **Framework**: FastAPI 0.120.1
- **Language**: Python 3.13
- **AI/ML**:
  - LangGraph 1.0.2
  - LangChain 1.0.3
  - OpenAI API
  - ChromaDB (벡터 DB)
- **PDF Processing**: PyMuPDF, PyPDF

### Infrastructure
- **Containerization**: Docker
- **CI/CD**: Jenkins
- **Cloud**: AWS EC2, AWS S3
- **Monitoring**: Elasticsearch

## 📁 프로젝트 구조

```
ZipOnServer/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/       # Next.js App Router 페이지
│   │   ├── components/ # React 컴포넌트
│   │   ├── services/  # API 서비스 레이어
│   │   ├── queries/   # React Query 훅
│   │   ├── store/     # Zustand 상태 관리
│   │   └── lib/       # 유틸리티 및 설정
│   └── docs/          # 프론트엔드 가이드 문서
│
├── backend/           # Spring Boot 백엔드
│   └── src/main/java/ssafy/a303/backend/
│       ├── auction/   # 경매 관련 기능
│       ├── broker/    # 중개인 관련 기능
│       ├── chat/      # 채팅 기능
│       ├── contract/  # 계약서 관련 기능
│       ├── livestream/# 라이브 방송 기능
│       ├── property/  # 부동산 매물 관리
│       ├── search/    # 검색 기능
│       ├── security/  # 인증/인가
│       └── user/      # 사용자 관리
│
├── ai/                # FastAPI AI 서버
│   ├── app/
│   │   ├── agent/     # LangGraph 에이전트
│   │   ├── nodes/     # LangGraph 노드
│   │   ├── modules/   # 핵심 모듈
│   │   ├── schemas/   # 상태 스키마
│   │   └── tool/      # LangChain 도구
│   ├── data/          # 법률 문서 데이터
│   └── notebooks/     # Jupyter 노트북
│
└── exec/              # 프로젝트 문서
```

## 🚀 시작하기

### 사전 요구사항

- **Node.js**: 20.x 이상
- **Java**: 17 이상
- **Python**: 3.13 이상
- **Docker**: 최신 버전
- **PostgreSQL**: 18 이상
- **Redis**: 최신 버전
- **Elasticsearch**: 8.17.2
- **Kafka**: 3.8.0
- **OpenVidu**: 2.29.0

### 환경 변수 설정

각 서비스별로 필요한 환경 변수를 설정해야 합니다.

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080/ws
NEXT_PUBLIC_PWA_ENABLE=1
```

#### Backend (application.yml)
```yaml
# 데이터베이스
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/zipon
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_URL=localhost
ELASTICSEARCH_INDEX=zipon_properties

# Kafka
KAFKA_SERVER=localhost:9092

# OpenVidu
OPENVIDU_URL=http://localhost:4443
OPENVIDU_SECRET=your_openvidu_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2

# Firebase
# firebase/service-account-key.json 파일 필요

# 기타 API
SSAFY_API_KEY=your_ssafy_api_key
GOV_API_KEY=your_gov_api_key
BIZNO_API_KEY=your_bizno_api_key
SOLAPI_API_KEY=your_solapi_key
```

#### AI (.env)
```env
OPENAI_API_KEY=your_openai_api_key
GMS_KEY=your_gms_key
GMS_API_URL=your_gms_api_url
MODEL_NAME=your_model_name
```

### 로컬 실행

#### 1. Frontend 실행
```bash
cd frontend
npm install
npm run dev
```
Frontend는 `http://localhost:3000`에서 실행됩니다.

#### 2. Backend 실행
```bash
cd backend
./gradlew bootRun
```
Backend는 `http://localhost:8080`에서 실행됩니다.

#### 3. AI 서버 실행
```bash
cd ai
# Python 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -e .

# 서버 실행
uvicorn main:app --reload --port 8000
```
AI 서버는 `http://localhost:8000`에서 실행됩니다.

### Docker Compose로 실행

Jenkinsfile을 참고하여 docker-compose를 구성할 수 있습니다.

```bash
docker-compose up -d
```

## 🔑 핵심 기능 설명

### AI 검증 프로세스
1. **등기부등본 검증**: 사용자가 등기부등본 PDF와 소유자 정보를 업로드하면, LangGraph 기반 AI 에이전트가 PDF에서 정보를 추출하고 사용자 입력과 비교하여 일치 여부를 확인합니다. 위험도 점수와 검증 사유를 제공합니다.
2. **계약서 분석**: 계약서 PDF를 업로드하면 불공정 조항을 자동으로 탐지하고, ChromaDB에 저장된 법률 문서(민법, 약관의 규제에 관한 법률 등)를 참조하여 법률 근거와 함께 분석 결과를 제공합니다.

### 실시간 통신 시스템
1. **라이브 방송**: OpenVidu를 활용한 실시간 비디오 스트리밍으로 매물을 소개하고, 시청자와 실시간으로 소통할 수 있습니다.
2. **1대1 채팅**: WebSocket(STOMP) 기반으로 매물에 대한 문의를 임대인 또는 중개인과 실시간으로 주고받을 수 있습니다. 채팅방은 매물별로 자동 생성되며, 기존 채팅방이 있으면 재사용됩니다.
3. **경매 입찰**: Kafka를 활용한 실시간 입찰 시스템으로 경매 진행 중 실시간으로 입찰 순위가 업데이트되고, Firebase를 통해 입찰 알림을 받을 수 있습니다.

### 검색 및 필터링
- Elasticsearch를 활용한 고성능 부동산 검색
- Kakao Map API 기반 지도에서 매물 위치 확인 및 지역 기반 검색
- 가격, 면적, 건물 유형, 지역 등 다양한 조건으로 필터링 가능

## 🔧 개발 가이드

### Frontend 개발 가이드

프론트엔드의 상세 가이드는 `frontend/docs/guides/` 폴더를 참고하세요.

- [아키텍처 가이드](./frontend/docs/guides/ARCHITECTURE_GUIDE.md)
- [API 연동 가이드](./frontend/docs/guides/API_INTEGRATION_GUIDE.md)
- [인증 가이드](./frontend/docs/guides/AUTH_GUARD_GUIDE.md)
- [필터 시스템 가이드](./frontend/docs/guides/FILTERS.md)
- [라이브 커머스 UI 가이드](./frontend/docs/guides/LIVE_COMMERCE_UI_GUIDE.md)

### Backend 개발 가이드

- **패키지 구조**: 도메인별로 패키지 분리 (auction, broker, chat, contract 등)
- **REST API**: Spring MVC 기반 RESTful API
- **WebSocket**: STOMP 프로토콜 사용
- **인증**: JWT 기반 인증, OAuth2 클라이언트

### AI 개발 가이드

- **LangGraph**: 상태 기반 그래프로 에이전트 구성
- **에이전트**: 
  - `verify_agent`: 등기부등본 검증 에이전트
  - `contract_analysis_agent`: 계약서 분석 에이전트
- **벡터 DB**: ChromaDB에 법률 문서 임베딩 저장

## 🧪 테스트

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

### Backend
```bash
cd backend
./gradlew test
```

## 📦 배포

### CI/CD

Jenkins를 통한 자동 배포 파이프라인이 구성되어 있습니다.

- **dev 브랜치**: 개발 환경 자동 배포
- **main/master 브랜치**: 프로덕션 환경 배포

### Docker 이미지 빌드

```bash
# Frontend
docker build -t zipon-frontend:latest ./frontend

# Backend
docker build -t zipon-backend:latest ./backend

# AI
docker build -t zipon-ai:latest ./ai
```

## 🔐 보안

- JWT 기반 인증/인가
- OAuth 2.0 소셜 로그인
- HTTPS 통신
- 환경 변수를 통한 민감 정보 관리
- Firebase 서비스 계정 키 파일 보안 관리

## 👥 팀원 역할

### Frontend
- **[김도현]** - 실시간 1:1 채팅 및 라이브 방송 화상통신 / 경매 / 지도 / 매물 관련 / 마이페이지 / 결제 / 계약 부분 구현
- **[변가원]** - PWA 및 알림 서비스 구현

### Backend
- **[김윤정]** - 실시간 1:1 채팅 및 라이브 방송 화상 통신 / 마이페이지 구현
- **[문준호]** - 경매 입찰 관리 / 소셜 로그인 / JWT 인증과 ACCESS, REFRESH 쿠키 관리 및 재발급 / 사업자 확인 및 등록 / SMS 문자 전송
- **[변가원]** - firebase를 이용한 알림 서비스 구현
- **[주연우]** - 담당 기능/역할

### AI
- **[권주현]** - 등기부등본 인증 / 계약서 분석 에이전트 구현

### Infra
- **[변가원]** - 개발 서버·배포 서버를 분리 및 CI/CD 자동 배포 파이프라인 구축

