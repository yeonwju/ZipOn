'use client'

import { ImageIcon, X } from 'lucide-react'
import React, { useRef } from 'react'

interface ImageUploadGridProps {
  images: File[]
  onImagesChange: (images: File[]) => void
}

export default function ImageUploadGrid({ images, onImagesChange }: ImageUploadGridProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = () => imageInputRef.current?.click()

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      onImagesChange([...images, ...selectedFiles])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file)
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-900">사진</h3>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
            <img
              src={getImagePreview(image)}
              alt={`미리보기 ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
              aria-label="이미지 삭제"
            >
              <X size={18} />
            </button>
          </div>
        ))}

        {/* 사진 추가 버튼 */}
        <button
          type="button"
          onClick={handleImageClick}
          className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition-all hover:border-blue-500 hover:bg-blue-50"
        >
          <ImageIcon
            className="text-gray-400 transition-colors group-hover:text-blue-500"
            size={32}
          />
          <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600">
            사진 추가
          </span>
        </button>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageInputChange}
        className="hidden"
        multiple
      />
    </div>
  )
}

