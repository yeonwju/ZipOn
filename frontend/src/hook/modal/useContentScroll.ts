import { useEffect, useState } from 'react'

/**
 * 컨텐츠의 스크롤 필요 여부를 감지하는 훅
 *
 * 컨텐츠의 높이가 컨테이너보다 큰 경우 true를 반환합니다.
 * MutationObserver를 사용하여 children 변경을 감지합니다.
 *
 * @param contentRef - 컨텐츠 엘리먼트 ref
 * @param children - React children (변경 감지용)
 * @param isOpen - 모달 열림 상태
 * @param dependencies - 추가 의존성 배열
 * @returns 스크롤 필요 여부
 *
 * @example
 * ```tsx
 * const contentRef = useRef<HTMLDivElement>(null)
 * const hasScroll = useContentScroll(contentRef, children, isOpen, [sheetState])
 * ```
 */
export default function useContentScroll(
  contentRef: React.RefObject<HTMLDivElement | null>,
  children: React.ReactNode,
  isOpen: boolean,
  dependencies: React.DependencyList = []
): boolean {
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      if (contentRef.current) {
        const hasScrollbar = contentRef.current.scrollHeight > contentRef.current.clientHeight
        setHasScroll(hasScrollbar)
      }
    }

    // 초기 체크 (DOM 렌더링 대기)
    const timeoutId = setTimeout(checkScroll, 100)

    // children이 변경될 때마다 체크
    const observer = new MutationObserver(checkScroll)
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
      })
    }

    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', checkScroll)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
      window.removeEventListener('resize', checkScroll)
    }
  }, [contentRef, children, isOpen, ...dependencies])

  return hasScroll
}

