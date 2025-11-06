export interface User {
  email: string
  nickname: string | null
  name: string | null
  tel: string | null
  birth: string | null
  profileImg: string | null
  role: string // "USER" | "BROKER"
  socialType: string | null // 소셜 로그인 타입 (추후 추가 가능)
  isBroker: boolean | null // Role이 "BROKER"인지 여부
  isVerified: boolean | null // 인증 여부 (추후 백엔드에서 제공 예정)
}
