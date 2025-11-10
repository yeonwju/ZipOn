# 개발 가이드

프로젝트에서 사용하는 주요 개념과 패턴에 대한 가이드 문서입니다.

## 📚 가이드 목록

### 🔐 인증 및 권한

- **[QUICK_START_AUTH.md](./QUICK_START_AUTH.md)** - AuthGuard 빠른 시작 (5분 완성)
  - 로그인 필수 페이지 만들기
  - 기본 사용법
  - 자주 하는 실수

- **[AUTH_GUARD_GUIDE.md](./AUTH_GUARD_GUIDE.md)** - AuthGuard 완벽 가이드
  - 아키텍처 이해
  - 고급 사용법
  - 캐싱 전략
  - 실전 예제
  - 트러블슈팅

### 🏗️ 아키텍처

- **[ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)** - 프로젝트 구조 가이드
  - 폴더 구조
  - 컴포넌트 설계 원칙
  - 상태 관리 전략

### 🔌 API 연동

- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - API 연동 가이드
  - fetch 래퍼 사용법
  - 에러 처리
  - 인증 토큰 관리

- **[DATA_INTEGRATION_GUIDE.md](./DATA_INTEGRATION_GUIDE.md)** - 데이터 통합 가이드
  - 더미 데이터 → 실제 API 전환
  - 단계별 마이그레이션

### 🎨 UI/UX

- **[SUSPENSE_AND_SKELETON_GUIDE.md](./SUSPENSE_AND_SKELETON_GUIDE.md)** - 로딩 상태 처리
  - Suspense 사용법
  - Skeleton UI 패턴
  - 로딩 최적화

- **[FILTERS.md](./FILTERS.md)** - 필터 시스템 가이드
  - 필터 구조
  - 상태 관리
  - URL 동기화

## 🚀 빠른 시작

### 새로운 기능 개발 시작하기

1. **인증이 필요한 페이지 만들기**
   ```bash
   📖 QUICK_START_AUTH.md 참고
   ```

2. **API 연동하기**
   ```bash
   📖 API_INTEGRATION_GUIDE.md 참고
   ```

3. **로딩 UI 추가하기**
   ```bash
   📖 SUSPENSE_AND_SKELETON_GUIDE.md 참고
   ```

## 💡 추천 읽기 순서

### 처음 프로젝트에 합류했다면

1. [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) - 전체 구조 이해
2. [QUICK_START_AUTH.md](./QUICK_START_AUTH.md) - 인증 시스템 파악
3. [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - API 사용법 학습

### 새 기능 개발할 때

1. [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) - 어디에 코드를 둘지 결정
2. 기능에 따라:
   - 로그인 필요 → [AUTH_GUARD_GUIDE.md](./AUTH_GUARD_GUIDE.md)
   - API 연동 → [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
   - 필터 기능 → [FILTERS.md](./FILTERS.md)
3. [SUSPENSE_AND_SKELETON_GUIDE.md](./SUSPENSE_AND_SKELETON_GUIDE.md) - 로딩 UI 추가

### 문제 해결할 때

각 가이드의 **트러블슈팅** 섹션을 확인하세요:
- [AUTH_GUARD_GUIDE.md#트러블슈팅](./AUTH_GUARD_GUIDE.md#트러블슈팅)
- [API_INTEGRATION_GUIDE.md#트러블슈팅](./API_INTEGRATION_GUIDE.md)
- [DATA_INTEGRATION_GUIDE.md#주의사항](./DATA_INTEGRATION_GUIDE.md)

## 📝 문서 작성 규칙

가이드 문서 작성 시 지켜야 할 규칙:

1. **명확한 제목**: 무엇에 대한 가이드인지 한 눈에 알 수 있게
2. **목차 제공**: 긴 문서는 반드시 목차 추가
3. **코드 예제**: 설명보다 코드 예제를 우선
4. **실전 예제**: 실제 프로젝트에서 사용하는 패턴 소개
5. **트러블슈팅**: 자주 발생하는 문제와 해결 방법 정리

## 🔄 업데이트 이력

- **2025-11-10**: AUTH_GUARD_GUIDE.md, QUICK_START_AUTH.md 추가
- 이전 버전: 기존 가이드 문서들

---

**질문이나 개선 사항이 있다면 팀에 공유해주세요!**

