'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { chatQueryKeys } from '@/constants'
import {
  createChatRoom,
  getChatRoomHistory,
  getChatRoomList,
  leaveChatRoom,
  messageRead,
} from '@/services/chatService'

/**
 * 채팅방 생성 Mutation
 */
export function useCreateChatRoom() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (params: { propertySeq: number; isBrkPref: boolean }) =>
      createChatRoom(params.propertySeq, params.isBrkPref),
    onSuccess: result => {
      // 채팅방 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
      // 해당 채팅방으로 이동
      if (result.data?.roomSeq) {
        router.push(`/chat/${result.data.roomSeq}`)
      }
    },
    onError: error => {
      console.error('채팅방 생성 실패:', error)
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
      if (!result.data) {
        throw new Error('채팅방 목록을 찾을 수 없습니다.')
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
      if (!result.data) {
        throw new Error('채팅방 히스토리를 찾을 수 없습니다.')
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
    onSuccess: (_result, roomId) => {
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
    onError: error => {
      console.error('채팅방 나가기 실패:', error)
    },
  })
}

/**
 * 채팅 읽음 처리 Mutation
 */
export function useReadChat(roomSeq: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => messageRead(roomSeq),
    onSuccess: () => {
      // 채팅방 목록 캐시 무효화하여 읽음 처리 반영
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      })
    },
    onError: error => {
      console.error('채팅 읽음 처리 실패:', error)
    },
  })
}
