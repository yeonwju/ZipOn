import { Camera } from 'lucide-react'
import Image from 'next/image'

import AuthOptionGroup from '@/components/features/mypage/AuthOptionGroup'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStore } from '@/store/user'
const { user } = useUserStore.getState()

export default function Profile() {
  const hasName = user?.name !== null && user?.name !== undefined
  const hasNickname = user?.nickname !== null && user?.nickname !== undefined

  return (
    <div className={'flex flex-row items-center gap-5'}>
      {/* 아바타 */}
      <div className={'relative'}>
        <Avatar className={'h-20 w-20 rounded-3xl border-3 border-gray-100 shadow-lg'}>
          <AvatarImage src="/profile.svg" alt="Profile" className="rounded-2xl object-cover" />
          <AvatarFallback className="rounded-2xl">
            <Skeleton className="h-20 w-20 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          </AvatarFallback>
        </Avatar>
        <button
          className={
            'absolute right-[-5] bottom-[-5] z-50 cursor-pointer rounded-full border-2 border-gray-200 bg-white p-1.5 shadow-sm'
          }
        >
          <Camera size={15} className={'text-black'} />
        </button>
      </div>
      {/* 유저 정보 */}
      <div className={'flex flex-col gap-1'}>
        <div className={'flex flex-col gap-0.5'}>
          {hasName ? (
            <div className={'flex flex-row items-baseline'}>
              {/* 이름 - 정확히 중앙에 위치 */}
              <h2 className={'text-xl font-bold tracking-tight text-gray-900'}>{user?.name}</h2>
              {/* 닉네임 - 이름 오른쪽에 붙음 */}
              <div className={'justify-self-start'}>
                {hasNickname && (
                  <span className={'ml-1 text-sm font-medium text-gray-500'}>
                    @{user?.nickname}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className={'flex'}>
              {/* 이름 없으면 닉네임만 중앙에 표시 */}
              {hasNickname && (
                <h2 className={'text-sm font-medium tracking-tight text-gray-500'}>
                  @ {user?.nickname}
                </h2>
              )}
            </div>
          )}
          {user?.email && (
            <div className={'flex flex-row gap-1'}>
              {user?.socialType === 'google' && (
                <Image src={'/socials/google.svg'} alt={'구글 아이콘'} width={9} height={9}></Image>
              )}
              <span className={'text-xs text-gray-400'}>{user?.email}</span>
            </div>
          )}
        </div>
        <AuthOptionGroup />
      </div>
    </div>
  )
}
