'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'

interface ImageUploaderProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
}

export default function ImageUploader({ onFileSelected, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    onFileSelected(file)
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function onDragLeave() {
    setIsDragging(false)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div
      className={`upload-zone ${isDragging ? 'drag-over' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <div>
          <p className="text-base font-semibold text-gray-800">
            {isDragging ? 'Drop your image here' : 'Drag & drop your photo'}
          </p>
          <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
        </div>

        <p className="text-xs text-gray-400">JPEG, PNG, WebP — up to 20 MB</p>
      </div>
    </div>
  )
}
