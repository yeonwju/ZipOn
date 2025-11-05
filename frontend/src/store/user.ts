import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  name: string | null
  nickname: string | null
  tel: string
  birth: string
  email: string
  profileImg: string
  socialType: string | null
  isBroker: boolean
  isVerified: boolean
}

interface UserState {
  user: User | null
  setUser: (user: Partial<User>) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: {
        name: '김도현',
        nickname: '김도현 닉네임',
        tel: '010-1234-5678',
        birth: '1990-01-01',
        email: 'dojin8351@gmail.com',
        profileImg: '/profile.svg',
        socialType: 'google',
        isBroker: false,
        isVerified: false,
      },

      setUser: user =>
        set(state => ({
          user: { ...state.user, ...user } as User,
        })),

      clearUser: () => set({ user: null }),
    }),
    { name: 'user-storage' }
  )
)
