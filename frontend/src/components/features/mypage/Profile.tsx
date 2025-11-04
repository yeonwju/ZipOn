import { AtSign } from 'lucide-react'
import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/store/user'

interface ProfileProps {
  user: User | null
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className={'flex flex-col items-center gap-3'}>
      {/* 아바타 */}
      <div className={'relative'}>
        <Avatar className={'h-20 w-20 border-[3px] border-white shadow-lg'}>
          <AvatarImage src="/profile.svg" sizes={'200px'} alt="Profile" />
          <AvatarFallback
            className={'bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white'}
          >
            CN
          </AvatarFallback>
        </Avatar>
      </div>
      {/* 유저 정보 */}
      <div className={'flex flex-col items-center gap-1.5'}>
        {/* 이름 */}
        <h2 className={'text-xl font-bold tracking-tight text-gray-900'}>
          {user?.name === null ? user?.nickname : user?.name}
        </h2>

        {/* 닉네임 */}
        {user?.nickname && (
          <div className={'-mt-1 flex items-center gap-1.5'}>
            <AtSign size={12} className={'text-gray-400'} strokeWidth={2.5} />
            <span className={'text-sm font-medium text-gray-500'}>{user?.nickname}</span>
          </div>
        )}

        {/* 소셜 타입 뱃지 */}
        {user?.socialType === 'google' && (
          <div
            className={
              'inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-2 py-1'
            }
          >
            <Image
              src={'/socials/google.svg'}
              alt={'구글 아이콘'}
              width={14}
              height={14}
              className={'opacity-90'}
            />
            <span className={'text-xs font-medium text-gray-700'}>구글 계정</span>
          </div>
        )}
      </div>
    </div>
  )
}
