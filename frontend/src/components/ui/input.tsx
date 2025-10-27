// components/ui/input.tsx
import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* 왼쪽 아이콘 */}
        {leftIcon && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">{leftIcon}</span>
        )}

        {/* 실제 input */}
        <input
          ref={ref}
          type={type}
          className={cn(
            // 기본 스타일
            'border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-all outline-none',
            // 포커스 스타일
            'focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px]',
            // 아이콘 위치에 따른 padding 조정
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            // 비활성화, 에러 등 상태
            'aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />

        {/* 오른쪽 아이콘 */}
        {rightIcon && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
