'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BrokerApplyPage } from '@/components/features/listings/brokers/apply'
import { useAlertDialog } from '@/components/ui/alert-dialog'

interface ApplyPageProps {
  params: Promise<{ id: string }>
}

// 더미 중개인 데이터
const dummyBrokers = [
  {
    id: 1,
    name: '김중개',
    profileImage: '/profile.svg',
    dealCount: 127,
    introduction:
      '안녕하세요. 15년 경력의 중개인 김중개입니다. 고객님의 만족을 최우선으로 생각하며, 신속하고 정확한 중개 서비스를 제공하겠습니다.',
    experience: '중개 경력 15년, 강남구 전문',
    specialty: '아파트, 오피스텔 전문',
    responseTime: '평균 2시간 이내',
    rating: 4.8,
  },
  {
    id: 2,
    name: '이부동산',
    profileImage: '/profile.svg',
    dealCount: 89,
    introduction:
      '젊은 감각으로 고객님께 최적의 매물을 찾아드리는 이부동산입니다. 라이브 방송을 통해 매물의 모든 것을 투명하게 보여드립니다.',
    experience: '중개 경력 8년, 송파구 전문',
    specialty: '원룸, 투룸 전문',
    responseTime: '평균 1시간 이내',
    rating: 4.9,
  },
  {
    id: 3,
    name: '박공인',
    profileImage: '/profile.svg',
    dealCount: 203,
    introduction:
      '고객과의 신뢰를 최우선으로 하는 박공인 공인중개사입니다. 20년 이상의 경력으로 안전하고 확실한 거래를 도와드립니다.',
    experience: '중개 경력 22년, 서초구 전문',
    specialty: '주택, 빌라 전문',
    responseTime: '평균 3시간 이내',
    rating: 4.7,
  },
]

export default function ApplyPage({ params }: ApplyPageProps) {
  const router = useRouter()
  const [id, setId] = useState<string | null>(null)
  const { showSuccess, AlertDialog } = useAlertDialog()

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  if (!id) {
    return null
  }

  const handleSelect = (brokerId: number) => {
    const selectedBroker = dummyBrokers.find(b => b.id === brokerId)
    if (selectedBroker) {
      showSuccess(`${selectedBroker.name} 중개인을 선택하셨습니다!`, () => {
        // TODO: 실제 선택 API 호출
        router.replace('/mypage')
      })
    }
  }

  return (
    <>
      <BrokerApplyPage
        propertyAddress="서울시 강남구 역삼동 123-45"
        brokers={dummyBrokers}
        onSelect={handleSelect}
      />
      <AlertDialog />
    </>
  )
}
