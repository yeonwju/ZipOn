import type { AreaFilter, DirectionFilter, FloorFilter, RoomCountFilter } from '@/types/filter'

/**
 * 금액을 보기 좋게 포맷 (원 단위 입력)
 * @param amount - 원 단위 금액
 * @returns 포맷된 문자열
 * - 1억 이상: "1.2억" 형식
 * - 1억 미만: "5000만원", "120만원", "70만원" 형식
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '0원'
  
  // 1억 이상인 경우
  if (amount >= 100000000) {
    const eok = amount / 100000000
    // 소수점이 없으면 정수로, 있으면 소수점 첫째자리까지
    return `${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억`
  }
  
  // 1억 미만인 경우 (만원 단위)
  const man = amount / 10000
  return `${man.toLocaleString()}만원`
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
    all: '전체',
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

/**
 * 이미지 URL을 절대 URL로 변환
 * 상대 경로인 경우 S3 URL로 변환
 * @param imageUrl - 이미지 URL (상대 경로 또는 절대 URL)
 * @returns 절대 URL
 */
export const normalizeImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl || imageUrl.trim() === '') return '/default-profile.svg'
  
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // 상대 경로인 경우 (/, /default-profile.svg 같은 경우는 그대로 반환)
  if (imageUrl.startsWith('/')) {
    return imageUrl
  }
  
  // 상대 경로인 경우 (dev/uploads/... 같은 경우) S3 URL로 변환
  // S3 버킷 URL: https://zipon-media.s3.ap-northeast-2.amazonaws.com/
  const S3_BASE_URL = 'https://zipon-media.s3.ap-northeast-2.amazonaws.com'
  return `${S3_BASE_URL}/${imageUrl}`
}

/**
 * 썸네일 이미지 URL을 절대 URL로 변환 (썸네일 전용)
 * @param imageUrl - 이미지 URL (상대 경로 또는 절대 URL)
 * @param fallback - fallback 이미지 경로 (기본값: '/listing.svg')
 * @returns 절대 URL
 */
export const normalizeThumbnailUrl = (
  imageUrl: string | null | undefined,
  fallback: string = '/listing.svg'
): string => {
  if (!imageUrl || imageUrl.trim() === '') return fallback
  
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // 상대 경로인 경우 (/, /listing.svg 같은 경우는 그대로 반환)
  if (imageUrl.startsWith('/')) {
    return imageUrl
  }
  
  // 상대 경로인 경우 (dev/uploads/... 같은 경우) S3 URL로 변환
  const S3_BASE_URL = 'https://zipon-media.s3.ap-northeast-2.amazonaws.com'
  return `${S3_BASE_URL}/${imageUrl}`
}
