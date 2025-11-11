'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/constants/queryKeys'
import { fetchCurrentUser } from '@/services/authService'
import { User } from '@/types/models/user'

/**
 * 사용자 정보를 가져오는 Hook
 *
 * - React Query로 API 호출 및 캐싱
 * - 5분간 캐시 유지 (이후 백그라운드 재검증)
 * - 로딩, 에러 상태 자동 관리
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
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
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
 *
 *   const handleLogout = async () => {
 *     await logoutApi()
 *     invalidateUser(queryClient)
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

