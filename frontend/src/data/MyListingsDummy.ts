import { MyListing } from '@/types'

/**
 * 내 매물 더미 데이터
 */
export const mockMyListings: MyListing[] = [
  {
    id: 1,
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '101동 1203호',
    deposit: 5000,
    rent: 80,
    isAuction: false,
    buildingType: '오피스텔',
    roomCount: 1,
    connectBroker: 'pending',
  },
  {
    id: 2,
    address: '서울특별시 마포구 월드컵북로 45',
    detailAddress: '201호',
    deposit: 10000,
    rent: 0,
    isAuction: true,
    buildingType: '아파트',
    roomCount: 3,
    connectBroker: 'success',
  },
  {
    id: 3,
    address: '서울특별시 송파구 올림픽로 321',
    detailAddress: null,
    deposit: 2000,
    rent: 55,
    isAuction: false,
    buildingType: '원투룸',
    roomCount: 1,
    connectBroker: 'fail',
  },
  {
    id: 4,
    address: '경기도 성남시 분당구 정자일로 78',
    detailAddress: 'A동 1002호',
    deposit: 7000,
    rent: 50,
    isAuction: true,
    buildingType: '주택빌라',
    roomCount: 2,
    connectBroker: 'pending',
  },
  {
    id: 5,
    address: '서울특별시 용산구 한남대로 56',
    detailAddress: '102동 903호',
    deposit: 20000,
    rent: 0,
    isAuction: false,
    buildingType: '아파트',
    roomCount: 4,
    connectBroker: 'success',
  },
]
