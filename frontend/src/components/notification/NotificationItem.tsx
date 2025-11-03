import Image from 'next/image'

export default function NotificationItem() {
  return (
    <div className="flex w-full items-center gap-4 border-b border-gray-200 p-4">
      <div>
        <Image src="/profile.svg" width={35} height={30} alt={'notificationImg'}></Image>
      </div>
      <div className={'flex w-full flex-row items-center justify-between gap-4'}>
        <div>
          <div className="w-[80px] overflow-hidden font-bold text-ellipsis whitespace-nowrap">
            송파1
          </div>
          <div className="w-[260px] overflow-hidden text-sm text-ellipsis whitespace-nowrap">
            방송 10분 전입니다.
          </div>
        </div>
        <div>
          <div className={'w-[80px] text-sm font-bold'}>오후 02:28</div>
        </div>
      </div>
    </div>
  )
}
