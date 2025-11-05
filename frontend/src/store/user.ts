import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { fetchCurrentUser, logout as logoutApi } from '@/services/authService'

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
  isBroker: boolean // Role이 "BROKER"인지 여부
  isVerified: boolean // 인증 여부 (추후 백엔드에서 제공 예정)
}

interface UserState {
  user: User | null
  isLoading: boolean

  // 액션
  setUser: (user: User | null) => void
  clearUser: () => void
  login: () => Promise<boolean>
  logout: () => Promise<boolean>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      /**
       * 유저 정보 설정
       */
      setUser: user => set({ user }),

      /**
       * 유저 정보 초기화
       */
      clearUser: () => set({ user: null }),

      /**
       * 로그인 (서버에서 현재 유저 정보 가져오기)
       */
      login: async () => {
        console.log('🟡 [store] login() 시작')
        set({ isLoading: true })
        try {
          const user = await fetchCurrentUser()
          console.log('🟡 [store] fetchCurrentUser 결과:', user)
          
          if (user) {
            set({ user, isLoading: false })
            console.log('✅ [store] 유저 정보 저장 완료:', user)
            return true
          } else {
            set({ user: null, isLoading: false })
            console.log('❌ [store] 유저 정보 없음')
            return false
          }
        } catch (error) {
          console.error('❌ [store] Login failed:', error)
          set({ user: null, isLoading: false })
          return false
        }
      },

      /**
       * 로그아웃
       */
      logout: async () => {
        set({ isLoading: true })
        try {
          const success = await logoutApi()
          if (success) {
            set({ user: null, isLoading: false })
            return true
          }
          set({ isLoading: false })
          return false
        } catch (error) {
          console.error('Logout failed:', error)
          set({ isLoading: false })
          return false
        }
      },
    }),
    {
      name: 'user-storage',
      // isLoading은 persist하지 않음
      partialize: state => ({ user: state.user }),
    }
  )
)
