import { create } from 'zustand'

interface MiniPlayerState {
  isActive: boolean
  stream: MediaStream | null
  position: { x: number; y: number }
  
  activateMiniPlayer: (stream: MediaStream) => void
  deactivateMiniPlayer: () => void
  updatePosition: (x: number, y: number) => void
}

export const useMiniPlayerStore = create<MiniPlayerState>((set, get) => ({
  isActive: false,
  stream: null,
  position: { x: 20, y: 80 }, // 초기 위치 (우측 상단)
  
  activateMiniPlayer: (stream: MediaStream) => {
    set({ isActive: true, stream })
  },
  
  deactivateMiniPlayer: () => {
    const { stream } = get()
    // 스트림 정리
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    set({ isActive: false, stream: null })
  },
  
  updatePosition: (x: number, y: number) => {
    set({ position: { x, y } })
  },
}))

