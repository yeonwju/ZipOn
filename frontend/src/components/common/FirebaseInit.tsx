'use client'

import { useEffect } from 'react'

import { requestFCMToken } from '@/lib/firebase'

export default function FirebaseInit() {
  useEffect(() => {
    requestFCMToken()
  }, [])

  return null
}
