'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { File, X } from 'lucide-react'
import React, { useRef } from 'react'
import Image from 'next/image'

interface FileUploadAreaProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  title: string
  accept?: string
  description?: string
}

export default function FileUploadArea({
  files,
  onFilesChange,
  title,
  accept = '.pdf,.jpg,.jpeg,.png',
  description = 'PDF, JPG, PNG 파일을 업로드할 수 있습니다',
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileClick = () => fileInputRef.current?.click()

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      onFilesChange([...files, ...selectedFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-900">
        {title} <span className="text-red-500">*</span>
      </label>

      <Empty className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
        {files.length === 0 ? (
          <>
            <EmptyHeader className={'flex flex-col'}>
              <EmptyMedia variant="default">
                <Image
                  src={'/icons/file-image.png'}
                  alt={'파일이미지'}
                  width={150}
                  height={100}
                />
              </EmptyMedia>
              <div>
                <EmptyTitle className="text-base font-medium text-gray-900">
                  파일을 업로드하세요
                </EmptyTitle>
                <EmptyDescription className="text-sm text-gray-500">{description}</EmptyDescription>
              </div>
            </EmptyHeader>

            <EmptyContent>
              <Button
                type="button"
                onClick={handleFileClick}
                className="h-8 bg-blue-500 px-4 text-xs font-semibold text-white hover:bg-blue-600"
              >
                파일 선택
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </EmptyContent>
          </>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <File />
                  <span className="max-w-[200px] truncate text-xs font-medium text-gray-900">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-gray-400 transition hover:text-red-500"
                  aria-label="파일 삭제"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Empty>
    </div>
  )
}

