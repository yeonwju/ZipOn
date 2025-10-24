import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-background-2 min-h-screen font-sans">
      <Link href="/test" className={'bg-blue-400 text-2xl'}>
        UI 확인하러 가기
      </Link>
    </div>
  )
}
