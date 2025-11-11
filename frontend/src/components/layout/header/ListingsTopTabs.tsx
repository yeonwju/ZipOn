'use client'

import clsx from 'clsx'

export interface Tab<T extends string = string> {
  key: T
  label: string
}

interface ListingTopTabsProps<T extends string> {
  activeTab: T
  onTabChange: (key: T) => void
  tabs: Tab<T>[]
}

export default function ListingTopTabs<T extends string>({
  activeTab,
  onTabChange,
  tabs,
}: ListingTopTabsProps<T>) {
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
