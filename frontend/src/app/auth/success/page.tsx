'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useUserStore } from '@/store/user'

/**
 * 소셜 로그인 성공 후 리다이렉트 페이지
 * 
 * 1. 서버에서 유저 정보를 가져옴
 * 2. zustand store에 저장
 * 3. 원래 가려던 페이지로 리다이렉트
 */
export default function AuthSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/home'
  const login = useUserStore(state => state.login)
  const [error, setError] = useState(false)

  useEffect(() => {
    const handleLogin = async () => {
      const success = await login()
      
      if (success) {
        // 로그인 성공 - 원래 페이지로 이동
        router.replace(redirect)
      } else {
        // 로그인 실패
        setError(true)
        setTimeout(() => {
          router.replace('/onboard')
        }, 2000)
      }
    }

    handleLogin()
  }, [login, redirect, router])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">로그인에 실패했습니다.</p>
          <p className="mt-2 text-sm text-gray-500">로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        <p className="text-lg text-gray-700">로그인 중...</p>
      </div>
    </div>
  )
}
