import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/models/user'

/**
 * 프론트엔드에서 사용하는 User 타입
 */

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
