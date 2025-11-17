'use client'

import { useMutation } from '@tanstack/react-query'

import {
  contractAiVerify,
  contractPayment,
  contractProxyAccount,
  contractSuccess,
} from '@/services/contractService'

/**
 * 계약 성사
 */
export function useContractSuccess() {
  return useMutation({
    mutationFn: (contractSeq: number) => contractSuccess(contractSeq),
  })
}

/**
 * 첫달 월세 납부
 */
export function useContractPayment() {
  return useMutation({
    mutationFn: (contractSeq: number) => contractPayment(contractSeq),
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
    mutationFn: () => contractAiVerify(),
  })
}
