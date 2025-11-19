'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { CompleteDetail } from '@/components/features/auction'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { useBidAmount } from '@/queries/useBid'
import { useContractPayment } from '@/queries/useContract'
import { useSearchListingDetail } from '@/queries/useListing'
import { ListingDetailDataResponse } from '@/types/api/listings'

export default function CompleteDetailContent() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  // const propertySeq = searchParams.get('propertySeq')
  // const contractSeq = searchParams.get('contractSeq')
  // const accountNumber = searchParams.get('account')
  // const { id: auctionSeq } = useParams()
  const listingDetail: ListingDetailDataResponse = {
    buildingType: 'APARTMENT',
    propertySeq: 23,
    lessorSeq: 101,
    lessorNm: '홍길동',
    lessorProfileImg: '/profile/lessor1.png',
    brkSeq: 202,
    auctionSeq: 1,
    propertyNm: '불암대림아파트 202동 1201호',
    content:
      '상계동 중심 주거지역 위치한 불암대림아파트 59㎡형 매물입니다. 채광이 좋고 내부 컨디션 양호한 집으로 즉시 입주 가능합니다.',
    address: '서울특별시 노원구 상계동 1020 불암대림아파트 202동 1201호',
    latitude: 37.674112,
    longitude: 127.080451,
    area: 59, // 59㎡ (전용면적)
    areaP: 18, // 평수
    deposit: 20000000, // 2천만 원 전세 보증금
    mnRent: 1200000, // auction1과 동일한 월세 수준
    fee: 120000, // 관리비
    images: [
      {
        s3key: 'properties/23/main.jpg',
        url: 'https://zipon-storage.s3.ap-northeast-2.amazonaws.com/properties/23/main.jpg',
        order: 1,
      },
      {
        s3key: 'properties/23/livingroom.jpg',
        url: 'https://zipon-storage.s3.ap-northeast-2.amazonaws.com/properties/23/livingroom.jpg',
        order: 2,
      },
      {
        s3key: 'properties/23/room1.jpg',
        url: 'https://zipon-storage.s3.ap-northeast-2.amazonaws.com/properties/23/room1.jpg',
        order: 3,
      },
    ],
    period: 24, // 24개월 계약
    floor: 12,
    facing: '남향',
    roomCnt: 3,
    bathroomCnt: 1,
    constructionDate: '1998-11-01',
    parkingCnt: 1,
    hasElevator: true,
    petAvailable: false,
    isAucPref: false,
    isBrkPref: true,
    hasBrk: true,
    aucAt: '2025-01-10T13:00:00',
    aucAvailable: 'AVAILABLE',
    liveAt: '2025-01-10T20:00:00',
    pdfCode: 'PDF-33291',
    isCertificated: true,
    riskScore: 12, // 낮은 점수 = 안전
    riskReason: '확정일자가 필요한 전세 계약이며 등기부등본상 근저당 비율이 낮습니다.',
    isLiveDone: false,
  }
  const { showSuccess, showError, AlertDialog } = useAlertDialog()
  // const { data: bidAmount } = useBidAmount(Number(auctionSeq))
  // const { isSuccess } = useContractPayment(Number(contractSeq))
  //
  // const { data: paymentData } = useSearchListingDetail(Number(propertySeq))
  //
  // const handleConfirm = () => {
  //   if (isSuccess) {
  //     showSuccess('입금이 완료되었습니다.')
  //     router.push('/mypage')
  //   } else {
  //     showError('입금이 실패하였습니다.')
  //   }
  // }

  return (
    <>
      {/*{bidAmount && accountNumber && paymentData ? (*/}
      <CompleteDetail
        data={listingDetail}
        bidAmount={1200000}
        accountNumber={'536202-01-452082'}
        accountHolder="(주)집온"
        // onConfirm={handleConfirm}
      />
      {/*) : (*/}
      {/*  <div className="flex flex-col items-center justify-center bg-white px-5 py-16">*/}
      {/*    <div className="rounded-3xl border border-gray-200 bg-white px-8 py-12 shadow-sm">*/}
      {/*      <div className="flex flex-col items-center gap-4">*/}
      {/*        /!* 아이콘 영역 *!/*/}
      {/*        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">*/}
      {/*          <svg*/}
      {/*            className="h-10 w-10 text-gray-400"*/}
      {/*            fill="none"*/}
      {/*            viewBox="0 0 24 24"*/}
      {/*            stroke="currentColor"*/}
      {/*            strokeWidth={1.5}*/}
      {/*          >*/}
      {/*            <path*/}
      {/*              strokeLinecap="round"*/}
      {/*              strokeLinejoin="round"*/}
      {/*              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"*/}
      {/*            />*/}
      {/*          </svg>*/}
      {/*        </div>*/}

      {/*        /!* 메시지 영역 *!/*/}
      {/*        <div className="flex flex-col items-center gap-2 text-center">*/}
      {/*          <h3 className="text-lg font-semibold text-gray-900">*/}
      {/*            결제 완료 정보를 불러올 수 없습니다*/}
      {/*          </h3>*/}
      {/*          <p className="max-w-sm text-sm text-gray-500">*/}
      {/*            입찰 정보 또는 계좌 정보를 찾을 수 없습니다.*/}
      {/*            <br />*/}
      {/*            다시 시도해주세요.*/}
      {/*          </p>*/}
      {/*        </div>*/}

      {/*        /!* 액션 버튼 *!/*/}
      {/*        <button*/}
      {/*          onClick={() => router.back()}*/}
      {/*          className="mt-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"*/}
      {/*        >*/}
      {/*          이전 페이지로*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      <AlertDialog />
    </>
  )
}
