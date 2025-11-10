import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { User } from '@/types/models/user'

// 💡 테스트용: 기본값 변경 가능
const DEFAULT_IS_BROKER = true
const DEFAULT_IS_VERIFIED = true

interface UserState {
  user: User | null

  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      /**
       * 유저 정보 설정
       * - isBroker, isVerified가 null/undefined면 기본값 적용
       * - 💡 테스트용: 강제로 기본값 적용하려면 아래 주석 해제
       */
      setUser: (user: User | null) => {
        if (!user) {
          set({ user: null })
          return
        }

        const normalizedUser: User = {
          ...user,
          // 💡 테스트용: 강제로 기본값 적용 (백엔드 값 무시)
          isBroker: DEFAULT_IS_BROKER,
          isVerified: DEFAULT_IS_VERIFIED,

          // 일반: null/undefined일 때만 기본값 적용
          // isBroker: user.isBroker ?? DEFAULT_IS_BROKER,
          // isVerified: user.isVerified ?? DEFAULT_IS_VERIFIED,
        }

        set({ user: normalizedUser })
      },

      /**
       * 유저 정보 초기화
       */
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state: UserState) => ({ user: state.user }),
    }
  )
)
