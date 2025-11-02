/**
 * Daum 우편번호 서비스 TypeScript 정의
 *
 * 카카오(다음) 우편번호 서비스를 TypeScript에서 사용하기 위한 타입 정의입니다.
 *
 * @see https://postcode.map.daum.net/guide
 */

declare global {
  interface Window {
    daum: {
      Postcode: new (options: DaumPostcodeOptions) => DaumPostcodeInstance
    }
  }

  /**
   * Daum Postcode 생성자 옵션
   */
  interface DaumPostcodeOptions {
  /**
   * 주소 선택 완료 시 호출되는 콜백
   */
  oncomplete: (data: DaumPostcodeData) => void

  /**
   * 팝업 창 크기 (width) 또는 embed 너비
   * @default 500
   */
  width?: number | string

  /**
   * 팝업 창 크기 (height) 또는 embed 높이
   * @default 600
   */
  height?: number | string

  /**
   * 테마 설정
   */
  theme?: {
    bgColor?: string // 바탕 배경색
    searchBgColor?: string // 검색창 배경색
    contentBgColor?: string // 본문 배경색
    pageBgColor?: string // 페이지 배경색
    textColor?: string // 기본 글자색
    queryTextColor?: string // 검색창 글자색
  }

  /**
   * 우편번호 찾기 화면에서 검색 결과에서 항목 클릭 시 실행되는 함수
   */
  onclose?: (state: 'FORCE_CLOSE' | 'COMPLETE_CLOSE') => void
  }

  /**
   * 주소 검색 결과 데이터
   */
  interface DaumPostcodeData {
  /**
   * 우편번호 (5자리)
   */
  zonecode: string

  /**
   * 기본 주소 (도로명 주소 또는 지번 주소)
   */
  address: string

  /**
   * 도로명 주소
   */
  roadAddress: string

  /**
   * 지번 주소
   */
  jibunAddress: string

  /**
   * 영문 주소
   */
  addressEnglish: string

  /**
   * 사용자가 선택한 주소 타입
   * - R: 도로명 주소
   * - J: 지번 주소
   */
  addressType: 'R' | 'J'

  /**
   * 도로명
   */
  roadname: string

  /**
   * 법정동/법정리 이름
   */
  bname: string

  /**
   * 건물명
   */
  buildingName: string

  /**
   * 아파트 여부 (Y/N)
   */
  apartment: 'Y' | 'N'

  /**
   * 시도
   */
  sido: string

  /**
   * 시군구
   */
  sigungu: string

  /**
   * 시군구 코드
   */
  sigunguCode: string

  /**
   * 법정동/법정리 코드
   */
  bcode: string

  /**
   * 법정동/법정리 이름
   */
  bname1: string

  /**
   * 법정동/법정리 이름 (읍면동)
   */
  bname2: string

  /**
   * 행정동 이름
   */
  hname: string

  /**
   * 지번
   */
  jibunAddress: string

  /**
   * 자동완성 주소
   */
  autoJibunAddress: string

  /**
   * 자동완성 도로명 주소
   */
  autoRoadAddress: string

  /**
   * 사용자 선택 여부 (Y/N)
   */
  userSelectedType: 'R' | 'J'

  /**
   * 도로명 코드
   */
  roadnameCode: string

  /**
   * 우편번호 일련번호
   */
  roadAddressEnglish: string

  /**
   * 지번 주소 영문
   */
  jibunAddressEnglish: string

  /**
   * 법정리 코드
   */
  query: string
  }

  /**
   * Daum Postcode 인스턴스
   */
  interface DaumPostcodeInstance {
    /**
     * 우편번호 검색 팝업 열기
     */
    open: () => void

    /**
     * 특정 요소에 우편번호 검색 UI 삽입
     */
    embed: (element: HTMLElement) => void
  }
}

export {}

