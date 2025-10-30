import type { AreaFilter, DirectionFilter, FloorFilter, RoomCountFilter } from '@/types/filter'

/**
 * 금액을 보기 좋게 포맷 (만원 단위)
 * @param amount - 만원 단위 금액
 * @returns 포맷된 문자열
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '0원'
  if (amount >= 10000) {
    const uk = Math.floor(amount / 10000)
    const man = amount % 10000
    if (man === 0) return `${uk}억원`
    return `${uk}억 ${man.toLocaleString()}만원`
  }
  return `${amount.toLocaleString()}만원`
}

/**
 * 방수 필터를 표시용 문자열로 변환
 */
export const formatRoomCount = (roomCount: RoomCountFilter): string => {
  if (roomCount === '3+') return '3개 이상'
  return `${roomCount}개`
}

/**
 * 면적 필터를 표시용 문자열로 변환
 */
export const formatArea = (area: AreaFilter): string => {
  return `${area.min}평 ~ ${area.max}평`
}

/**
 * 층수 필터를 표시용 문자열로 변환
 */
export const formatFloor = (floor: FloorFilter): string => {
  if (floor === 'B1') return '지하'
  if (floor === '2+') return '2층 이상'
  return `${floor}층`
}

/**
 * 해방향 필터를 표시용 문자열로 변환
 */
export const formatDirection = (direction: DirectionFilter): string => {
  const directionMap: Record<DirectionFilter, string> = {
    east: '동향',
    west: '서향',
    south: '남향',
    north: '북향',
    northwest: '북서향',
  }
  return directionMap[direction]
}

/**
 * 평을 제곱미터로 변환
 */
export const pyeongToSquareMeter = (pyeong: number): number => {
  return Math.round(pyeong * 3.3058)
}

/**
 * 제곱미터를 평으로 변환
 */
export const squareMeterToPyeong = (squareMeter: number): number => {
  return Math.round((squareMeter / 3.3058) * 10) / 10
}

