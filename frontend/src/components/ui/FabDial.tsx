'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { FabAction } from '@/types/common'

interface FabDialProps {
  actions: FabAction[]
}

export default function FabDial({ actions }: FabDialProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-3 bottom-17 z-50 flex flex-col items-end space-y-3">
      {/* 확장된 버튼 목록 */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'
        }`}
      >
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.15)] transition hover:bg-gray-50 active:scale-95"
          >
            <span className="text-gray-600">{action.icon}</span>
            <span className="text-sm font-medium text-gray-800">{action.name}</span>
          </button>
        ))}
      </div>

      {/* 메인 플로팅 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_6px_15px_rgba(59,130,246,0.4)] transition-transform duration-300 hover:bg-blue-600 active:scale-95 ${open ? 'rotate-45' : ''}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
