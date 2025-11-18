import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ChatRoomHistoryResponseData } from '@/types/api/chat'

interface ChatMessageOtherProps {
  message: ChatRoomHistoryResponseData
  showProfile?: boolean
  showTime?: boolean
  profileImageSrc?: string
}

export default function ChatMessageOther({
  message,
  showProfile = true,
  showTime = true,
  profileImageSrc = '/default-profile.svg',
}: ChatMessageOtherProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours < 12 ? '오전' : '오후'
    const displayHour = hours % 12 === 0 ? 12 : hours % 12
    return `${ampm} ${displayHour}:${minutes}`
  }

  return (
    <div className="flex items-start gap-2 px-4 py-1">
      {/* 프로필 이미지 */}
      {showProfile ? (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profileImageSrc || '/default-profile.svg'} alt={message.sender.name} />
        </Avatar>
      ) : (
        <div className="h-10 w-10 flex-shrink-0" />
      )}

      <div className="flex flex-col gap-1">
        {/* 이름 */}
        {showProfile && (
          <div className="px-1 text-xs font-medium text-gray-700">{message.sender.name}</div>
        )}

        {/* 메시지와 시간 */}
        <div className="flex items-end gap-1">
          {/* 메시지 말풍선 */}
          <div className="max-w-[70vw] rounded-2xl bg-gray-200 px-3 py-2 text-sm break-words">
            {message.content}
          </div>

          {/* 시간 */}
          {showTime && (
            <div className="mb-1 text-xs whitespace-nowrap text-gray-400">
              {formatTime(message.sentAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
