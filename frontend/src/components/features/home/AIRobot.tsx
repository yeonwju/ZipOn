'use client'

import { motion } from 'framer-motion'

/**
 * 귀여운 AI 로봇 컴포넌트
 */
export default function AIRobot() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* 로봇 몸체 */}
        <div className="relative flex items-center justify-center">
          {/* 로봇 머리 */}
          <div className="relative z-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-4 shadow-lg">
            <div className="flex items-center justify-center gap-2">
              {/* 왼쪽 눈 */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="h-3 w-3 rounded-full bg-white"
              />
              {/* 오른쪽 눈 */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                className="h-3 w-3 rounded-full bg-white"
              />
            </div>
            {/* 입 */}
            <motion.div
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mx-auto mt-2 h-1 w-6 rounded-full bg-white"
            />
          </div>

          {/* 로봇 몸체 */}
          <div className="absolute top-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 px-6 py-8 shadow-xl">
            <div className="flex items-center justify-center gap-1">
              {/* 왼쪽 팔 */}
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="h-8 w-2 rounded-full bg-blue-300"
              />
              {/* 몸체 중앙 (AI 표시) */}
              <div className="mx-2 flex items-center justify-center rounded-lg bg-white/20 px-3 py-2">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              {/* 오른쪽 팔 */}
              <motion.div
                animate={{ rotate: [5, -5, 5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="h-8 w-2 rounded-full bg-blue-300"
              />
            </div>
          </div>
        </div>

        {/* 반짝이는 효과 */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-yellow-300 blur-sm"
        />
      </motion.div>
    </motion.div>
  )
}

