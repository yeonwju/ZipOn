import { useCallback } from 'react'

export type SheetState = 'collapsed' | 'expanded'

interface UseBottomSheetHeightParams {
  listingCount: number
  sheetState: SheetState
  isDragging: boolean
  dragY: number
  fixedHeight?: number // 고정 높이 (px) - 지정하면 listingCount 무시
}

/**
 * 바텀 시트의 높이를 계산하는 훅
 *
 * 매물 개수, 시트 상태, 드래그 여부에 따라 적절한 높이를 계산합니다.
 *
 * @param params - 높이 계산에 필요한 파라미터
 * @param params.listingCount - 매물 개수 (1개=230px, 2개=55vh, 3개+=55vh)
 * @param params.sheetState - 시트 상태 (collapsed | expanded)
 * @param params.isDragging - 드래그 중 여부
 * @param params.dragY - 드래그 이동 거리 (deltaY)
 * @param params.fixedHeight - 고정 높이 (px, 옵션)
 * @returns 계산된 높이 문자열 (px 단위)
 *
 * @example
 * ```tsx
 * const getSheetHeight = useBottomSheetHeight({
 *   listingCount: 3,
 *   sheetState,
 *   isDragging,
 *   dragY,
 *   fixedHeight: 480
 * })
 * ```
 */
export default function useBottomSheetHeight({
  listingCount,
  sheetState,
  isDragging,
  dragY,
  fixedHeight,
}: UseBottomSheetHeightParams) {
  // 매물 개수에 따른 collapsed 높이 계산
  const getCollapsedHeight = useCallback(() => {
    // fixedHeight가 지정되면 그 값 사용
    if (fixedHeight !== undefined) {
      return fixedHeight
    }

    const vh = window.innerHeight

    if (listingCount === 1) {
      // 1개: 고정 230px (카드 높이 + 헤더 + 패딩 + 드래그바)
      return 199
    } else if (listingCount === 2) {
      // 2개: 55vh
      return vh * 0.497
    } else {
      // 3개 이상: 55vh
      return vh * 0.55
    }
  }, [listingCount, fixedHeight])

  // 높이 계산 (드래그 중에는 실시간 조정)
  const getSheetHeight = useCallback(() => {
    const collapsedHeight = getCollapsedHeight()
    const expandedHeight = window.innerHeight - 81.5 // calc(100vh - 80px)

    if (isDragging) {
      // 드래그 중: 현재 상태의 높이에서 deltaY만큼 조정
      const baseHeight = sheetState === 'expanded' ? expandedHeight : collapsedHeight
      const adjustedHeight = baseHeight - dragY // 아래로 드래그하면 높이 감소

      // 최소/최대 높이 제한
      const minHeight = 200 // 최소 높이
      const maxHeight = expandedHeight
      return `${Math.max(minHeight, Math.min(maxHeight, adjustedHeight))}px`
    }

    // 드래그 중이 아닐 때: 상태에 따른 고정 높이
    if (sheetState === 'expanded') {
      return `${expandedHeight}px`
    }
    return `${collapsedHeight}px`
  }, [getCollapsedHeight, isDragging, dragY, sheetState])

  return getSheetHeight
}
