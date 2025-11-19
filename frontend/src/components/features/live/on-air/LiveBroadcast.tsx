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
    console.log('[OpenVidu] useEffect triggered', { token, isHost, hasToken: !!token })

    if (!token) {
      console.log('[OpenVidu] No token provided, skipping initialization')
      return
    }

    // 같은 토큰으로 이미 연결했으면 무시 (토큰은 1회만 사용 가능)
    if (usedTokenRef.current === token) {
      console.log('[OpenVidu] Token already used, skip', {
        currentToken: token,
        usedToken: usedTokenRef.current,
      })
      return
    }

    // 이미 연결 중이면 무시
    if (isConnectingRef.current) {
      console.log('[OpenVidu] Already connecting, skip', {
        isConnecting: isConnectingRef.current,
      })
      return
    }

    isConnectingRef.current = true
    setError(null)
    setPlayError(false)

    console.log('[OpenVidu] Initializing...', {
      token,
      isHost,
      hasVideoRef: !!videoRef.current,
    })

    // 토큰에서 실제 토큰 값 추출
    const openViduToken = token
    console.log('[OpenVidu] Token info:', {
      original: token,
      extracted: openViduToken,
      tokenLength: token?.length,
    })

    const OV = new OpenVidu()
    openViduRef.current = OV
    console.log('[OpenVidu] OpenVidu instance created')

    const session = OV.initSession()
    sessionRef.current = session
    console.log('[OpenVidu] Session initialized', {
      sessionId: session.sessionId,
      capabilities: session.capabilities,
    })

    session.on('streamCreated', event => {
      console.log('[OpenVidu] Stream created event:', {
        streamId: event.stream?.streamId,
        connectionId: event.stream?.connection?.connectionId,
        hasAudio: event.stream?.hasAudio,
        hasVideo: event.stream?.hasVideo,
        event,
      })

      try {
        console.log('[OpenVidu] Attempting to subscribe to stream', {
          hasVideoRef: !!videoRef.current,
          streamId: event.stream?.streamId,
        })

        // video element를 직접 전달하여 subscriber 초기화
        const subscriber = session.subscribe(event.stream, videoRef.current || undefined)
        subscriberRef.current = subscriber

        console.log('[OpenVidu] Subscriber created and subscribed', {
          subscriberId: subscriber.id,
          streamId: subscriber.stream?.streamId,
        })

        subscriber.on('videoElementCreated', e => {
          console.log('[OpenVidu] Subscriber videoElementCreated event:', {
            hasElement: !!e.element,
            elementType: e.element?.tagName,
            event: e,
          })

          if (videoRef.current) {
            console.log('[OpenVidu] Processing videoElementCreated - videoRef exists')
            // e.element는 OpenVidu가 생성한 video element
            const openViduVideoElement = e.element as HTMLVideoElement

            // srcObject가 있으면 직접 사용
            if (openViduVideoElement.srcObject) {
              console.log(
                '[OpenVidu] Subscriber videoElementCreated: Using srcObject from element',
                {
                  hasSrcObject: !!openViduVideoElement.srcObject,
                  tracks: (openViduVideoElement.srcObject as MediaStream)?.getTracks()?.length,
                }
              )
              videoRef.current.srcObject = openViduVideoElement.srcObject as MediaStream
              // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
              videoRef.current.muted = true
              console.log(
                '[OpenVidu] Subscriber video stream attached to video element (from srcObject)'
              )
            } else {
              console.log(
                '[OpenVidu] Subscriber videoElementCreated: No srcObject, trying getMediaStream()'
              )
              // srcObject가 없으면 subscriber의 stream에서 가져오기
              try {
                const mediaStream = subscriber.stream?.getMediaStream()
                if (mediaStream) {
                  console.log(
                    '[OpenVidu] Subscriber videoElementCreated: Got MediaStream from subscriber.stream',
                    {
                      tracks: mediaStream.getTracks()?.length,
                      audioTracks: mediaStream.getAudioTracks()?.length,
                      videoTracks: mediaStream.getVideoTracks()?.length,
                    }
                  )
                  videoRef.current.srcObject = mediaStream
                  // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                  videoRef.current.muted = true
                  console.log(
                    '[OpenVidu] Subscriber video stream attached to video element (from getMediaStream)'
                  )
                } else {
                  console.log(
                    '[OpenVidu] Subscriber: MediaStream not available in videoElementCreated',
                    {
                      hasSubscriberStream: !!subscriber.stream,
                    }
                  )
                  // 나중에 streamPlaying에서 처리하도록 함
                  return
                }
              } catch (err) {
                console.warn(
                  '[OpenVidu] Subscriber: Failed to get MediaStream in videoElementCreated:',
                  {
                    error: err,
                    errorName: err instanceof Error ? err.name : 'Unknown',
                    errorMessage: err instanceof Error ? err.message : String(err),
                  }
                )
                return
              }
            }

            // video element가 로드되면 재생 시작
            console.log('[OpenVidu] Subscriber videoElementCreated: Attempting to play video')
            videoRef.current
              .play()
              .then(() => {
                setPlayError(false)
                console.log(
                  '[OpenVidu] Subscriber video playing successfully from videoElementCreated'
                )
              })
              .catch(err => {
                console.error('[OpenVidu] Subscriber video play error from videoElementCreated:', {
                  errorName: err.name,
                  errorMessage: err.message,
                  error: err,
                })
                if (err.name === 'NotAllowedError') {
                  setPlayError(true)
                  console.log('[OpenVidu] Autoplay blocked, user interaction required')
                } else {
                  console.log('[OpenVidu] Play error is not NotAllowedError, error type:', err.name)
                }
              })
          } else {
            console.log(
              '[OpenVidu] Subscriber videoElementCreated: videoRef.current is null, skipping'
            )
          }
        })

        subscriber.on('streamPlaying', event => {
          console.log('[OpenVidu] Subscriber streamPlaying event:', {
            hasVideoRef: !!videoRef.current,
            hasSrcObject: !!videoRef.current?.srcObject,
            event,
          })

          if (videoRef.current) {
            // video element에 스트림이 없으면 subscriber의 stream에서 직접 가져오기
            if (!videoRef.current.srcObject) {
              console.log(
                '[OpenVidu] Subscriber streamPlaying: No srcObject, attempting to get from subscriber.stream'
              )
              try {
                // OpenVidu Subscriber의 stream에서 MediaStream 가져오기
                const mediaStream = subscriber.stream?.getMediaStream()
                if (mediaStream) {
                  console.log('[OpenVidu] Subscriber streamPlaying: Got MediaStream', {
                    tracks: mediaStream.getTracks()?.length,
                    audioTracks: mediaStream.getAudioTracks()?.length,
                    videoTracks: mediaStream.getVideoTracks()?.length,
                  })
                  videoRef.current.srcObject = mediaStream
                  // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                  videoRef.current.muted = true
                  console.log('[OpenVidu] Subscriber: Stream attached from getMediaStream()')
                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log(
                        '[OpenVidu] Subscriber video playing successfully from streamPlaying'
                      )
                    })
                    .catch(err => {
                      console.error('[OpenVidu] Subscriber video play error from streamPlaying:', {
                        errorName: err.name,
                        errorMessage: err.message,
                        error: err,
                      })
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] Autoplay blocked, user interaction required')
                      } else {
                        console.log(
                          '[OpenVidu] Play error is not NotAllowedError, error type:',
                          err.name
                        )
                      }
                    })
                } else {
                  console.log('[OpenVidu] Subscriber: MediaStream not available yet', {
                    hasSubscriberStream: !!subscriber.stream,
                  })
                }
              } catch (err) {
                console.warn('[OpenVidu] Subscriber: Failed to get MediaStream:', {
                  error: err,
                  errorName: err instanceof Error ? err.name : 'Unknown',
                  errorMessage: err instanceof Error ? err.message : String(err),
                })
              }
            } else {
              console.log('[OpenVidu] Subscriber: Stream already attached, playing', {
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
                  console.log(
                    '[OpenVidu] Subscriber video playing successfully from streamPlaying (already attached)'
                  )
                })
                .catch(err => {
                  console.error(
                    '[OpenVidu] Subscriber video play error from streamPlaying (already attached):',
                    {
                      errorName: err.name,
                      errorMessage: err.message,
                      error: err,
                    }
                  )
                  if (err.name === 'NotAllowedError') {
                    setPlayError(true)
                    console.log('[OpenVidu] Autoplay blocked, user interaction required')
                  } else {
                    console.log(
                      '[OpenVidu] Play error is not NotAllowedError, error type:',
                      err.name
                    )
                  }
                })
            }
          } else {
            console.log('[OpenVidu] Subscriber streamPlaying: videoRef.current is null, skipping')
          }
        })

        // streamPropertyChanged 이벤트도 처리 (스트림 속성 변경 시)
        subscriber.on('streamPropertyChanged', event => {
          console.log('[OpenVidu] Subscriber streamPropertyChanged event:', {
            changedProperty: event.changedProperty,
            newValue: event.newValue,
            reason: event.reason,
            event,
          })

          if (videoRef.current && !videoRef.current.srcObject) {
            console.log(
              '[OpenVidu] Subscriber streamPropertyChanged: No srcObject, attempting to get MediaStream'
            )
            try {
              const mediaStream = subscriber.stream?.getMediaStream()
              if (mediaStream) {
                console.log('[OpenVidu] Subscriber streamPropertyChanged: Got MediaStream', {
                  tracks: mediaStream.getTracks()?.length,
                  audioTracks: mediaStream.getAudioTracks()?.length,
                  videoTracks: mediaStream.getVideoTracks()?.length,
                })
                videoRef.current.srcObject = mediaStream
                // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                videoRef.current.muted = true
                console.log('[OpenVidu] Subscriber: Stream attached from streamPropertyChanged')
                videoRef.current
                  .play()
                  .then(() => {
                    setPlayError(false)
                    console.log(
                      '[OpenVidu] Subscriber video playing successfully from streamPropertyChanged'
                    )
                  })
                  .catch(err => {
                    console.error(
                      '[OpenVidu] Subscriber video play error from streamPropertyChanged:',
                      {
                        errorName: err.name,
                        errorMessage: err.message,
                        error: err,
                      }
                    )
                    if (err.name === 'NotAllowedError') {
                      setPlayError(true)
                      console.log('[OpenVidu] Autoplay blocked, user interaction required')
                    } else {
                      console.log(
                        '[OpenVidu] Play error is not NotAllowedError, error type:',
                        err.name
                      )
                    }
                  })
              } else {
                console.log(
                  '[OpenVidu] Subscriber streamPropertyChanged: MediaStream not available',
                  {
                    hasSubscriberStream: !!subscriber.stream,
                  }
                )
              }
            } catch (err) {
              console.warn(
                '[OpenVidu] Subscriber: Failed to get MediaStream from streamPropertyChanged:',
                {
                  error: err,
                  errorName: err instanceof Error ? err.name : 'Unknown',
                  errorMessage: err instanceof Error ? err.message : String(err),
                }
              )
            }
          } else {
            console.log('[OpenVidu] Subscriber streamPropertyChanged: Skipping', {
              hasVideoRef: !!videoRef.current,
              hasSrcObject: !!videoRef.current?.srcObject,
            })
          }
        })

        // 구독 직후에도 스트림 연결 시도
        console.log('[OpenVidu] Setting up timeout fallback for subscriber stream attachment')
        setTimeout(() => {
          console.log('[OpenVidu] Timeout callback executed (1s after subscription)', {
            hasVideoRef: !!videoRef.current,
            hasSrcObject: !!videoRef.current?.srcObject,
            hasSubscriberStream: !!subscriber.stream,
          })

          if (videoRef.current && !videoRef.current.srcObject && subscriber.stream) {
            console.log('[OpenVidu] Timeout: Attempting to attach stream')
            try {
              const mediaStream = subscriber.stream.getMediaStream()
              if (mediaStream) {
                console.log('[OpenVidu] Timeout: Got MediaStream', {
                  tracks: mediaStream.getTracks()?.length,
                  audioTracks: mediaStream.getAudioTracks()?.length,
                  videoTracks: mediaStream.getVideoTracks()?.length,
                })
                videoRef.current.srcObject = mediaStream
                // muted 속성을 명시적으로 설정하여 autoplay 정책 우회
                videoRef.current.muted = true
                console.log('[OpenVidu] Subscriber: Stream attached after timeout')
                videoRef.current
                  .play()
                  .then(() => {
                    setPlayError(false)
                    console.log('[OpenVidu] Subscriber video playing successfully from timeout')
                  })
                  .catch(err => {
                    console.error('[OpenVidu] Subscriber video play error from timeout:', {
                      errorName: err.name,
                      errorMessage: err.message,
                      error: err,
                    })
                    if (err.name === 'NotAllowedError') {
                      setPlayError(true)
                      console.log('[OpenVidu] Autoplay blocked, user interaction required')
                    } else {
                      console.log(
                        '[OpenVidu] Play error is not NotAllowedError, error type:',
                        err.name
                      )
                    }
                  })
              } else {
                console.log('[OpenVidu] Timeout: MediaStream not available', {
                  hasSubscriberStream: !!subscriber.stream,
                })
              }
            } catch (err) {
              console.warn('[OpenVidu] Subscriber: Failed to get MediaStream after timeout:', {
                error: err,
                errorName: err instanceof Error ? err.name : 'Unknown',
                errorMessage: err instanceof Error ? err.message : String(err),
              })
            }
          } else {
            console.log('[OpenVidu] Timeout: Conditions not met, skipping', {
              hasVideoRef: !!videoRef.current,
              hasSrcObject: !!videoRef.current?.srcObject,
              hasSubscriberStream: !!subscriber.stream,
            })
          }
        }, 1000)
      } catch (err) {
        console.error('[OpenVidu] Subscribe error:', {
          error: err,
          errorName: err instanceof Error ? err.name : 'Unknown',
          errorMessage: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        })
        setError(err instanceof Error ? err.message : '스트림 구독 실패')
      }
    })

    console.log('[OpenVidu] Attempting to connect to session', {
      tokenLength: openViduToken?.length,
      isHost,
    })

    session
      .connect(openViduToken)
      .then(async () => {
        console.log('[OpenVidu] Session connected!', {
          sessionId: session.sessionId,
          capabilities: session.capabilities,
        })
        isConnectingRef.current = false
        // 토큰 사용 표시
        usedTokenRef.current = token
        console.log('[OpenVidu] Connection state updated', {
          isConnecting: isConnectingRef.current,
          usedToken: usedTokenRef.current,
        })

        if (isHost) {
          console.log('[OpenVidu] User is host, initializing publisher')
          try {
            console.log('[OpenVidu] Requesting camera and microphone permissions...', {
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

            console.log('[OpenVidu] Media permissions granted, initializing publisher...', {
              tracks: stream.getTracks()?.length,
              audioTracks: stream.getAudioTracks()?.length,
              videoTracks: stream.getVideoTracks()?.length,
              videoTrackSettings: stream.getVideoTracks()?.[0]?.getSettings(),
              audioTrackSettings: stream.getAudioTracks()?.[0]?.getSettings(),
            })

            // 권한이 승인되면 스트림을 종료하고 OpenVidu Publisher 사용
            console.log('[OpenVidu] Stopping temporary media stream tracks')
            stream.getTracks().forEach(track => {
              console.log('[OpenVidu] Stopping track', { kind: track.kind, id: track.id })
              track.stop()
            })

            // video element를 직접 전달하여 Publisher 초기화
            console.log('[OpenVidu] Initializing OpenVidu publisher', {
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
            console.log('[OpenVidu] Publisher initialized', {
              publisherId: publisher.id,
              streamId: publisher.stream?.streamId,
              hasAudio: publisher.stream?.hasAudio,
              hasVideo: publisher.stream?.hasVideo,
            })

            // Publisher의 video element를 우리의 video element에 연결
            // initPublisherAsync에 video element를 전달했으므로 자동으로 연결됨
            // 하지만 추가로 이벤트 리스너도 등록
            publisher.on('videoElementCreated', event => {
              console.log('[OpenVidu] Publisher videoElementCreated event:', {
                hasElement: !!event.element,
                elementType: event.element?.tagName,
                event,
              })

              if (videoRef.current) {
                console.log('[OpenVidu] Publisher videoElementCreated: videoRef exists')
                // event.element는 OpenVidu가 생성한 video element
                const publisherVideoElement = event.element as HTMLVideoElement
                if (publisherVideoElement && publisherVideoElement.srcObject) {
                  console.log('[OpenVidu] Publisher videoElementCreated: Element has srcObject', {
                    hasSrcObject: !!publisherVideoElement.srcObject,
                    tracks: (publisherVideoElement.srcObject as MediaStream)?.getTracks()?.length,
                  })
                  // 이미 videoRef.current에 연결되어 있으면 확인만
                  if (videoRef.current.srcObject !== publisherVideoElement.srcObject) {
                    console.log('[OpenVidu] Publisher videoElementCreated: Attaching new srcObject')
                    videoRef.current.srcObject = publisherVideoElement.srcObject as MediaStream
                    // muted 속성을 명시적으로 설정 (호스트는 자신의 비디오를 보지만 음소거 유지)
                    videoRef.current.muted = true
                    console.log('[OpenVidu] Video stream attached to video element')
                  } else {
                    console.log(
                      '[OpenVidu] Publisher videoElementCreated: srcObject already attached, skipping'
                    )
                  }

                  // video element가 로드되면 재생 시작
                  console.log('[OpenVidu] Publisher videoElementCreated: Attempting to play video')
                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log(
                        '[OpenVidu] Publisher video playing successfully from videoElementCreated'
                      )
                    })
                    .catch(err => {
                      // AbortError는 비디오가 DOM에서 제거되었을 때 발생하는 일반적인 에러 (무시)
                      if (err.name === 'AbortError') {
                        console.log('[OpenVidu] Video play aborted (element may be removed)')
                        return
                      }
                      console.error('[OpenVidu] Video play error from videoElementCreated:', {
                        errorName: err.name,
                        errorMessage: err.message,
                        error: err,
                      })
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] Autoplay blocked, user interaction required')
                      } else {
                        console.log(
                          '[OpenVidu] Play error is not NotAllowedError or AbortError, error type:',
                          err.name
                        )
                      }
                    })

                  handleStreamReady(publisherVideoElement.srcObject as MediaStream)
                  console.log('[OpenVidu] Publisher videoElementCreated: handleStreamReady called')
                } else {
                  console.log('[OpenVidu] Publisher videoElementCreated: No element or srcObject', {
                    hasElement: !!publisherVideoElement,
                    hasSrcObject: !!publisherVideoElement?.srcObject,
                  })
                }
              } else {
                console.log(
                  '[OpenVidu] Publisher videoElementCreated: videoRef.current is null, skipping'
                )
              }
            })

            // accessAllowed 이벤트 처리 (권한 승인 후)
            publisher.on('accessAllowed', () => {
              console.log('[OpenVidu] Publisher accessAllowed event fired')
            })

            // accessDenied 이벤트 처리
            publisher.on('accessDenied', () => {
              console.error('[OpenVidu] Publisher accessDenied event fired')
              setError('카메라/마이크 접근이 거부되었습니다.')
            })

            // streamPlaying 이벤트 처리 (스트림이 재생될 때)
            publisher.on('streamPlaying', event => {
              console.log('[OpenVidu] Publisher streamPlaying event:', {
                hasVideoRef: !!videoRef.current,
                hasSrcObject: !!videoRef.current?.srcObject,
                event,
              })

              if (videoRef.current) {
                // video element에 이미 스트림이 연결되어 있는지 확인
                if (!videoRef.current.srcObject) {
                  console.log(
                    '[OpenVidu] Publisher streamPlaying: No stream in video element, waiting for videoElementCreated event',
                    {
                      hasVideoRef: !!videoRef.current,
                      hasSrcObject: false,
                    }
                  )
                } else {
                  console.log(
                    '[OpenVidu] Publisher streamPlaying: Stream already attached, playing',
                    {
                      hasSrcObject: true,
                      tracks: (videoRef.current.srcObject as MediaStream)?.getTracks()?.length,
                    }
                  )
                  // muted 속성을 명시적으로 설정
                  if (videoRef.current) {
                    videoRef.current.muted = true
                  }
                  videoRef.current
                    .play()
                    .then(() => {
                      setPlayError(false)
                      console.log(
                        '[OpenVidu] Publisher video playing successfully from streamPlaying'
                      )
                    })
                    .catch(err => {
                      console.error('[OpenVidu] Video play error from streamPlaying:', {
                        errorName: err.name,
                        errorMessage: err.message,
                        error: err,
                      })
                      if (err.name === 'NotAllowedError') {
                        setPlayError(true)
                        console.log('[OpenVidu] Autoplay blocked, user interaction required')
                      } else {
                        console.log(
                          '[OpenVidu] Play error is not NotAllowedError, error type:',
                          err.name
                        )
                      }
                    })
                }
              } else {
                console.log(
                  '[OpenVidu] Publisher streamPlaying: videoRef.current is null, skipping'
                )
              }
            })

            console.log('[OpenVidu] Publishing publisher to session', {
              publisherId: publisher.id,
              sessionId: session.sessionId,
            })
            session.publish(publisher)
            console.log('[OpenVidu] Publisher published to session successfully')
          } catch (err) {
            console.error('[OpenVidu] Publisher error:', {
              error: err,
              errorName: err instanceof Error ? err.name : 'Unknown',
              errorMessage: err instanceof Error ? err.message : String(err),
              stack: err instanceof Error ? err.stack : undefined,
            })
            if (err instanceof Error && err.name === 'NotAllowedError') {
              console.log('[OpenVidu] Publisher error: NotAllowedError - Permission denied')
              setError(
                '카메라/마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.'
              )
            } else {
              console.log('[OpenVidu] Publisher error: Other error type', {
                errorType: err instanceof Error ? err.name : typeof err,
              })
              setError(err instanceof Error ? err.message : 'Publisher 초기화 실패')
            }
          }
        } else {
          console.log('[OpenVidu] User is not host, skipping publisher initialization', {
            isHost,
          })
        }
      })
      .catch(err => {
        console.error('[OpenVidu] Connect error:', {
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
    console.log('[OpenVidu] handlePlayRetry called', {
      hasVideoRef: !!videoRef.current,
      hasSrcObject: !!videoRef.current?.srcObject,
      playError,
    })

    if (videoRef.current && videoRef.current.srcObject) {
      console.log('[OpenVidu] handlePlayRetry: Conditions met, attempting to play')
      try {
        // 재시도 시에도 muted 속성 확인
        videoRef.current.muted = true
        await videoRef.current.play()
        setPlayError(false)
        console.log('[OpenVidu] Video play retry successful')
      } catch (err) {
        console.error('[OpenVidu] Video play retry failed:', {
          error: err,
          errorName: err instanceof Error ? err.name : 'Unknown',
          errorMessage: err instanceof Error ? err.message : String(err),
        })
        setPlayError(true)
      }
    } else {
      console.log('[OpenVidu] handlePlayRetry: Conditions not met', {
        hasVideoRef: !!videoRef.current,
        hasSrcObject: !!videoRef.current?.srcObject,
      })
    }
  }, [playError])

  // 비디오 클릭 시 재생 재시도
  const handleVideoClick = useCallback(() => {
    console.log('[OpenVidu] handleVideoClick called', {
      playError,
      hasVideoRef: !!videoRef.current,
    })

    if (playError && videoRef.current) {
      console.log('[OpenVidu] handleVideoClick: Calling handlePlayRetry')
      handlePlayRetry()
    } else {
      console.log('[OpenVidu] handleVideoClick: Conditions not met, skipping retry', {
        playError,
        hasVideoRef: !!videoRef.current,
      })
    }
  }, [playError, handlePlayRetry])

  console.log('[OpenVidu] Render', {
    hasError: !!error,
    error,
    playError,
    // eslint-disable-next-line react-hooks/refs
    hasVideoRef: !!videoRef.current,
    // eslint-disable-next-line react-hooks/refs
    hasSrcObject: !!videoRef.current?.srcObject,
  })

  if (error) {
    console.log('[OpenVidu] Render: Showing error message', { error })
  } else {
    console.log('[OpenVidu] Render: Showing video element', {
      playError,
      // eslint-disable-next-line react-hooks/refs
      hasVideoRef: !!videoRef.current,
    })
    if (playError) {
      console.log('[OpenVidu] Render: Showing play error overlay')
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
