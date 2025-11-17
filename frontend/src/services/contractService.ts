import { API_ENDPOINTS } from '@/constants'
import { authFetch } from '@/lib/fetch'

export async function contractSuccess(contractSeq: number) {
  return authFetch.post(API_ENDPOINTS.CONTRACT_SUCCESS(contractSeq))
}

export async function contractPayment(contractSeq: number) {
  return authFetch.post(API_ENDPOINTS.CONTRACT_PAYMENT(contractSeq))
}

export async function contractProxyAccount(contractSeq: number) {
  return authFetch.post(API_ENDPOINTS.CONTRACT_PROXY_ACCOUNT(contractSeq))
}

export async function contractAiVerify() {
  return authFetch.post(API_ENDPOINTS.CONTRACT_AI_VERIFY)
}
