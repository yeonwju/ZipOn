'use client'

import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import { useUserStore } from '@/store/user'
import Link from 'next/link'

export default function AuthOptionGroup() {
  //  hook 사용 - store 변경 시 자동 리렌더링
  const user = useUserStore(state => state.user)

  const isBrokerAuthEnabled = user?.isBroker && user?.isVerified
  const isPhoneAuthEnabled = user?.isVerified

  return (
    <div className="mt-1 flex flex-row justify-center gap-1">
      <div className={'flex flex-row gap-1'}>
        {isBrokerAuthEnabled ? (
          <button
            className={
              'inline-flex items-center gap-1 rounded-full border border-green-400 bg-green-300 px-2 py-1'
            }
            disabled
          >
            <VerifiedUserIcon fontSize={'inherit'} className={'text-white'} />
            <span className={'text-xs font-medium text-white'}>중개인 인증</span>
          </button>
        ) : (
          <Link
            href={'/verify/business'}
            className={
              'inline-flex cursor-pointer items-center gap-1 rounded-full border border-red-400 bg-red-300 px-2 py-1'
            }
          >
            <PrivacyTipIcon fontSize={'inherit'} className="text-white" />
            <span className={'text-xs font-medium text-white'}>중개인 인증</span>
          </Link>
        )}

        {isPhoneAuthEnabled ? (
          <button
            className={
              'inline-flex items-center gap-1 rounded-full border border-green-400 bg-green-300 px-2 py-1'
            }
            disabled
          >
            <VerifiedUserIcon fontSize={'inherit'} className={'text-white'} />
            <span className={'text-xs font-medium text-white'}>휴대폰 인증</span>
          </button>
        ) : (
          <Link
            href={'/verify/phone'}
            className={
              'inline-flex cursor-pointer items-center gap-1 rounded-full border border-red-400 bg-red-300 px-2 py-1'
            }
          >
            <PrivacyTipIcon fontSize={'inherit'} className="text-white" />
            <span className={'text-xs font-medium text-white'}>휴대폰 인증</span>
          </Link>
        )}
      </div>
    </div>
  )
}
