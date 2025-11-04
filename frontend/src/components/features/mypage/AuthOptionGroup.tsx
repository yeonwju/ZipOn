import { useUserStore } from '@/store/user'

export default function AuthOptionGroup() {
  const { user } = useUserStore.getState()
  return (
    <div
      className={
        'mt-2 flex w-full flex-row items-center justify-center gap-1.5 rounded-md bg-[#F2F8FC] p-1.5 text-sm font-medium'
      }
    >
      {user?.isBroker ? (
        <button
          disabled
          className={
            'flex-1 cursor-not-allowed rounded-md bg-white px-3 py-2 text-gray-400 opacity-60 shadow-sm'
          }
        >
          중개인 인증
        </button>
      ) : (
        <button
          className={
            'flex-1 rounded-md bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md active:scale-[0.98]'
          }
        >
          중개인 인증
        </button>
      )}

      {user?.isVerified ? (
        <button
          disabled
          className={
            'flex-1 cursor-not-allowed rounded-md bg-white px-3 py-2 text-gray-400 opacity-60 shadow-sm'
          }
        >
          휴대폰 본인인증
        </button>
      ) : (
        <button
          className={
            'flex-1 rounded-md bg-blue-400 px-3 py-2 text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]'
          }
        >
          휴대폰 본인인증
        </button>
      )}
    </div>
  )
}
