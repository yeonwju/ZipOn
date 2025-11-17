'use client'

import React, { useState } from 'react'

import FileUploadArea from '@/components/common/FileUploadArea'

export default function ContractClient() {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  return (
    <div className="px-4 py-4">
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
        <button className="w-full rounded-md bg-blue-500 py-3 font-bold text-white">
          검증하기
        </button>
      </div>
    </div>
  )
}
