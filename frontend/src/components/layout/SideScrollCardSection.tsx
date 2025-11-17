import React from 'react'

interface CardSectionProps {
  title: string
  children: React.ReactNode
  cardMinWidth?: string
}

export default function SideScrollCardSection({
  title,
  children,
  cardMinWidth = '180px',
}: CardSectionProps) {
  return (
    <div>
      <div className="mx-2 flex flex-row items-center justify-between">
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm font-bold text-gray-500">모두 보기</span>
      </div>
      <div
        className="scrollbar-hide flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto scroll-smooth px-2 py-2 md:grid md:gap-6 md:overflow-visible"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${cardMinWidth}, 1fr))`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
