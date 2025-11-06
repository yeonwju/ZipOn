import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 프론트엔드에서 사용하는 User 타입
 */
export interface User {
  email: string
  nickname: string | null
  name: string | null
  tel: string | null
  birth: string | null
  profileImg: string | null
  role: string // "USER" | "BROKER"
  socialType: string | null // 소셜 로그인 타입 (추후 추가 가능)
  isBroker: boolean | null // Role이 "BROKER"인지 여부
  isVerified: boolean | null // 인증 여부 (추후 백엔드에서 제공 예정)
}

interface UserState {
  user: User | null

  // 액션
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      /**
       * 유저 정보 설정
       */
      setUser: user => set({ user }),

      /**
       * 유저 정보 초기화
       */
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      // isLoading은 persist하지 않음
      partialize: state => ({ user: state.user }),
    }
  )
)
