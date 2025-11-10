'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { queryKeys } from '@/constants/queryKeys'
import { fetchCurrentUser } from '@/services/authService'
import { useUserStore } from '@/store/user'
import { User } from '@/types/models/user'

/**
 * 사용자 정보를 가져오고 Zustand에 자동 동기화하는 Hook
 *
 * - ReactQuery로 API 호출 및 캐싱
 * - Zustand store에 자동 동기화
 * - 5분간 캐시 유지 (이후 백그라운드 재검증)
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const { data: user, isLoading, isError } = useUser()
 *
 *   if (isLoading) return <Loading />
 *   if (isError) return <Error />
 *
 *   return <div>안녕하세요 {user?.name}님</div>
 * }
 * ```
 */
export function useUser() {
  const { setUser } = useUserStore()

  const query = useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })

  // ReactQuery 데이터를 Zustand에 자동 동기화
  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    } else if (query.data === null && !query.isLoading) {
      // API 응답이 null이면 로그아웃 상태
      setUser(null)
    }
  }, [query.data, query.isLoading, setUser])

  return query
}

/**
 * Zustand에서 사용자 정보만 빠르게 가져오기
 *
 * - 로딩 상태가 필요 없을 때 사용
 * - 이미 캐시된 데이터만 사용
 * - API 호출 없이 즉시 반환
 *
 * @example
 * ```tsx
 * function ProfileBadge() {
 *   const user = useUserData()
 *
 *   if (!user) return null
 *
 *   return (
 *     <div>
 *       <img src={user.profileImage} />
 *       <span>{user.name}</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useUserData() {
  return useUserStore(state => state.user)
}

/**
 * 사용자 정보 캐시를 무효화하고 재요청
 *
 * 로그아웃, 프로필 수정 등의 작업 후 호출
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const queryClient = useQueryClient()
 *   const { clearUser } = useUserStore()
 *
 *   const handleLogout = async () => {
 *     await logoutApi()
 *     invalidateUser(queryClient)
 *     clearUser()
 *     router.push('/onboard')
 *   }
 *
 *   return <button onClick={handleLogout}>로그아웃</button>
 * }
 * ```
 */
export function invalidateUser(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.user.me() })
}

/**
 * 사용자 정보 캐시를 직접 업데이트
 *
 * 프로필 수정 등의 작업 후 API 재요청 없이 캐시 업데이트
 *
 * @example
 * ```tsx
 * function EditProfileForm() {
 *   const queryClient = useQueryClient()
 *
 *   const handleSubmit = async (newProfile: Partial<User>) => {
 *     await updateProfileApi(newProfile)
 *
 *     // 캐시 업데이트 (API 재요청 없이)
 *     updateUserCache(queryClient, (oldUser) => ({
 *       ...oldUser!,
 *       ...newProfile,
 *     }))
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */
export function updateUserCache(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (oldUser: User | null | undefined) => User | null
) {
  queryClient.setQueryData(queryKeys.user.me(), updater)
}

