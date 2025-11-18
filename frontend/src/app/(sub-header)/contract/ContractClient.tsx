'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

import FileUploadArea from '@/components/common/FileUploadArea'
import { useAlertDialog } from '@/components/ui/alert-dialog'
import { useContractAiVerify } from '@/queries/useContract'

export default function ContractClient() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const { showError, AlertDialog } = useAlertDialog()
  const { mutate: verifyContract, isPending } = useContractAiVerify()
  const searchParams = useSearchParams()
  const contractSeq = Number(searchParams.get('contractSeq'))
  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  const handleVerify = () => {
    if (files.length === 0) {
      showError('계약서 파일을 업로드해주세요.')
      return
    }

    // 첫 번째 파일만 사용
    const file = files[0]

    verifyContract(file, {
      onSuccess: (data: { lines: string[] }) => {
        // 검증 결과를 sessionStorage에 저장하고 결과 페이지로 이동
        if (data && data.lines && Array.isArray(data.lines)) {
          sessionStorage.setItem('contractVerifyResult', JSON.stringify(data.lines))
          router.push(`/contract/result?contractSeq=${contractSeq}`)
        } else {
          showError('검증 결과를 받아오지 못했습니다.')
        }
      },
      onError: error => {
        showError('계약서 검증에 실패했습니다. 다시 시도해주세요.')
      },
    })
  }

  return (
    <div className="px-4 py-4 pb-24">
      {/* 상단 제목 */}
      <h2 className="mb-2 text-xl font-semibold">계약서 AI 검증 서비스</h2>

      {/* AI 검토 안내 문구 */}
      <div className="mb-4 text-sm leading-relaxed text-gray-600">
        본 서비스는 AI 기반 계약서 분석 기능을 제공합니다. 아래 안내 사항을 반드시 확인한 후 파일을
        업로드해주세요.
      </div>

      <FileUploadArea files={files} onFilesChange={handleFileChange} title="계약서" />

      <span className="mt-5 block flex flex-col gap-2 text-xs leading-relaxed text-red-500">
        <div>* AI 분석 결과는 참고용이며 법적 효력이 없고, 실제 법률 자문을 대체하지 않습니다.</div>
        <div>* 제공된 분석은 입력된 계약서의 품질과 조건에 따라 오류가 발생할 수 있습니다.</div>
        <div>
          * 중요한 계약 체결 전에는 반드시 변호사 등 법률 전문가와 추가 검토를 진행해야 합니다.
        </div>
        <div>
          * 본 서비스 결과만을 근거로 의사결정을 할 경우 발생하는 책임은 사용자 본인에게 있습니다.
        </div>
      </span>

      <div className="fixed right-0 bottom-0 left-0 z-20 bg-white px-4 pt-3 pb-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          onClick={handleVerify}
          disabled={isPending || files.length === 0}
          className="w-full rounded-md bg-blue-500 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? '검증 중...' : '검증하기'}
        </button>
      </div>

      <AlertDialog />
    </div>
  )
}
