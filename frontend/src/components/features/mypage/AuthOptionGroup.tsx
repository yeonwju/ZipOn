'use client'

import { ShieldAlert, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { useUser } from '@/hooks/queries/useUser'

export default function AuthOptionGroup() {
  const { data: user } = useUser()

  const isBrokerAuthEnabled = user?.isBroker && user?.isVerified
  const isPhoneAuthEnabled = user?.isVerified

  return (
    <div className="mt-1 flex flex-row justify-center gap-1">
      <div className="flex flex-row gap-1">
        {isBrokerAuthEnabled ? (
          <button
            className="inline-flex items-center rounded-full border border-green-400 bg-green-300 px-2 py-1 text-xs whitespace-nowrap"
            disabled
          >
            <ShieldCheck className="text-white" size={15} />
            <span className="font-medium text-white">사업자 인증</span>
          </button>
        ) : (
          <Link
            href="/verify/business"
            className="inline-flex cursor-pointer items-center rounded-full border border-red-400 bg-red-300 px-2 py-1 text-xs whitespace-nowrap"
          >
            <ShieldAlert className="text-white" size={15} />
            <span className="font-medium text-white">사업자 인증</span>
          </Link>
        )}

        {isPhoneAuthEnabled ? (
          <button
            className="inline-flex items-center rounded-full border border-green-400 bg-green-300 px-2 py-1 text-xs whitespace-nowrap"
            disabled
          >
            <ShieldCheck className="text-white" size={15} />
            <span className="font-medium text-white">휴대폰 인증</span>
          </button>
        ) : (
          <Link
            href="/verify/phone"
            className="inline-flex cursor-pointer items-center rounded-full border border-red-400 bg-red-300 px-2 py-1 text-xs whitespace-nowrap"
          >
            <ShieldAlert className="text-white" size={15} />
            <span className="font-medium text-white">휴대폰 인증</span>
          </Link>
        )}
      </div>
    </div>
  )
}
