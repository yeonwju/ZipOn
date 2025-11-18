import { AlertTriangle, CheckCircle, Shield, Sparkles } from 'lucide-react'

interface ListingAIAnalysisProps {
  riskScore: number
  riskReason: string
}

/**
 * AI 위험도 평가 섹션
 *
 * 등기부등본 분석 결과를 시각적으로 표시합니다.
 */
export default function ListingAIAnalysis({ riskScore, riskReason }: ListingAIAnalysisProps) {
  // 위험도에 따른 색상 및 아이콘
  const getRiskLevel = (score: number) => {
    if (score >= 4) {
      return {
        level: '안전',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        icon: CheckCircle,
        progressColor: 'bg-green-500',
      }
    } else if (score === 3) {
      return {
        level: '보통',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        icon: Shield,
        progressColor: 'bg-yellow-500',
      }
    } else {
      return {
        level: '주의',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        icon: AlertTriangle,
        progressColor: 'bg-red-500',
      }
    }
  }

  const risk = getRiskLevel(riskScore)
  const Icon = risk.icon

  return (
    <section className="mt-2 bg-white px-4 py-6">
      {/* 섹션 헤더 */}
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h3 className="text-base font-bold text-gray-900">AI 안전도 분석</h3>
      </div>

      {/* 점수 및 레벨 표시 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`h-8 w-8 ${risk.color}`} />
          <div>
            <p className="text-xs text-gray-500">분석 결과</p>
            <p className={`text-xl font-bold ${risk.color}`}>{risk.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">안전도 점수</p>
          <p className={`text-2xl font-bold ${risk.color}`}>
            {riskScore}
            <span className="text-sm text-gray-400">/5</span>
          </p>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full ${risk.progressColor} transition-all duration-700 ease-out`}
          style={{ width: `${riskScore * 20}%` }}
        />
      </div>

      {/* 분석 이유 */}
      <div className={`rounded-lg border ${risk.borderColor} ${risk.bgColor} p-4`}>
        <p className="mb-2 text-xs font-semibold text-gray-600">분석 상세 내용</p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{riskReason}</p>
      </div>

      {/* 안내 문구 */}
      <p className="mt-4 text-xs leading-relaxed text-gray-400">
        * 본 분석은 AI가 등기부등본을 기반으로 작성한 참고 자료이며, 법적 효력은 없습니다.
      </p>
    </section>
  )
}
