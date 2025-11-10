import { useEffect, useRef, useState } from 'react'

interface LiveBroadcastProps {
  onStreamReady?: (stream: MediaStream) => void
}

export default function LiveBroadcast({ onStreamReady }: LiveBroadcastProps = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const onStreamReadyRef = useRef(onStreamReady)
  const [error, setError] = useState<string | null>(() => {
    // 초기 상태에서 브라우저 지원 확인
    if (
      typeof window !== 'undefined' &&
      (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    ) {
      return '이 브라우저는 카메라를 지원하지 않습니다.'
    }
    return null
  })

  // onStreamReady 콜백을 ref로 관리
  useEffect(() => {
    onStreamReadyRef.current = onStreamReady
  }, [onStreamReady])

  useEffect(() => {
    // 이미 에러가 있으면 실행하지 않음
    if (error) return

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        // 스트림이 준비되면 콜백 호출
        if (onStreamReadyRef.current) {
          onStreamReadyRef.current(stream)
        }
      })
      .catch(err => {
        console.error('카메라 접근 실패', err)
        setError('카메라 접근 실패 : ' + err.message)
      })

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks()
        tracks.forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-screen w-screen border border-gray-300 bg-black object-cover"
        />
      )}
    </div>
  )
}
