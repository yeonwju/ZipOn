'use client'

import { useRouter } from 'next/navigation'

export default function OnboardPage() {
  const router = useRouter()
  const nextPageUrl = 'http://localhost:3000/home'
  return (
    <div>
      <button
        onClick={() =>
          router.push(`http://localhost:8080/oauth2/authorization/google?redirect=${nextPageUrl}`)
        }
      >
        Get Started
      </button>
    </div>
  )
}
