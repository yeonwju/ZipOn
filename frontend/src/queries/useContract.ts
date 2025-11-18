'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  contractAiVerify,
  contractPayment,
  contractProxyAccount,
  contractSuccess,
} from '@/services/contractService'

/**
 * 계약 성사
 */
export function useContractSuccess(contractSeq: number) {
  return useMutation({
    mutationFn: () => contractSuccess(contractSeq),
  })
}

/**
 * 첫달 월세 납부
 */
export function useContractPayment(contractSeq: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => contractPayment(contractSeq),
    onSuccess: () => {
      // 필요시 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['mypage'] })
    },
  })
}

/**
 * 가상 계좌 생성
 */
export function useContractProxyAccount() {
  return useMutation({
    mutationFn: (contractSeq: number) => contractProxyAccount(contractSeq),
  })
}

/**
 * 계약 AI 검증
 */
export function useContractAiVerify() {
  return useMutation({
    mutationFn: (file: File) => contractAiVerify(file),
  })
}
