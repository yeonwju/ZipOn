import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { normalizeImageUrl } from '@/utils/format'

interface ListingDetailProfileProps {
  imgSrc: string
  name: string
  className?: string
}

export default function ListingDetailProfile({
  imgSrc,
  name,
  className,
}: ListingDetailProfileProps) {
  return (
    <div className={`text-md flex flex-row items-center gap-2 ${className ?? ''}`}>
      <Avatar className={'h-6 w-6'}>
        <AvatarImage src={normalizeImageUrl(imgSrc)} />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  )
}
