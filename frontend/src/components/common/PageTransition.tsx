'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * 페이지 전환 애니메이션 컴포넌트
 *
 * - /verify/* 페이지: 아래에서 위로 슬라이드 (모달 스타일)
 * - 나머지 페이지: 페이드 인/아웃 (일반적인 방식)
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  // verify 페이지인지 확인
  const isVerifyPage = pathname.startsWith('/verify/')
  const isSlideUpPage = isVerifyPage

  // 아래에서 위로 - 모달 스타일 (verify, filter 페이지용)
  const slideUpVariants = {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  }

  // 페이드 인/아웃 - 가장 일반적인 방식 (일반 페이지용)
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  // 조건부로 애니메이션 variants 선택
  const variants = isSlideUpPage ? slideUpVariants : fadeVariants

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: isSlideUpPage ? 0.3 : 0.2,
        ease: isSlideUpPage ? 'easeInOut' : 'easeOut',
      }}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {children}
    </motion.div>
  )
}

