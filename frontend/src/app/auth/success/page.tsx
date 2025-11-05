'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useUserStore } from '@/store/user'

export default function AuthSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/'

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/v1/users/me', { credentials: 'include' })
      if (res.ok) {
        const user = await res.json()
        useUserStore.setState({ user })
        router.replace(redirect)
      } else {
        router.replace('/login')
      }
    }
    fetchUser()
  }, [])

  return <p>로그인 중...</p>
}
