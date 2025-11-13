/**
 * 매물 상세 페이지 버튼 로직
 *
 * 모든 경우의 수에 따른 버튼 구성을 결정하는 유틸리티
 */

// 버튼 설정 타입
export interface ButtonConfig {
  primary: {
    text: string
    action: () => void
  }
  secondary?: {
    text: string
    action: () => void
  }
  delete?: {
    text: string
    action: () => void
  }
}

/**
 * liveAt 시간이 지났는지 체크
 */
export function isLiveTimePassed(liveAt: string | undefined): boolean {
  if (!liveAt) return false
  return new Date(liveAt) < new Date()
}

/**
 * 버튼 설정 결정 로직 (모든 경우의 수)
 *
 * @param isAucPref 경매 선호 여부
 * @param isBrkPref 중개 선호 여부
 * @param hasBrk 중개인 배정 여부
 * @param lessorSeq 집주인(매물 등록자) Seq
 * @param brkSeq 중개인 Seq
 * @param currentUserSeq 현재 로그인한 사용자 Seq
 * @param propertySeq 매물 Seq
 * @returns 버튼 설정 객체 또는 null (버튼 표시 안 함)
 */
export function getListingButtonConfig(
  isAucPref: boolean,
  isBrkPref: boolean,
  hasBrk: boolean,
  lessorSeq: number | undefined,
  brkSeq: number | undefined,
  currentUserSeq: number | undefined,
  auctionSeq: number | undefined,
  propertySeq: number | undefined
): ButtonConfig | null {
  const isOwner = lessorSeq === currentUserSeq
  const isBroker = brkSeq === currentUserSeq

  // ========== 경매 O, 중개 O, 중개인 배정 O ==========
  if (isAucPref && isBrkPref && hasBrk) {
    if (isBroker) {
      // brk 일치: 라이브 시작, 매물 수정, 매물 삭제
      return {
        primary: {
          text: '라이브 시작',
          action: () => {
            window.location.href = `/live/create?auctionSeq=${auctionSeq}`
          },
        },
        secondary: {
          text: '매물 수정',
          action: () => {
            window.location.href = `/listings/edit/${propertySeq}`
          },
        },
        delete: {
          text: '매물 삭제',
          action: () => {
            if (confirm('정말 삭제하시겠습니까?')) {
              console.log('매물 삭제:', propertySeq)
              // TODO: 삭제 API 호출
            }
          },
        },
      }
    } else {
      // brk 불일치: 라이브 알림 신청
      return {
        primary: {
          text: '라이브 알림 신청',
          action: () => console.log('라이브 알림 신청'),
        },
      }
    }
  }

  // ========== 경매 O, 중개 O, 중개인 배정 X ==========
  if (isAucPref && isBrkPref && !hasBrk) {
    if (isOwner) {
      // user 일치: 중개인 신청 현황, 매물 수정, 매물 삭제
      return {
        primary: {
          text: '중개인 신청 현황',
          action: () => (window.location.href = `/listings/${propertySeq}/brokers/apply`),
        },
        secondary: {
          text: '매물 수정',
          action: () => console.log('매물 수정'),
        },
        delete: {
          text: '매물 삭제',
          action: () => console.log('매물 삭제'),
        },
      }
    } else {
      // user 불일치: 중개 신청
      return {
        primary: {
          text: '중개 신청',
          action: () => (window.location.href = `/listings/${propertySeq}/brokers`),
        },
      }
    }
  }

  // ========== 경매 O, 중개 X ==========
  if (isAucPref && !isBrkPref) {
    if (isOwner) {
      // user 일치: 라이브 시작, 매물 수정, 매물 삭제
      return {
        primary: {
          text: '라이브 시작',
          action: () => console.log('라이브 시작'),
        },
        secondary: {
          text: '매물 수정',
          action: () => console.log('매물 수정'),
        },
        delete: {
          text: '매물 삭제',
          action: () => console.log('매물 삭제'),
        },
      }
    } else {
      // user 불일치: 라이브 알림 신청
      return {
        primary: {
          text: '라이브 알림 신청',
          action: () => console.log('라이브 알림 신청'),
        },
      }
    }
  }

  // ========== 경매 X, 중개 O, 중개인 배정 O ==========
  if (!isAucPref && isBrkPref && hasBrk) {
    if (isBroker) {
      // brk 일치: 매물 수정, 매물 삭제
      return {
        primary: {
          text: '매물 수정',
          action: () => console.log('매물 수정'),
        },
        delete: {
          text: '매물 삭제',
          action: () => console.log('매물 삭제'),
        },
      }
    } else {
      // brk 불일치: 중개인 1대1 대화
      return {
        primary: {
          text: '중개인 1대1 대화',
          action: () => console.log('중개인 1대1 대화'),
        },
      }
    }
  }

  // ========== 경매 X, 중개 O, 중개인 배정 X ==========
  if (!isAucPref && isBrkPref && !hasBrk) {
    if (isOwner) {
      // user 일치: 중개인 신청 현황, 매물 수정, 매물 삭제
      return {
        primary: {
          text: '중개인 신청 현황',
          action: () => console.log('중개인 신청 현황'),
        },
        secondary: {
          text: '매물 수정',
          action: () => console.log('매물 수정'),
        },
        delete: {
          text: '매물 삭제',
          action: () => console.log('매물 삭제'),
        },
      }
    } else {
      // user 불일치: 중개 신청
      return {
        primary: {
          text: '중개 신청',
          action: () => console.log('중개 신청'),
        },
      }
    }
  }

  // ========== 경매 X, 중개 X ==========
  if (isOwner) {
    // user 일치: 매물 수정, 매물 삭제
    return {
      primary: {
        text: '매물 수정',
        action: () => console.log('매물 수정'),
      },
      delete: {
        text: '매물 삭제',
        action: () => console.log('매물 삭제'),
      },
    }
  } else {
    // user 불일치: 집주인 1대1 대화
    return {
      primary: {
        text: '집주인 1대1 대화',
        action: () => console.log('집주인 1대1 대화'),
      },
    }
  }
}
