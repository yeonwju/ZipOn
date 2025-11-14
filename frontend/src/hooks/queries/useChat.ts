'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { chatQueryKeys } from '@/constants'
import {
  checkChatRoomRead,
  createChatRoom,
  getChatRoomHistory,
  getChatRoomList,
  leaveChatRoom,
} from '@/services/chatService'

/**
 * 채팅방 생성 Mutation
 */
export function useCreateChatRoom() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (params: { propertySeq: number; isAucPref: boolean }) =>
      createChatRoom(params.propertySeq, params.isAucPref),

    onSuccess: data => {
      // 채팅방 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
      // 해당 채팅방으로 이동
      router.push(`/chat/${data?.data?.roomSeq}`)
    },
  })
}

/**
 * 채팅방 목록 조회 Query
 */
export function useGetChatRoomList() {
  return useQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: async () => {
      const result = await getChatRoomList()
      if (!result.success) {
        throw new Error('채팅방 목록 조회 실패')
      }
      return result.data
    },
  })
}

/**
 * 특정 채팅방 히스토리 조회 Query
 */
export function useGetChatRoomHistory(roomSeq: number) {
  return useQuery({
    queryKey: chatQueryKeys.room(roomSeq),
    queryFn: async () => {
      const result = await getChatRoomHistory(roomSeq)
      if (!result.success) {
        throw new Error('채팅방 히스토리 조회 실패')
      }
      return result.data
    },
    enabled: !!roomSeq, // roomSeq가 있을 때만 쿼리 실행
  })
}

/**
 * 채팅방 나가기 Mutation
 */
export function useLeaveChatRoom() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (roomId: number) => leaveChatRoom(roomId),

    onSuccess: (_data, roomId) => {
      // 채팅방 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
      // 해당 채팅방 캐시 삭제
      queryClient.removeQueries({
        queryKey: chatQueryKeys.room(roomId),
      })
      // 채팅방 목록으로 이동
      router.push('/chat')
    },
  })
}

/**
 * 채팅방 읽음 처리 Mutation
 */
export function useCheckChatRoomRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomSeq: number) => checkChatRoomRead(roomSeq),

    onSuccess: (_data, roomSeq) => {
      // 채팅방 목록 캐시 무효화 (읽지 않은 메시지 수 업데이트)
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
      // 해당 채팅방 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(roomSeq),
      })
    },
  })
}
