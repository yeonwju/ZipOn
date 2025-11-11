/**
 * @deprecated 이 파일은 더 이상 사용되지 않습니다.
 * 
 * 사용자 정보는 React Query로 관리됩니다.
 * 대신 @/hooks/queries/useUser Hook을 사용하세요.
 * 
 * @example
 * ```tsx
 * // ❌ 기존 방식 (사용 금지)
 * import { useUserStore } from '@/store/user'
 * const user = useUserStore(state => state.user)
 * 
 * // ✅ 새로운 방식
 * import { useUser } from '@/hooks/queries/useUser'
 * const { data: user } = useUser()
 * ```
 * 
 * 이 파일은 향후 버전에서 삭제될 예정입니다.
 */

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

/** @deprecated React Query의 useUser Hook을 사용하세요 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      /**
       * @deprecated 더 이상 사용되지 않습니다
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
       * @deprecated 더 이상 사용되지 않습니다
       */
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state: UserState) => ({ user: state.user }),
    }
  )
)
