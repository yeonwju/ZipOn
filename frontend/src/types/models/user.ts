export interface User {
  userSeq: number // 사용자 시퀀스
  email: string
  nickname: string | null
  name: string | null
  tel: string | null
  birth: string | null
  profileImg: string | null
  role: string // "USER" | "BROKER"
  isVerified: boolean | null //  인증 여부 (추후 백엔드에서 제공 예정)
  isBroker: boolean | null // Role이 "BROKER"인지 여부
}
