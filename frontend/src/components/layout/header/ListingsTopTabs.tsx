'use client'

import clsx from 'clsx'

interface ListingTopTabsProps {
  activeTab: 'auction' | 'general' | 'broker'
  onTabChange: (key: 'auction' | 'general' | 'broker') => void
}

export default function ListingTopTabs({ activeTab, onTabChange }: ListingTopTabsProps) {
  type TabKey = 'auction' | 'general' | 'broker'

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'auction', label: '경매' },
    { key: 'general', label: '일반 매물' },
    { key: 'broker', label: '중개' },
  ]

  return (
    <nav
      className={clsx(
        'sticky top-0 z-40 flex w-full justify-around border-b border-gray-200 bg-white/80 backdrop-blur-md'
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={clsx(
            'relative flex-1 py-3 text-sm font-medium transition-all duration-200',
            activeTab === tab.key ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
          )}
        >
          {tab.label}
          <span
            className={clsx(
              'absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-blue-500 transition-all duration-300',
              activeTab === tab.key && 'w-full'
            )}
          />
        </button>
      ))}
    </nav>
  )
}
