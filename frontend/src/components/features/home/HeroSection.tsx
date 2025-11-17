'use client'

import { Shield, Sparkles, Zap } from 'lucide-react'

import AIRobot from './AIRobot'

/**
 * 홈 페이지 히어로 섹션
 * AI 검증 기반 실시간 부동산 안심 거래 플랫폼 소개
 */
export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-lg">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl" />

      <div className="relative z-10 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        {/* 왼쪽: 텍스트 영역 */}
        <div className="flex flex-1 flex-col gap-3 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">AI 검증 기반</span>
          </div>

          <h1 className="text-2xl leading-tight font-bold text-gray-900 md:text-3xl">
            실시간 부동산
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              안심 거래 플랫폼
            </span>
          </h1>

          <p className="text-sm text-gray-600 md:text-base">
            AI가 검증한 안전한 매물을
            <br />
            실시간으로 확인하세요
          </p>

          {/* 특징 아이콘들 */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">안전 검증</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium text-gray-700">실시간 매물 확인</span>
            </div>
          </div>
        </div>

        {/* 오른쪽: AI 로봇 */}
        <div className="flex-shrink-0">
          <AIRobot />
        </div>
      </div>
    </div>
  )
}
