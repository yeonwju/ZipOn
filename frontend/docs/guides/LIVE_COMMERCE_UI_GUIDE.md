# 라이브 커머스 UI 가이드

## 📋 목차

1. [개요](#개요)
2. [화면 구조](#화면-구조)
3. [컴포넌트 설명](#컴포넌트-설명)
4. [사용 예제](#사용-예제)
5. [커스터마이징](#커스터마이징)
6. [API 연동](#api-연동)

---

## 개요

라이브 커머스 페이지는 실시간 방송과 시청자 간의 인터랙션을 제공하는 페이지입니다.

### 주요 기능

- ✅ **실시간 비디오 스트리밍**
- ✅ **채팅 시스템** (메시지 송수신)
- ✅ **좋아요 기능** (애니메이션 포함)
- ✅ **시청자 수 표시**
- ✅ **방송 정보 및 진행자 프로필**
- ✅ **미니 플레이어 지원**
- ✅ **방송 종료 기능** (진행자 전용)

---

## 화면 구조

```
┌──────────────────────────────────────┐
│ [←] 뒤로가기       [□] 미니플레이어  │ ← LiveHeader (투명)
├──────────────────────────────────────┤
│ 🏠 방송 타이틀                        │ ← LiveHostInfo
│ [프로필] 진행자 이름                  │
│                                      │
│                           👁 342    │ ← LiveInteraction
│         비디오 스트림                 │    (시청자수)
│                                      │
│                           ❤️ 1.5K   │
│                                      │
│                                      │
├──────────────────────────────────────┤
│ [홍길동] 안녕하세요!                  │
│ [김철수] 매물 좋네요!                │ ← LiveChatList
│ ...                                  │
├──────────────────────────────────────┤
│ [메시지 입력창] [전송]     [방송종료]  │ ← LiveChatInput
└──────────────────────────────────────┘    + LiveEndButton
```

---

## 컴포넌트 설명

### 1. LiveHeader

**위치**: 상단 (투명 배경)  
**기능**: 뒤로가기, 미니플레이어 버튼

```tsx
<LiveHeader 
  onBack={() => router.back()} 
  onMinimize={handleMinimize} 
/>
```

**Props:**
- `onBack`: 뒤로가기 버튼 클릭 핸들러
- `onMinimize`: 미니플레이어 버튼 클릭 핸들러

---

### 2. LiveHostInfo

**위치**: 좌측 상단  
**기능**: 방송 타이틀, 진행자 정보 표시

```tsx
<LiveHostInfo
  title="🏠 강남 역삼동 신축 오피스텔 실시간 투어"
  hostName="변가원"
  hostProfileImage="/profile.svg"
/>
```

**Props:**
- `title`: 방송 제목
- `hostName`: 진행자 이름
- `hostProfileImage`: 진행자 프로필 이미지 (optional, 기본값: `/profile.svg`)

---

### 3. LiveInteraction

**위치**: 우측 상단  
**기능**: 시청자 수, 좋아요 버튼 및 수

```tsx
<LiveInteraction 
  initialViewers={342} 
  initialLikes={1523} 
/>
```

**Props:**
- `initialViewers`: 초기 시청자 수 (optional, 기본값: 0)
- `initialLikes`: 초기 좋아요 수 (optional, 기본값: 0)

**특징:**
- 좋아요 버튼 클릭 시 애니메이션 효과
- 5초 후 다시 좋아요 가능 (중복 방지)

---

### 4. LiveChatContainer

**위치**: 하단 (45% 높이)  
**기능**: 채팅 목록 + 입력창 통합 컴포넌트

```tsx
<LiveChatContainer 
  isHost={true} 
  userName="변가원" 
/>
```

**Props:**
- `isHost`: 진행자 여부 (메시지에 '진행자' 뱃지 표시)
- `userName`: 현재 사용자 이름 (메시지 전송 시 사용)

---

### 5. LiveChatList

**위치**: 채팅 컨테이너 내부  
**기능**: 채팅 메시지 목록 표시

```tsx
<LiveChatList messages={messages} />
```

**Props:**
- `messages`: 채팅 메시지 배열

**ChatMessage 타입:**
```typescript
interface ChatMessage {
  id: string
  userName: string
  message: string
  timestamp: Date
  isHost?: boolean  // 진행자 여부
}
```

---

### 6. LiveChatInput

**위치**: 채팅 컨테이너 하단  
**기능**: 메시지 입력 및 전송

```tsx
<LiveChatInput 
  onSendMessage={handleSendMessage} 
  disabled={false} 
/>
```

**Props:**
- `onSendMessage`: 메시지 전송 핸들러 `(message: string) => void`
- `disabled`: 입력 비활성화 (optional)

---

### 7. LiveEndButton

**위치**: 우측 하단  
**기능**: 방송 종료 (진행자 전용)

```tsx
{isHost && <LiveEndButton onEnd={handleEndBroadcast} />}
```

**Props:**
- `onEnd`: 방송 종료 핸들러

**특징:**
- 확인 모달 포함 (실수 방지)
- 진행자만 사용

---

## 사용 예제

### 기본 사용

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  LiveBroadcast,
  LiveHeader,
  LiveHostInfo,
  LiveInteraction,
  LiveChatContainer,
  LiveEndButton,
} from '@/components/features/live'
import { useMiniPlayerStore } from '@/store/miniPlayer'

export default function OnAirPage() {
  const router = useRouter()
  const { activateMiniPlayer } = useMiniPlayerStore()
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)

  // 사용자 정보 (TODO: AuthGuard에서 가져오기)
  const isHost = true
  const userName = '변가원'

  // 라이브 정보 (TODO: API에서 가져오기)
  const liveInfo = {
    title: '🏠 강남 역삼동 신축 오피스텔 실시간 투어',
    hostName: '변가원',
    hostProfileImage: '/profile.svg',
    viewers: 342,
    likes: 1523,
  }

  const handleMinimize = () => {
    if (currentStream) {
      const clonedStream = currentStream.clone()
      activateMiniPlayer(clonedStream)
      router.push('/home')
    }
  }

  const handleEndBroadcast = () => {
    // TODO: 방송 종료 API 호출
    router.push('/live')
  }

  return (
    <main className="relative h-screen overflow-hidden bg-black">
      {/* 비디오 스트림 */}
      <LiveBroadcast onStreamReady={setCurrentStream} />

      {/* 상단 헤더 */}
      <LiveHeader onBack={() => router.back()} onMinimize={handleMinimize} />

      {/* 방송 정보 */}
      <LiveHostInfo
        title={liveInfo.title}
        hostName={liveInfo.hostName}
        hostProfileImage={liveInfo.hostProfileImage}
      />

      {/* 인터랙션 */}
      <LiveInteraction 
        initialViewers={liveInfo.viewers} 
        initialLikes={liveInfo.likes} 
      />

      {/* 채팅 */}
      <LiveChatContainer isHost={isHost} userName={userName} />

      {/* 방송 종료 (진행자만) */}
      {isHost && (
        <div className="absolute bottom-4 right-4 z-20">
          <LiveEndButton onEnd={handleEndBroadcast} />
        </div>
      )}
    </main>
  )
}
```

---

## 커스터마이징

### 채팅 높이 조정

```tsx
// LiveChatContainer.tsx
<div className="absolute bottom-0 left-0 right-0 z-10 flex h-[50%] flex-col">
  {/* 50%로 변경 */}
</div>
```

### 좋아요 쿨다운 시간 변경

```tsx
// LiveInteraction.tsx
setTimeout(() => {
  setIsLiked(false)
}, 10000) // 10초로 변경
```

### 진행자 메시지 색상 변경

```tsx
// LiveChatList.tsx
<div className={`... ${
  msg.isHost
    ? 'bg-purple-500/30 border border-purple-400/50'  // 보라색으로 변경
    : 'bg-black/30'
}`}>
```

---

## API 연동

### 1. 라이브 정보 가져오기

```typescript
// hooks/queries/useLive.ts
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'

export function useLiveDetail(liveId: string) {
  return useQuery({
    queryKey: queryKeys.live.detail(Number(liveId)),
    queryFn: () => fetchLiveDetail(liveId),
  })
}

// 사용
const { data: liveInfo } = useLiveDetail(params.id)
```

### 2. 채팅 메시지 연동 (WebSocket)

```typescript
// hooks/useLiveChat.ts
import { useEffect, useState } from 'react'
import { ChatMessage } from '@/components/features/live'

export function useLiveChat(liveId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    // WebSocket 연결
    const socket = new WebSocket(`wss://api.example.com/live/${liveId}/chat`)
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }

    setWs(socket)

    return () => {
      socket.close()
    }
  }, [liveId])

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message }))
    }
  }

  return { messages, sendMessage }
}

