import { MyListing } from '@/types'

/**
 * 내 매물 더미 데이터
 */
export const mockMyListings: MyListing[] = [
  {
    propertySeq: 1,
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '101동 1203호',
    deposit: 5000,
    mnRent: 80,
    isAucPref: false,
    buildingType: 'OFFICETEL',
    roomCnt: 1,
    connectBroker: 'pending',
  },
  {
    propertySeq: 2,
    address: '서울특별시 마포구 월드컵북로 45',
    detailAddress: '201호',
    deposit: 10000,
    mnRent: 0,
    isAucPref: true,
    buildingType: 'APARTMENT',
    roomCnt: 3,
    connectBroker: 'success',
  },
  {
    propertySeq: 3,
    address: '서울특별시 송파구 올림픽로 321',
    detailAddress: null,
    deposit: 2000,
    mnRent: 55,
    isAucPref: false,
    buildingType: 'ROOM',
    roomCnt: 1,
    connectBroker: 'fail',
  },
  {
    propertySeq: 4,
    address: '경기도 성남시 분당구 정자일로 78',
    detailAddress: 'A동 1002호',
    deposit: 7000,
    mnRent: 50,
    isAucPref: true,
    buildingType: 'HOUSE',
    roomCnt: 2,
    connectBroker: 'pending',
  },
  {
    propertySeq: 5,
    address: '서울특별시 용산구 한남대로 56',
    detailAddress: '102동 903호',
    deposit: 20000,
    mnRent: 0,
    isAucPref: false,
    buildingType: 'APARTMENT',
    roomCnt: 4,
    connectBroker: 'success',
  },
]
