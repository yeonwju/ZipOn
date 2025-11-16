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
  const isCleaningUpRef = useRef(false)
  const usedTokenRef = useRef<string | null>(null)

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
    if (!token) {
      return
    }

    // 같은 토큰으로 이미 연결했으면 무시 (토큰은 1회만 사용 가능)
    if (usedTokenRef.current === token) {
      console.log('[OpenVidu] Token already used, skip')
      return
    }

    // 이미 연결 중이거나 정리 중이면 무시
    if (isConnectingRef.current || isCleaningUpRef.current) {
      console.log('[OpenVidu] Already connecting or cleaning up, skip')
      return
    }

    // 이전 토큰이 있으면 정리 (토큰이 변경된 경우)
    if (usedTokenRef.current && usedTokenRef.current !== token) {
      console.log('[OpenVidu] Token changed, cleaning up previous connection')
      // cleanup은 cleanup 함수에서 처리됨
    }

    isConnectingRef.current = true
    setError(null)
    setPlayError(false)

    console.log('[OpenVidu] Initializing...')

    // 토큰에서 실제 토큰 값 추출
    const openViduToken = token
    console.log('[OpenVidu] Original token:', token)
    console.log('[OpenVidu] Extracted token:', openViduToken)

    const OV = new OpenVidu()
    openViduRef.current = OV
    const session = OV.initSession()
    sessionRef.current = session

    // cleanup에서 사용할 video element 참조 저장
    const videoElement = videoRef.current

    session.on('streamCreated', event => {
      console.log('[OpenVidu] Stream created:', event)
      // 이미 정리 중이면 구독하지 않음
      if (isCleaningUpRef.current) {
        console.log('[OpenVidu] Skipping subscription, cleanup in progress')
        return
      }

      try {
        // video element를 직접 전달하여 subscriber 초기화
        const subscriber = session.subscribe(event.stream, videoRef.current || undefined)
        subscriberRef.current = subscriber

        console.log('[OpenVidu] Subscriber created and subscribed')

        subscriber.on('videoElementCreated', e => {
          console.log('[OpenVidu] Subscriber videoElementCreated:', e)
          if (videoRef.current && !isCleaningUpRef.current) {
            // e.element는 OpenVidu가 생성한 video element
            const openViduVideoElement = e.element as HTMLVideoElement

            // srcObject가 있으면 직접 사용
            if (openViduVideoElement.srcObject) {
              videoRef.current.srcObject = openViduVideoElement.srcObject as MediaStream
              // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
              videoRef.current.muted = true
              console.log(
                '[OpenVidu] Subscriber video stream attached to video element (from srcObject)'
              )
            } else {
              // srcObject가 없으면 subscriber의 stream에서 가져오기
              try {
                const mediaStream = subscriber.stream?.getMediaStream()
                if (mediaStream) {
                  videoRef.current.srcObject = mediaStream
                  // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                  videoRef.current.muted = true
                  console.log(
                    '[OpenVidu] Subscriber video stream attached to video element (from getMediaStream)'
                  )
                } else {
                  console.log(
                    '[OpenVidu] Subscriber: MediaStream not available in videoElementCreated'
                  )
                  // 나중에 streamPlaying에서 처리하도록 함
                  return
                }
              } catch (err) {
                console.warn(
                  '[OpenVidu] Subscriber: Failed to get MediaStream in videoElementCreated:',
                  err
                )
                return
              }
            }

            // video element가 로드되면 재생 시작
            videoRef.current
              .play()
              .then(() => {
                setPlayError(false)
                console.log('[OpenVidu] Subscriber video playing successfully')
              })
              .catch(err => {
                console.error('[OpenVidu] Subscriber video play error:', err)
                if (err.name === 'NotAllowedError') {
                  setPlayError(true)
                  console.log('[OpenVidu] Autoplay blocked, user interaction required')
                }
              })
          }
        })

        subscriber.on('streamPlaying', event => {
          console.log('[OpenVidu] Subscriber stream playing:', event)
          if (videoRef.current && !isCleaningUpRef.current) {
            // video element에 스트림이 없으면 subscriber의 stream에서 직접 가져오기
            if (!videoRef.current.srcObject) {
              try {
                // OpenVidu Subscriber의 stream에서 MediaStream 가져오기
                const mediaStream = subscriber.stream?.getMediaStream()
                if (mediaStream) {
                  videoRef.current.srcObject = mediaStream
                  // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                  videoRef.current.muted = true
                  console.log('[OpenVidu] Subscriber: Stream attached from getMediaStream()')
                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log('[OpenVidu] Subscriber video playing successfully')
                    })
                    .catch(err => {
                      console.error('[OpenVidu] Subscriber video play error:', err)
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] Autoplay blocked, user interaction required')
                      }
                    })
                } else {
                  console.log('[OpenVidu] Subscriber: MediaStream not available yet')
                }
              } catch (err) {
                console.warn('[OpenVidu] Subscriber: Failed to get MediaStream:', err)
              }
            } else {
              console.log('[OpenVidu] Subscriber: Stream already attached, playing')
              // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
              if (videoRef.current) {
                videoRef.current.muted = true
              }
              videoRef.current
                .play()
                .then(() => {
                  setPlayError(false)
                  console.log('[OpenVidu] Subscriber video playing successfully')
                })
                .catch(err => {
                  console.error('[OpenVidu] Subscriber video play error:', err)
                  if (err.name === 'NotAllowedError') {
                    setPlayError(true)
                    console.log('[OpenVidu] Autoplay blocked, user interaction required')
                  }
                })
            }
          }
        })

        // streamPropertyChanged 이벤트도 처리 (스트림 속성 변경 시)
        subscriber.on('streamPropertyChanged', event => {
          console.log('[OpenVidu] Subscriber streamPropertyChanged:', event)
          if (videoRef.current && !isCleaningUpRef.current && !videoRef.current.srcObject) {
            try {
              const mediaStream = subscriber.stream?.getMediaStream()
              if (mediaStream) {
                videoRef.current.srcObject = mediaStream
                // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                videoRef.current.muted = true
                console.log('[OpenVidu] Subscriber: Stream attached from streamPropertyChanged')
                videoRef.current
                  .play()
                  .then(() => {
                    setPlayError(false)
                    console.log('[OpenVidu] Subscriber video playing successfully')
                  })
                  .catch(err => {
                    console.error('[OpenVidu] Subscriber video play error:', err)
                    if (err.name === 'NotAllowedError') {
                      setPlayError(true)
                      console.log('[OpenVidu] Autoplay blocked, user interaction required')
                    }
                  })
              }
            } catch (err) {
              console.warn(
                '[OpenVidu] Subscriber: Failed to get MediaStream from streamPropertyChanged:',
                err
              )
            }
          }
        })

        // 구독 직후에도 스트림 연결 시도
        setTimeout(() => {
          if (
            videoRef.current &&
            !videoRef.current.srcObject &&
            subscriber.stream &&
            !isCleaningUpRef.current
          ) {
            try {
              const mediaStream = subscriber.stream.getMediaStream()
              if (mediaStream) {
                videoRef.current.srcObject = mediaStream
                // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                videoRef.current.muted = true
                console.log('[OpenVidu] Subscriber: Stream attached after timeout')
                videoRef.current
                  .play()
                  .then(() => {
                    setPlayError(false)
                    console.log('[OpenVidu] Subscriber video playing successfully')
                  })
                  .catch(err => {
                    console.error('[OpenVidu] Subscriber video play error:', err)
                    if (err.name === 'NotAllowedError') {
                      setPlayError(true)
                      console.log('[OpenVidu] Autoplay blocked, user interaction required')
                    }
                  })
              }
            } catch (err) {
              console.warn('[OpenVidu] Subscriber: Failed to get MediaStream after timeout:', err)
            }
          }
        }, 1000)
      } catch (err) {
        console.error('[OpenVidu] Subscribe error:', err)
        if (!isCleaningUpRef.current) {
          setError(err instanceof Error ? err.message : '스트림 구독 실패')
        }
      }
    })

    session
      .connect(openViduToken)
      .then(async () => {
        // 연결 후 정리 중이면 무시
        if (isCleaningUpRef.current) {
          console.log('[OpenVidu] Connection completed but cleanup in progress, skipping publisher')
          return
        }

        console.log('[OpenVidu] Session connected!')
        isConnectingRef.current = false
        // 토큰 사용 표시
        usedTokenRef.current = token

        if (isHost) {
          try {
            console.log('[OpenVidu] Requesting camera and microphone permissions...')

            // 카메라와 마이크 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              },
              audio: true,
            })

            console.log('[OpenVidu] Media permissions granted, initializing publisher...')

            // 권한이 승인되면 스트림을 종료하고 OpenVidu Publisher 사용
            stream.getTracks().forEach(track => track.stop())

            // video element를 직접 전달하여 Publisher 초기화
            const publisher = await OV.initPublisherAsync(videoRef.current || undefined, {
              publishAudio: true,
              publishVideo: true,
              resolution: '1280x720',
              frameRate: 30,
            })

            // 정리 중이면 publish하지 않음
            if (isCleaningUpRef.current) {
              console.log('[OpenVidu] Cleanup in progress, skipping publish')
              return
            }

            publisherRef.current = publisher

            // Publisher의 video element를 우리의 video element에 연결
            // initPublisherAsync에 video element를 전달했으므로 자동으로 연결됨
            // 하지만 추가로 이벤트 리스너도 등록
            publisher.on('videoElementCreated', event => {
              console.log('[OpenVidu] Publisher videoElementCreated:', event)
              if (videoRef.current && !isCleaningUpRef.current) {
                // event.element는 OpenVidu가 생성한 video element
                const publisherVideoElement = event.element as HTMLVideoElement
                if (publisherVideoElement && publisherVideoElement.srcObject) {
                  // 이미 videoRef.current에 연결되어 있으면 확인만
                  if (videoRef.current.srcObject !== publisherVideoElement.srcObject) {
                    videoRef.current.srcObject = publisherVideoElement.srcObject as MediaStream
                    // muted 속성을 명시적으로 설정 (호스트는 자신의 비디오를 보지만 음소거 유지)
                    videoRef.current.muted = true
                    console.log('[OpenVidu] Video stream attached to video element')
                  }

                  // video element가 로드되면 재생 시작
                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log('[OpenVidu] Publisher video playing successfully')
                    })
                    .catch(err => {
                      // AbortError는 비디오가 DOM에서 제거되었을 때 발생하는 일반적인 에러 (무시)
                      if (err.name === 'AbortError') {
                        console.log('[OpenVidu] Video play aborted (element may be removed)')
                        return
                      }
                      console.error('[OpenVidu] Video play error:', err)
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] Autoplay blocked, user interaction required')
                      }
                    })

                  handleStreamReady(publisherVideoElement.srcObject as MediaStream)
                }
              }
            })

            // accessAllowed 이벤트 처리 (권한 승인 후)
            publisher.on('accessAllowed', () => {
              console.log('[OpenVidu] Publisher access allowed')
            })

            // accessDenied 이벤트 처리
            publisher.on('accessDenied', () => {
              console.error('[OpenVidu] Publisher access denied')
              if (!isCleaningUpRef.current) {
                setError('카메라/마이크 접근이 거부되었습니다.')
              }
            })

            // streamPlaying 이벤트 처리 (스트림이 재생될 때)
            publisher.on('streamPlaying', event => {
              console.log('[OpenVidu] Publisher stream playing:', event)
              if (videoRef.current && !isCleaningUpRef.current) {
                // video element에 이미 스트림이 연결되어 있는지 확인
                if (!videoRef.current.srcObject) {
                  console.log(
                    '[OpenVidu] No stream in video element, waiting for videoElementCreated event'
                  )
                } else {
                  console.log('[OpenVidu] Stream already attached, playing')
                  // muted 속성을 명시적으로 설정
                  if (videoRef.current) {
                    videoRef.current.muted = true
                  }
                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log('[OpenVidu] Publisher video playing successfully')
                    })
                    .catch(err => {
                      console.error('[OpenVidu] Video play error:', err)
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] Autoplay blocked, user interaction required')
                      }
                    })
                }
              }
            })

            session.publish(publisher)
            console.log('[OpenVidu] Publisher published to session')
          } catch (err) {
            console.error('[OpenVidu] Publisher error:', err)
            if (!isCleaningUpRef.current) {
              if (err instanceof Error && err.name === 'NotAllowedError') {
                setError(
                  '카메라/마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.'
                )
              } else {
                setError(err instanceof Error ? err.message : 'Publisher 초기화 실패')
              }
            }
          }
        }
      })
      .catch(err => {
        console.error('[OpenVidu] Connect error:', err)
        isConnectingRef.current = false
        if (!isCleaningUpRef.current) {
          setError(err instanceof Error ? err.message : '연결 실패')
        }
      })

    return () => {
      if (isCleaningUpRef.current) {
        return
      }

      isCleaningUpRef.current = true
      isConnectingRef.current = false
      console.log('[OpenVidu] Cleanup started')

      // 비동기 정리를 위해 setTimeout 사용
      setTimeout(() => {
        try {
          const currentSession = sessionRef.current
          const currentPublisher = publisherRef.current

          // Publisher 정리
          if (currentPublisher && currentSession) {
            try {
              // Publisher가 publish되어 있는지 확인 후 unpublish
              const isPublished = currentPublisher.stream && currentPublisher.stream.streamId
              if (isPublished) {
                currentSession.unpublish(currentPublisher)
              }
            } catch (err) {
              console.warn('[OpenVidu] Unpublish error (may already be unpublished):', err)
            }
            publisherRef.current = null
          }

          // Subscriber 정리
          if (subscriberRef.current) {
            try {
              // Subscriber 구독 해제
              subscriberRef.current = null
            } catch (err) {
              console.warn('[OpenVidu] Subscriber cleanup error:', err)
            }
          }

          // Session 정리
          if (currentSession) {
            try {
              // 세션이 연결되어 있는지 확인
              // OpenVidu Session은 capabilities가 있으면 연결된 것으로 간주
              const isConnected = currentSession.capabilities !== undefined

              if (isConnected) {
                currentSession.disconnect()
              }
            } catch (err) {
              // 이미 연결이 끊어진 경우 무시
              console.warn('[OpenVidu] Disconnect error (may already be disconnected):', err)
            }
            sessionRef.current = null
          }

          // OpenVidu 인스턴스 정리
          openViduRef.current = null

          // Video element 정리
          if (videoElement) {
            videoElement.srcObject = null
          }

          // 토큰 사용 상태는 유지 (토큰은 1회만 사용 가능하므로)
          // usedTokenRef.current는 유지

          console.log('[OpenVidu] Cleanup completed')
        } catch (err) {
          console.error('[OpenVidu] Cleanup error:', err)
        } finally {
          isCleaningUpRef.current = false
        }
      }, 0)
    }
  }, [token, isHost, handleStreamReady])

  // 비디오 재생 재시도 핸들러
  const handlePlayRetry = useCallback(async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        // 재시도 시에도 muted 속성 확인
        videoRef.current.muted = true
        await videoRef.current.play()
        setPlayError(false)
        console.log('[OpenVidu] Video play retry successful')
      } catch (err) {
        console.error('[OpenVidu] Video play retry failed:', err)
        setPlayError(true)
      }
    }
  }, [])

  // 비디오 클릭 시 재생 재시도
  const handleVideoClick = useCallback(() => {
    if (playError && videoRef.current) {
      handlePlayRetry()
    }
  }, [playError, handlePlayRetry])

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
