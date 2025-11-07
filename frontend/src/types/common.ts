/**
 * 공통 컴포넌트에서 사용하는 데이터 타입
 */

import { JSX } from 'react'

/**
 * 경매/선택 아이템 데이터 타입
 */
export interface SelectItem {
  value: string
  title: string
}

/**
 * FAB Dial 액션 아이템 데이터 타입
 */
export interface FabAction {
  icon: JSX.Element
  name: string
  onClick?: () => void
}
