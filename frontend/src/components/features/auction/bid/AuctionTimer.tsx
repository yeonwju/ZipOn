'use client'

import { useEffect, useState } from 'react'

interface AuctionTimerProps {
  endTime: Date
}

export default function AuctionTimer({ endTime }: AuctionTimerProps) {
  const [remainingTime, setRemainingTime] = useState('')

  const calculateRemainingTime = () => {
    const now = new Date()
    const diffMs = endTime.getTime() - now.getTime()

    if (diffMs <= 0) return '경매가 종료되었습니다.'

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60)

    if (diffDays > 0) return `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 남음`
    if (diffHours > 0) return `${diffHours}시간 ${diffMinutes}분 남음`
    return `${diffMinutes}분 남음`
  }

  useEffect(() => {
    const update = () => setRemainingTime(calculateRemainingTime())
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="text-right">
      <span className="block text-xs text-gray-400">경매 종료까지</span>
      <span className="text-sm font-semibold text-blue-600">{remainingTime}</span>
    </div>
  )
}

