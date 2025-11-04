'use client'

import {useRouter} from "next/navigation";

export default function OnboardPage() {
  const router = useRouter()
  return (
    <div>
      <button onClick={() => router.push('http://localhost:8080/oauth2/authorization/google?redirect=내가 접속하려했던 uil')}>Get Started</button>
    </div>
  )
}
