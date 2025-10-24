import React from 'react'

interface CardSectionProps {
  title: string
  children: React.ReactNode
}

export default function CardSection({ title, children }: CardSectionProps) {
  return (
    <div>
      <div className="mx-2 flex flex-row items-center justify-between">
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm font-bold text-gray-500">모두 보기</span>
      </div>
      {children}
    </div>
  )
}
