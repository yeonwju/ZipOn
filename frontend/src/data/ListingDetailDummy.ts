import type { ListingDetailData } from '@/types/models/listing'

import { BuildingData } from './BuildingDummy'

/**
 * 매물 상세 더미 데이터 생성 함수
 * propertySeq를 받아서 해당 매물의 상세 정보를 생성합니다
 * BuildingData와 완전히 동기화되어 있습니다
 */
export function generateListingDetail(seq: number): ListingDetailData {
  const lessorNames = ['김철수', '이영희', '박민수', '최지영', '정동훈', '강서연', '윤지호', '한미래', '송준호', '임수정']
  
  const descriptions = [
    '역세권에 위치한 깔끔한 매물입니다. 채광이 우수하고 교통이 편리합니다.',
    '최근 리모델링을 완료한 깨끗한 매물입니다. 관리가 잘 되어 있습니다.',
    '넓은 공간과 좋은 시설을 갖춘 매물입니다. 주차 가능합니다.',
    '신축 건물의 프리미엄 매물입니다. 각종 편의시설이 근처에 있습니다.',
    '조용하고 쾌적한 주거환경의 매물입니다. 학교와 마트가 가깝습니다.'
  ]
  
  // BuildingData에서 기본 정보 가져오기 (완전 동기화)
  const listingData = BuildingData.find(item => item.propertySeq === seq)
  
  if (!listingData) {
    throw new Error(`매물 seq ${seq}를 찾을 수 없습니다`)
  }
  
  const lessorNm = lessorNames[(seq - 1) % 10]
  const buildingType = listingData.buildingType || 'ROOM'
  const facing = listingData.facing || 'N'
  
  return {
    propertySeq: seq,
    lessorNm,
    propertyNm: listingData.propertyNm,
    content: descriptions[(seq - 1) % 5],
    address: listingData.address,
    latitude: listingData.latitude,
    longitude: listingData.longitude,
    buildingType,
    area: listingData.area,
    areaP: listingData.areaP,
    deposit: listingData.deposit,
    mnRent: listingData.mnRent,
    fee: listingData.fee,
    images: [
      '/listing.svg',
      '/listing.svg',
      '/listing.svg',
      '/listing.svg',
    ],
    period: seq % 2 === 0 ? '12개월' : '24개월',
    floor: listingData.floor || '1',
    facing,
    roomCnt: listingData.roomCnt || '1',
    bathroomCnt: buildingType === 'ROOM' ? '1' : '2',
    constructionDate: `${2010 + (seq % 15)}년 ${(seq % 12) + 1}월`,
    parkingCnt: buildingType === 'APARTMENT' || buildingType === 'OFFICETEL' ? '1' : '0',
    hasElevator: buildingType === 'APARTMENT' || buildingType === 'OFFICETEL',
    petAvailable: seq % 3 === 0,
    isAucPref: listingData.isAucPref || false,
    isBrkPref: seq % 7 === 0,
    isLinked: seq % 4 === 0,
    aucAt: listingData.isAucPref ? `${2025}-${((seq % 12) + 1).toString().padStart(2, '0')}-15 14:00:00` : '',
    aucAvailable: listingData.isAucPref ? '진행중' : '',
  }
}

/**
 * 모든 매물 상세 데이터 (100개)
 */
export const listingDetailDummyData: ListingDetailData[] = Array.from(
  { length: 100 },
  (_, i) => generateListingDetail(i + 1)
)

/**
 * 특정 propertySeq의 매물 상세 정보 가져오기
 */
export function getListingDetailBySeq(seq: number): ListingDetailData | null {
  if (seq < 1 || seq > 100) {
    return null
  }
  return generateListingDetail(seq)
}

