'use client'

import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser'
import { useCallback, useEffect, useRef, useState } from 'react'

interface LiveBroadcastProps {
  token: string
  isHost: boolean
  onStreamReady?: (stream: MediaStream) => void
}

export default function LiveBroadcast({ token, isHost, onStreamReady }: LiveBroadcastProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sessionRef = useRef<Session | null>(null)
  const publisherRef = useRef<Publisher | null>(null)
  const subscriberRef = useRef<Subscriber | null>(null)
  const openViduRef = useRef<OpenVidu | null>(null)

  const isConnectingRef = useRef(false)
  const usedTokenRef = useRef<string | null>(null)
  const isStreamAttachedRef = useRef(false) // 스트림 연결 상태 추적
  const hasStreamPlayingFiredRef = useRef(false) // streamPlaying 이벤트 발생 여부 추적
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null) // 폴백 타임아웃 참조

  const [error, setError] = useState<string | null>(null)
  const [playError, setPlayError] = useState(false)

  const handleStreamReady = useCallback(
    (stream: MediaStream | null) => {
      if (stream) {
        onStreamReady?.(stream)
      }
    },
    [onStreamReady]
  )

  useEffect(() => {
    console.log('[OpenVidu] 트리거', { token, isHost, hasToken: !!token })

    if (!token) {
      console.log('[OpenVidu] 토큰 없어유')
      return
    }

    // 같은 토큰으로 이미 연결했으면 무시 (토큰은 1회만 사용 가능)
    if (usedTokenRef.current === token) {
      console.log('[OpenVidu] 토큰 이미 존재함 패수', {
        currentToken: token,
        usedToken: usedTokenRef.current,
      })
      return
    }

    // 이미 연결 중이면 무시
    if (isConnectingRef.current) {
      console.log('[OpenVidu] 이미 연결중 패수', {
        isConnecting: isConnectingRef.current,
      })
      return
    }

    isConnectingRef.current = true
    isStreamAttachedRef.current = false // 스트림 연결 상태 초기화
    hasStreamPlayingFiredRef.current = false // streamPlaying 이벤트 발생 여부 초기화

    // 기존 폴백 타임아웃 제거
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }

    setError(null)
    setPlayError(false)

    console.log('[OpenVidu] 초기화 중...', {
      token,
      isHost,
      hasVideoRef: !!videoRef.current,
    })

    // 토큰에서 실제 토큰 값 추출 (현재는 token과 동일하지만 확장성을 위해)
    const openViduToken = token
    console.log('[OpenVidu] 토큰 정보:', {
      original: token,
      extracted: openViduToken,
      tokenLength: token?.length,
    })

    const OV = new OpenVidu()
    openViduRef.current = OV
    console.log('[OpenVidu] 오픈비듀 객체 생성~')

    const session = OV.initSession()
    sessionRef.current = session
    console.log('[OpenVidu] 세션 초기화 완료', {
      sessionId: session.sessionId,
      capabilities: session.capabilities,
    })

    session.on('streamCreated', event => {
      console.log('[OpenVidu] 스트림 생성:', {
        streamId: event.stream?.streamId,
        connectionId: event.stream?.connection?.connectionId,
        hasAudio: event.stream?.hasAudio,
        hasVideo: event.stream?.hasVideo,
        event,
      })

      try {
        console.log('[OpenVidu] 구독 스트림 시도중', {
          hasVideoRef: !!videoRef.current,
          streamId: event.stream?.streamId,
        })

        // 비디오 엘리먼트를 직접 전달하여 구독자 초기화
        const subscriber = session.subscribe(event.stream, videoRef.current || undefined)
        subscriberRef.current = subscriber

        console.log('[OpenVidu] 구독자 구독 생성', {
          subscriberId: subscriber.id,
          streamId: subscriber.stream?.streamId,
        })

        subscriber.on('videoElementCreated', e => {
          console.log('[OpenVidu] 구독자 비디오 객체:', {
            hasElement: !!e.element,
            elementType: e.element?.tagName,
            event: e,
          })

          if (videoRef.current) {
            console.log('[OpenVidu] 비디오 엘리먼트 생성 이벤트 처리 중 - 비디오 객체 존재')
            // e.element는 OpenVidu가 생성한 비디오 엘리먼트
            const openViduVideoElement = e.element as HTMLVideoElement

            // videoElementCreated에서는 스트림 연결하지 않고 상태만 확인
            // 실제 연결은 streamPlaying 이벤트에서 수행 (스트림이 재생 가능한 상태일 때)
            if (openViduVideoElement.srcObject) {
              console.log(
                '[OpenVidu] 구독자 비디오 엘리먼트 생성: srcObject 확인됨 (streamPlaying 대기)',
                {
                  hasSrcObject: !!openViduVideoElement.srcObject,
                  tracks: (openViduVideoElement.srcObject as MediaStream)?.getTracks()?.length,
                }
              )
              // streamPlaying 이벤트에서 연결하도록 함
            } else {
              console.log(
                '[OpenVidu] 구독자 비디오 엘리먼트 생성: srcObject 없음 (streamPlaying 대기)',
                {
                  hasSubscriberStream: !!subscriber.stream,
                }
              )
              // streamPlaying 이벤트에서 연결하도록 함
            }
          } else {
            console.log('[OpenVidu] 구독자 비디오 엘리먼트 생성: videoRef.current가 null, 건너뜀')
          }
        })

        subscriber.on('streamPlaying', event => {
          hasStreamPlayingFiredRef.current = true // streamPlaying 이벤트 발생 표시
          console.log('[OpenVidu] 구독자 스트림 재생 이벤트:', {
            hasVideoRef: !!videoRef.current,
            hasSrcObject: !!videoRef.current?.srcObject,
            isStreamAttached: isStreamAttachedRef.current,
            event,
          })

          // streamPlaying 이벤트는 스트림이 재생 가능한 상태가 되었을 때 발생
          // 이 시점에만 스트림을 연결해야 함
          if (videoRef.current && !isStreamAttachedRef.current) {
            console.log(
              '[OpenVidu] 구독자 스트림 재생: 스트림 연결 시작 (streamPlaying에서 스트림이 준비됨)'
            )
            try {
              // OpenVidu 구독자의 스트림에서 MediaStream 가져오기
              const mediaStream = subscriber.stream?.getMediaStream()
              if (mediaStream && mediaStream.getTracks().length > 0) {
                // ICE 연결 상태 확인
                const peerConnection = subscriber.stream?.getRTCPeerConnection()
                const iceConnectionState = peerConnection?.iceConnectionState

                console.log('[OpenVidu] 구독자 스트림 재생: ICE 연결 상태 확인', {
                  iceConnectionState,
                  tracks: mediaStream.getTracks()?.length,
                  audioTracks: mediaStream.getAudioTracks()?.length,
                  videoTracks: mediaStream.getVideoTracks()?.length,
                })

                // ICE 연결이 안정적인 상태인지 확인 (connected, completed, or checking도 허용)
                if (
                  iceConnectionState &&
                  ['connected', 'completed', 'checking'].includes(iceConnectionState)
                ) {
                  // 스트림이 준비된 상태에서만 연결
                  videoRef.current.srcObject = mediaStream
                  // muted 속성을 명시적으로 설정하여 autoplay 정책 우회 (브라우저 autoplay 정책)
                  videoRef.current.muted = true
                  isStreamAttachedRef.current = true // 연결 상태 표시
                  console.log('[OpenVidu] 구독자: 스트림 연결 완료 (streamPlaying에서)')

                  // 폴백 타임아웃 제거 (streamPlaying이 발생했으므로)
                  if (fallbackTimeoutRef.current) {
                    clearTimeout(fallbackTimeoutRef.current)
                    fallbackTimeoutRef.current = null
                    console.log('[OpenVidu] 구독자: streamPlaying 발생으로 폴백 타임아웃 제거')
                  }

                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log('[OpenVidu] 구독자 비디오 재생 성공 (streamPlaying에서)')
                    })
                    .catch(err => {
                      console.error('[OpenVidu] 구독자 비디오 재생 에러 (streamPlaying에서):', {
                        errorName: err.name,
                        errorMessage: err.message,
                        error: err,
                      })
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] 자동재생 차단됨, 사용자 상호작용 필요')
                      } else {
                        console.log(
                          '[OpenVidu] 재생 에러가 NotAllowedError가 아님, 에러 타입:',
                          err.name
                        )
                      }
                    })
                } else {
                  console.log('[OpenVidu] 구독자: ICE 연결 상태가 안정적이지 않음, 대기 중', {
                    iceConnectionState,
                    hasSubscriberStream: !!subscriber.stream,
                  })
                }
              } else {
                console.log('[OpenVidu] 구독자: MediaStream이 아직 준비되지 않음', {
                  hasSubscriberStream: !!subscriber.stream,
                  hasMediaStream: !!mediaStream,
                  tracksCount: mediaStream?.getTracks()?.length || 0,
                })
              }
            } catch (err) {
              console.warn('[OpenVidu] 구독자: MediaStream 획득 실패:', {
                error: err,
                errorName: err instanceof Error ? err.name : 'Unknown',
                errorMessage: err instanceof Error ? err.message : String(err),
              })
            }
          } else if (videoRef.current && isStreamAttachedRef.current) {
            console.log('[OpenVidu] 구독자: 스트림 이미 연결됨, 재생만 수행', {
              hasSrcObject: !!videoRef.current.srcObject,
              tracks: (videoRef.current.srcObject as MediaStream)?.getTracks()?.length,
            })
            // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
            if (videoRef.current) {
              videoRef.current.muted = true
            }
            videoRef.current
              .play()
              .then(() => {
                setPlayError(false)
                console.log('[OpenVidu] 구독자 비디오 재생 성공 (streamPlaying에서, 이미 연결됨)')
              })
              .catch(err => {
                console.error(
                  '[OpenVidu] 구독자 비디오 재생 에러 (streamPlaying에서, 이미 연결됨):',
                  {
                    errorName: err.name,
                    errorMessage: err.message,
                    error: err,
                  }
                )
                if (err.name === 'NotAllowedError') {
                  setPlayError(true)
                  console.log('[OpenVidu] 자동재생 차단됨, 사용자 상호작용 필요')
                } else {
                  console.log('[OpenVidu] 재생 에러가 NotAllowedError가 아님, 에러 타입:', err.name)
                }
              })
          } else {
            console.log(
              '[OpenVidu] 구독자 스트림 재생: videoRef.current가 null 또는 이미 연결됨, 건너뜀',
              {
                hasVideoRef: !!videoRef.current,
                isStreamAttached: isStreamAttachedRef.current,
              }
            )
          }
        })

        // streamPropertyChanged 이벤트도 처리 (스트림 속성이 변경될 때)
        subscriber.on('streamPropertyChanged', event => {
          console.log('[OpenVidu] 구독자 스트림 속성 변경 이벤트:', {
            changedProperty: event.changedProperty,
            newValue: event.newValue,
            reason: event.reason,
            event,
          })

          // streamPropertyChanged에서는 이미 연결된 경우에만 처리
          // 새로운 연결은 streamPlaying에서만 수행
          if (videoRef.current && isStreamAttachedRef.current && videoRef.current.srcObject) {
            console.log('[OpenVidu] 구독자 스트림 속성 변경: 스트림 이미 연결됨, 재생만 확인')
            // 이미 연결되어 있으므로 재생 상태만 확인
            if (videoRef.current.paused) {
              videoRef.current
                .play()
                .then(() => {
                  setPlayError(false)
                  console.log(
                    '[OpenVidu] 구독자 비디오 재생 성공 (streamPropertyChanged에서 재생 재시도)'
                  )
                })
                .catch(err => {
                  console.error('[OpenVidu] 구독자 비디오 재생 에러 (streamPropertyChanged에서):', {
                    errorName: err.name,
                    errorMessage: err.message,
                    error: err,
                  })
                  if (err.name === 'NotAllowedError') {
                    setPlayError(true)
                    console.log('[OpenVidu] 자동재생 차단됨, 사용자 상호작용 필요')
                  }
                })
            }
          } else {
            console.log(
              '[OpenVidu] 구독자 스트림 속성 변경: 스트림 미연결, 건너뜀 (streamPlaying 대기)',
              {
                hasVideoRef: !!videoRef.current,
                isStreamAttached: isStreamAttachedRef.current,
                hasSrcObject: !!videoRef.current?.srcObject,
              }
            )
          }
        })

        // 구독 직후에도 스트림 연결 시도 (폴백 메커니즘)
        // streamPlaying이 4초 안에 발생하지 않은 경우를 대비한 폴백
        // streamPlaying 이벤트가 4초 안에 발생해야 하므로, 최소 5초 후에 폴백 실행
        // 네트워크 지연을 고려하여 총 15초까지 대기
        console.log('[OpenVidu] 구독자 스트림 연결을 위한 타임아웃 폴백 설정 (5초 후, 총 15초까지)')

        let fallbackRetryCount = 0
        const initialFallbackDelay = 5000 // streamPlaying이 4초 안에 발생해야 하므로 5초 후 시작
        const maxFallbackRetries = 10 // 최대 10회 재시도 (총 15초까지)

        const tryAttachStream = () => {
          fallbackRetryCount++
          const elapsedTime = initialFallbackDelay + (fallbackRetryCount - 1) * 1000
          console.log(`[OpenVidu] 타임아웃 폴백 콜백 실행 (${elapsedTime}ms 후)`, {
            hasVideoRef: !!videoRef.current,
            hasSrcObject: !!videoRef.current?.srcObject,
            isStreamAttached: isStreamAttachedRef.current,
            hasStreamPlayingFired: hasStreamPlayingFiredRef.current,
            hasSubscriberStream: !!subscriber.stream,
          })

          // streamPlaying 이벤트가 이미 발생했으면 폴백 불필요
          if (hasStreamPlayingFiredRef.current) {
            console.log('[OpenVidu] 타임아웃 폴백: streamPlaying 이벤트가 이미 발생함, 종료')
            fallbackTimeoutRef.current = null
            return
          }

          // 이미 연결되어 있으면 더 이상 시도하지 않음
          if (isStreamAttachedRef.current || videoRef.current?.srcObject) {
            console.log('[OpenVidu] 타임아웃 폴백: 이미 스트림 연결됨, 종료')
            fallbackTimeoutRef.current = null
            return
          }

          if (videoRef.current && subscriber.stream) {
            try {
              const mediaStream = subscriber.stream.getMediaStream()
              // MediaStream이 존재하고 트랙이 있는지 확인 (스트림이 완전히 준비되었는지)
              if (mediaStream && mediaStream.getTracks().length > 0) {
                // ICE 연결 상태 확인
                const peerConnection = subscriber.stream?.getRTCPeerConnection()
                const iceConnectionState = peerConnection?.iceConnectionState

                console.log('[OpenVidu] 타임아웃 폴백: ICE 연결 상태 확인', {
                  iceConnectionState,
                  tracks: mediaStream.getTracks()?.length,
                  audioTracks: mediaStream.getAudioTracks()?.length,
                  videoTracks: mediaStream.getVideoTracks()?.length,
                })

                // ICE 연결이 안정적인 상태인지 확인 (connected, completed만 허용 - checking은 불안정)
                if (iceConnectionState && ['connected', 'completed'].includes(iceConnectionState)) {
                  console.log('[OpenVidu] 타임아웃 폴백: MediaStream 획득 및 검증 완료', {
                    tracks: mediaStream.getTracks()?.length,
                    audioTracks: mediaStream.getAudioTracks()?.length,
                    videoTracks: mediaStream.getVideoTracks()?.length,
                  })
                  videoRef.current.srcObject = mediaStream
                  // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                  videoRef.current.muted = true
                  isStreamAttachedRef.current = true
                  fallbackTimeoutRef.current = null
                  console.log('[OpenVidu] 구독자: 타임아웃 폴백으로 스트림 연결됨')

                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log('[OpenVidu] 구독자 비디오 재생 성공 (타임아웃 폴백에서)')
                    })
                    .catch(err => {
                      console.error('[OpenVidu] 구독자 비디오 재생 에러 (타임아웃 폴백에서):', {
                        errorName: err.name,
                        errorMessage: err.message,
                        error: err,
                      })
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] 자동재생 차단됨, 사용자 상호작용 필요')
                      } else {
                        console.log(
                          '[OpenVidu] 재생 에러가 NotAllowedError가 아님, 에러 타입:',
                          err.name
                        )
                      }
                    })
                } else {
                  console.log(
                    '[OpenVidu] 타임아웃 폴백: ICE 연결 상태가 안정적이지 않음, 재시도 대기',
                    {
                      iceConnectionState,
                      hasSubscriberStream: !!subscriber.stream,
                      retryCount: fallbackRetryCount,
                      maxRetries: maxFallbackRetries,
                    }
                  )
                  // 아직 준비되지 않았고 재시도 횟수가 남아있으면 계속 시도
                  if (fallbackRetryCount < maxFallbackRetries) {
                    fallbackTimeoutRef.current = setTimeout(tryAttachStream, 1000)
                  } else {
                    console.log('[OpenVidu] 타임아웃 폴백: 최대 재시도 횟수 도달, 종료')
                    fallbackTimeoutRef.current = null
                  }
                }
              } else {
                console.log(
                  '[OpenVidu] 타임아웃 폴백: MediaStream이 아직 준비되지 않음, 재시도 대기',
                  {
                    hasSubscriberStream: !!subscriber.stream,
                    hasMediaStream: !!mediaStream,
                    tracksCount: mediaStream?.getTracks()?.length || 0,
                    retryCount: fallbackRetryCount,
                    maxRetries: maxFallbackRetries,
                  }
                )
                // 아직 준비되지 않았고 재시도 횟수가 남아있으면 계속 시도
                if (fallbackRetryCount < maxFallbackRetries) {
                  fallbackTimeoutRef.current = setTimeout(tryAttachStream, 1000)
                } else {
                  console.log('[OpenVidu] 타임아웃 폴백: 최대 재시도 횟수 도달, 종료')
                  fallbackTimeoutRef.current = null
                }
              }
            } catch (err) {
              console.warn('[OpenVidu] 구독자: 타임아웃 폴백에서 MediaStream 획득 실패:', {
                error: err,
                errorName: err instanceof Error ? err.name : 'Unknown',
                errorMessage: err instanceof Error ? err.message : String(err),
              })
              // 재시도 횟수가 남아있으면 계속 시도
              if (fallbackRetryCount < maxFallbackRetries) {
                fallbackTimeoutRef.current = setTimeout(tryAttachStream, 1000)
              } else {
                fallbackTimeoutRef.current = null
              }
            }
          } else {
            console.log('[OpenVidu] 타임아웃 폴백: 조건 미충족', {
              hasVideoRef: !!videoRef.current,
              hasSubscriberStream: !!subscriber.stream,
              retryCount: fallbackRetryCount,
              maxRetries: maxFallbackRetries,
            })
            // 재시도 횟수가 남아있으면 계속 시도
            if (fallbackRetryCount < maxFallbackRetries) {
              fallbackTimeoutRef.current = setTimeout(tryAttachStream, 1000)
            } else {
              fallbackTimeoutRef.current = null
            }
          }
        }

        // streamPlaying이 4초 안에 발생해야 하므로, 최소 5초 후에 폴백 실행
        fallbackTimeoutRef.current = setTimeout(tryAttachStream, initialFallbackDelay)
      } catch (err) {
        console.error('[OpenVidu] 구독 에러:', {
          error: err,
          errorName: err instanceof Error ? err.name : 'Unknown',
          errorMessage: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        })
        setError(err instanceof Error ? err.message : '스트림 구독 실패')
      }
    })

    console.log('[OpenVidu] 세션 연결 시도 중', {
      tokenLength: openViduToken?.length,
      isHost,
    })

    session
      .connect(openViduToken)
      .then(async () => {
        console.log('[OpenVidu] 세션 연결 완료!', {
          sessionId: session.sessionId,
          capabilities: session.capabilities,
        })
        isConnectingRef.current = false
        // 토큰 사용 표시 (이미 사용한 토큰은 재사용 방지)
        usedTokenRef.current = token
        console.log('[OpenVidu] 연결 상태 업데이트됨', {
          isConnecting: isConnectingRef.current,
          usedToken: usedTokenRef.current,
        })

        if (isHost) {
          console.log('[OpenVidu] 사용자가 호스트입니다, Publisher 초기화 중')
          try {
            console.log('[OpenVidu] 카메라 및 마이크 권한 요청 중...', {
              hasMediaDevices: !!navigator.mediaDevices,
              hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
            })

            // 카메라와 마이크 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              },
              audio: true,
            })

            console.log('[OpenVidu] 미디어 권한 승인됨, Publisher 초기화 중...', {
              tracks: stream.getTracks()?.length,
              audioTracks: stream.getAudioTracks()?.length,
              videoTracks: stream.getVideoTracks()?.length,
              videoTrackSettings: stream.getVideoTracks()?.[0]?.getSettings(),
              audioTrackSettings: stream.getAudioTracks()?.[0]?.getSettings(),
            })

            // 권한이 승인되면 임시 스트림을 종료하고 OpenVidu Publisher 사용 (OpenVidu가 직접 미디어 스트림 관리)
            console.log('[OpenVidu] 임시 미디어 스트림 트랙 종료 중')
            stream.getTracks().forEach(track => {
              console.log('[OpenVidu] 트랙 종료', { kind: track.kind, id: track.id })
              track.stop()
            })

            // 비디오 엘리먼트를 직접 전달하여 Publisher 초기화
            console.log('[OpenVidu] OpenVidu Publisher 초기화 중', {
              hasVideoRef: !!videoRef.current,
              options: {
                publishAudio: true,
                publishVideo: true,
                resolution: '1280x720',
                frameRate: 30,
              },
            })

            const publisher = await OV.initPublisherAsync(videoRef.current || undefined, {
              publishAudio: true,
              publishVideo: true,
              resolution: '1280x720',
              frameRate: 30,
            })

            publisherRef.current = publisher
            console.log('[OpenVidu] Publisher 초기화 완료', {
              publisherId: publisher.id,
              streamId: publisher.stream?.streamId,
              hasAudio: publisher.stream?.hasAudio,
              hasVideo: publisher.stream?.hasVideo,
            })

            // Publisher의 비디오 엘리먼트를 우리의 비디오 엘리먼트에 연결
            // initPublisherAsync에 비디오 엘리먼트를 전달했으므로 자동으로 연결됨
            // 하지만 추가로 이벤트 리스너도 등록하여 안정성 확보
            publisher.on('videoElementCreated', event => {
              console.log('[OpenVidu] Publisher 비디오 엘리먼트 생성 이벤트:', {
                hasElement: !!event.element,
                elementType: event.element?.tagName,
                event,
              })

              if (videoRef.current) {
                console.log('[OpenVidu] Publisher 비디오 엘리먼트 생성: videoRef 존재')
                // event.element는 OpenVidu가 생성한 비디오 엘리먼트
                const publisherVideoElement = event.element as HTMLVideoElement
                if (publisherVideoElement && publisherVideoElement.srcObject) {
                  console.log(
                    '[OpenVidu] Publisher 비디오 엘리먼트 생성: 엘리먼트에 srcObject 있음 (streamPlaying 대기)',
                    {
                      hasSrcObject: !!publisherVideoElement.srcObject,
                      tracks: (publisherVideoElement.srcObject as MediaStream)?.getTracks()?.length,
                    }
                  )
                  // videoElementCreated에서는 연결하지 않고 streamPlaying에서 연결
                  // handleStreamReady는 여기서 호출 (스트림은 준비되었으므로)
                  handleStreamReady(publisherVideoElement.srcObject as MediaStream)
                  console.log('[OpenVidu] Publisher 비디오 엘리먼트 생성: handleStreamReady 호출됨')
                } else {
                  console.log(
                    '[OpenVidu] Publisher 비디오 엘리먼트 생성: 엘리먼트 또는 srcObject 없음',
                    {
                      hasElement: !!publisherVideoElement,
                      hasSrcObject: !!publisherVideoElement?.srcObject,
                    }
                  )
                }
              } else {
                console.log(
                  '[OpenVidu] Publisher 비디오 엘리먼트 생성: videoRef.current가 null, 건너뜀'
                )
              }
            })

            // accessAllowed 이벤트 처리 (카메라/마이크 권한 승인 후)
            publisher.on('accessAllowed', () => {
              console.log('[OpenVidu] Publisher 접근 허용 이벤트 발생')
            })

            // accessDenied 이벤트 처리
            publisher.on('accessDenied', () => {
              console.error('[OpenVidu] Publisher 접근 거부 이벤트 발생')
              setError('카메라/마이크 접근이 거부되었습니다.')
            })

            // streamPlaying 이벤트 처리 (스트림이 재생될 때 발생)
            publisher.on('streamPlaying', event => {
              console.log('[OpenVidu] Publisher 스트림 재생 이벤트:', {
                hasVideoRef: !!videoRef.current,
                hasSrcObject: !!videoRef.current?.srcObject,
                isStreamAttached: isStreamAttachedRef.current,
                event,
              })

              // streamPlaying 이벤트는 스트림이 재생 가능한 상태가 되었을 때 발생
              // 이 시점에만 스트림을 연결해야 함
              if (videoRef.current && !isStreamAttachedRef.current) {
                console.log(
                  '[OpenVidu] Publisher 스트림 재생: 스트림 연결 시작 (streamPlaying에서 스트림이 준비됨)'
                )
                try {
                  // Publisher의 스트림에서 MediaStream 가져오기
                  const mediaStream = publisher.stream?.getMediaStream()
                  if (mediaStream && mediaStream.getTracks().length > 0) {
                    console.log('[OpenVidu] Publisher 스트림 재생: MediaStream 획득 및 검증 완료', {
                      tracks: mediaStream.getTracks()?.length,
                      audioTracks: mediaStream.getAudioTracks()?.length,
                      videoTracks: mediaStream.getVideoTracks()?.length,
                    })

                    // 스트림이 준비된 상태에서만 연결
                    videoRef.current.srcObject = mediaStream
                    // muted 속성을 명시적으로 설정 (호스트는 자신의 비디오를 보지만 음소거 유지하여 에코 방지)
                    videoRef.current.muted = true
                    isStreamAttachedRef.current = true // 연결 상태 표시
                    console.log('[OpenVidu] Publisher: 스트림 연결 완료 (streamPlaying에서)')

                    videoRef.current
                      .play()
                      .then(() => {
                        setPlayError(false)
                        console.log('[OpenVidu] Publisher 비디오 재생 성공 (streamPlaying에서)')
                      })
                      .catch(err => {
                        // AbortError는 비디오가 DOM에서 제거되었을 때 발생하는 일반적인 에러이므로 무시
                        if (err.name === 'AbortError') {
                          console.log(
                            '[OpenVidu] 비디오 재생 중단됨 (엘리먼트가 제거되었을 수 있음)'
                          )
                          return
                        }
                        console.error('[OpenVidu] 비디오 재생 에러 (streamPlaying에서):', {
                          errorName: err.name,
                          errorMessage: err.message,
                          error: err,
                        })
                        if (err.name === 'NotAllowedError') {
                          setPlayError(true)
                          console.log('[OpenVidu] 자동재생 차단됨, 사용자 상호작용 필요')
                        } else {
                          console.log(
                            '[OpenVidu] 재생 에러가 NotAllowedError 또는 AbortError가 아님, 에러 타입:',
                            err.name
                          )
                        }
                      })
                  } else {
                    console.log('[OpenVidu] Publisher: MediaStream이 아직 준비되지 않음', {
                      hasPublisherStream: !!publisher.stream,
                      hasMediaStream: !!mediaStream,
                      tracksCount: mediaStream?.getTracks()?.length || 0,
                    })
                  }
                } catch (err) {
                  console.warn('[OpenVidu] Publisher: MediaStream 획득 실패:', {
                    error: err,
                    errorName: err instanceof Error ? err.name : 'Unknown',
                    errorMessage: err instanceof Error ? err.message : String(err),
                  })
                }
              } else if (videoRef.current && isStreamAttachedRef.current) {
                console.log('[OpenVidu] Publisher: 스트림 이미 연결됨, 재생만 수행', {
                  hasSrcObject: !!videoRef.current.srcObject,
                  tracks: (videoRef.current.srcObject as MediaStream)?.getTracks()?.length,
                })
                // muted 속성을 명시적으로 설정 (브라우저 autoplay 정책)
                if (videoRef.current) {
                  videoRef.current.muted = true
                }
                videoRef.current
                  .play()
                  .then(() => {
                    setPlayError(false)
                    console.log(
                      '[OpenVidu] Publisher 비디오 재생 성공 (streamPlaying에서, 이미 연결됨)'
                    )
                  })
                  .catch(err => {
                    // AbortError는 비디오가 DOM에서 제거되었을 때 발생하는 일반적인 에러이므로 무시
                    if (err.name === 'AbortError') {
                      console.log('[OpenVidu] 비디오 재생 중단됨 (엘리먼트가 제거되었을 수 있음)')
                      return
                    }
                    console.error('[OpenVidu] 비디오 재생 에러 (streamPlaying에서):', {
                      errorName: err.name,
                      errorMessage: err.message,
                      error: err,
                    })
                    if (err.name === 'NotAllowedError') {
                      setPlayError(true)
                      console.log('[OpenVidu] 자동재생 차단됨, 사용자 상호작용 필요')
                    } else {
                      console.log(
                        '[OpenVidu] 재생 에러가 NotAllowedError 또는 AbortError가 아님, 에러 타입:',
                        err.name
                      )
                    }
                  })
              } else {
                console.log(
                  '[OpenVidu] Publisher 스트림 재생: videoRef.current가 null 또는 이미 연결됨, 건너뜀',
                  {
                    hasVideoRef: !!videoRef.current,
                    isStreamAttached: isStreamAttachedRef.current,
                  }
                )
              }
            })

            console.log('[OpenVidu] 세션에 Publisher 발행 중', {
              publisherId: publisher.id,
              sessionId: session.sessionId,
            })
            session.publish(publisher)
            console.log('[OpenVidu] Publisher 세션에 성공적으로 발행됨')
          } catch (err) {
            console.error('[OpenVidu] Publisher 에러:', {
              error: err,
              errorName: err instanceof Error ? err.name : 'Unknown',
              errorMessage: err instanceof Error ? err.message : String(err),
              stack: err instanceof Error ? err.stack : undefined,
            })
            if (err instanceof Error && err.name === 'NotAllowedError') {
              console.log('[OpenVidu] Publisher 에러: NotAllowedError - 권한 거부됨')
              setError(
                '카메라/마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.'
              )
            } else {
              console.log('[OpenVidu] Publisher 에러: 기타 에러 타입', {
                errorType: err instanceof Error ? err.name : typeof err,
              })
              setError(err instanceof Error ? err.message : 'Publisher 초기화 실패')
            }
          }
        } else {
          console.log('[OpenVidu] 사용자가 호스트가 아님, Publisher 초기화 건너뜀', {
            isHost,
          })
        }
      })
      .catch(err => {
        console.error('[OpenVidu] 연결 에러:', {
          error: err,
          errorName: err instanceof Error ? err.name : 'Unknown',
          errorMessage: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        })
        isConnectingRef.current = false
        setError(err instanceof Error ? err.message : '연결 실패')
      })
  }, [token, isHost, handleStreamReady])

  // 비디오 재생 재시도 핸들러
  const handlePlayRetry = useCallback(async () => {
    console.log('[OpenVidu] 비디오 재생 재시도 호출됨', {
      hasVideoRef: !!videoRef.current,
      hasSrcObject: !!videoRef.current?.srcObject,
      playError,
    })

    if (videoRef.current && videoRef.current.srcObject) {
      console.log('[OpenVidu] 비디오 재생 재시도: 조건 충족, 재생 시도 중')
      try {
        // 재시도 시에도 muted 속성 확인 (autoplay 정책 준수)
        videoRef.current.muted = true
        await videoRef.current.play()
        setPlayError(false)
        console.log('[OpenVidu] 비디오 재생 재시도 성공')
      } catch (err) {
        console.error('[OpenVidu] 비디오 재생 재시도 실패:', {
          error: err,
          errorName: err instanceof Error ? err.name : 'Unknown',
          errorMessage: err instanceof Error ? err.message : String(err),
        })
        setPlayError(true)
      }
    } else {
      console.log('[OpenVidu] 비디오 재생 재시도: 조건 미충족', {
        hasVideoRef: !!videoRef.current,
        hasSrcObject: !!videoRef.current?.srcObject,
      })
    }
  }, [playError])

  // 비디오 클릭 시 재생 재시도
  const handleVideoClick = useCallback(() => {
    console.log('[OpenVidu] 비디오 클릭 핸들러 호출됨', {
      playError,
      hasVideoRef: !!videoRef.current,
    })

    if (playError && videoRef.current) {
      console.log('[OpenVidu] 비디오 클릭: 재생 재시도 호출 중')
      handlePlayRetry()
    } else {
      console.log('[OpenVidu] 비디오 클릭: 조건 미충족, 재시도 건너뜀', {
        playError,
        hasVideoRef: !!videoRef.current,
      })
    }
  }, [playError, handlePlayRetry])

  console.log('[OpenVidu] 렌더링', {
    hasError: !!error,
    error,
    playError,
    // eslint-disable-next-line react-hooks/refs
    hasVideoRef: !!videoRef.current,
    // eslint-disable-next-line react-hooks/refs
    hasSrcObject: !!videoRef.current?.srcObject,
  })

  if (error) {
    console.log('[OpenVidu] 렌더링: 에러 메시지 표시 중', { error })
  } else {
    console.log('[OpenVidu] 렌더링: 비디오 엘리먼트 표시 중', {
      playError,
      // eslint-disable-next-line react-hooks/refs
      hasVideoRef: !!videoRef.current,
    })
    if (playError) {
      console.log('[OpenVidu] 렌더링: 재생 에러 오버레이 표시 중')
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="relative h-full w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={true}
            className="h-full w-full object-cover"
            onClick={handleVideoClick}
          />
          {playError && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50"
              onClick={handlePlayRetry}
            >
              <div className="text-center">
                <div className="mb-2 text-4xl">▶️</div>
                <p className="text-white">화면을 클릭하여 재생하세요</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