// 사용
const { messages, sendMessage } = useLiveChat(params.id)

<LiveChatContainer 
  messages={messages}  // 실시간 메시지
  onSendMessage={sendMessage}  // WebSocket으로 전송
/>
```

### 3. 좋아요 API 연동

```typescript
// hooks/queries/useLiveLike.ts
import { useMutation } from '@tanstack/react-query'

export function useLiveLike(liveId: string) {
  return useMutation({
    mutationFn: () => likeLive(liveId),
    onSuccess: () => {
      // 좋아요 수 업데이트
    },
  })
}

// 사용
const likeMutation = useLiveLike(params.id)

const handleLike = () => {
  likeMutation.mutate()
}
```

### 4. 방송 종료 API 연동

```typescript
// hooks/queries/useLiveEnd.ts
import { useMutation } from '@tanstack/react-query'

export function useLiveEnd() {
  return useMutation({
    mutationFn: (liveId: string) => endLive(liveId),
    onSuccess: () => {
      // 방송 종료 처리
    },
  })
}

// 사용
const endMutation = useLiveEnd()

const handleEndBroadcast = () => {
  endMutation.mutate(params.id)
}
```

---

## 체크리스트

라이브 커머스 기능 구현 시:

- [ ] 비디오 스트리밍 연동 (WebRTC, OpenVidu 등)
- [ ] 채팅 WebSocket 연동
- [ ] 좋아요 API 연동
- [ ] 시청자 수 실시간 업데이트
- [ ] 방송 시작/종료 API
- [ ] 진행자 권한 체크 (AuthGuard + 권한 확인)
- [ ] 채팅 메시지 길이 제한 (현재 200자)
- [ ] 비속어 필터링
- [ ] 채팅 신고 기능
- [ ] 방송 녹화/다시보기 기능 (선택)

---

## 참고 자료

- **OpenVidu 공식 문서**: https://docs.openvidu.io/
- **WebSocket 가이드**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **ReactQuery 가이드**: [AUTH_GUARD_GUIDE.md](./AUTH_GUARD_GUIDE.md)

---

**작성일:** 2025-11-10  
**마지막 수정:** 2025-11-10

