'use client'

import { useState, useEffect, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import MockupCarousel from '@/components/MockupCarousel'

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [cartoonUrl, setCartoonUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)

  // Revoke blob URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (cartoonUrl) URL.revokeObjectURL(cartoonUrl)
      if (originalPreview) URL.revokeObjectURL(originalPreview)
    }
  }, [cartoonUrl, originalPreview])

  const handleFileSelected = useCallback(async (file: File) => {
    // Show original preview immediately
    if (originalPreview) URL.revokeObjectURL(originalPreview)
    setOriginalPreview(URL.createObjectURL(file))

    setStatus('processing')
    setErrorMessage(null)
    if (cartoonUrl) {
      URL.revokeObjectURL(cartoonUrl)
      setCartoonUrl(null)
    }

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/process-image', { method: 'POST', body: formData })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Processing failed. Please try again.')
      }

      const blob = await res.blob()
      setCartoonUrl(URL.createObjectURL(blob))
      setStatus('done')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }, [cartoonUrl, originalPreview])

  function handleReset() {
    if (cartoonUrl) URL.revokeObjectURL(cartoonUrl)
    if (originalPreview) URL.revokeObjectURL(originalPreview)
    setCartoonUrl(null)
    setOriginalPreview(null)
    setErrorMessage(null)
    setStatus('idle')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">CaseArt</span>
          </div>
          <span className="text-sm text-gray-500">Custom Phone Cases</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Turn your photo into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              cartoon case
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Upload any image and we&apos;ll transform it into a bold cartoon style — perfectly sized for your phone.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-4 text-center">
          {[
            { n: '1', title: 'Upload photo', desc: 'Any JPEG, PNG, or WebP image' },
            { n: '2', title: 'Cartoon magic', desc: 'We apply vivid cartoon effects' },
            { n: '3', title: 'Preview & download', desc: 'See it on multiple phone sizes' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="bg-white/60 rounded-2xl p-5 border border-white shadow-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm
                              flex items-center justify-center mx-auto mb-2">
                {n}
              </div>
              <p className="font-semibold text-gray-800">{title}</p>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Upload your image</h2>

          {status === 'idle' || status === 'error' ? (
            <div className="space-y-4">
              <ImageUploader onFileSelected={handleFileSelected} />
              {status === 'error' && errorMessage && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}
            </div>
          ) : status === 'processing' ? (
            <div className="flex flex-col items-center gap-6 py-12">
              {/* Processing animation */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="font-semibold text-gray-800">Applying cartoon effect&hellip;</p>
                <p className="text-sm text-gray-500">This usually takes 2–5 seconds</p>
              </div>

              {/* Show original image thumbnail while processing */}
              {originalPreview && (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={originalPreview} alt="Original" className="w-20 h-20 object-cover rounded-xl opacity-60" />
                  <svg className="w-6 h-6 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 animate-pulse" />
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* Preview Section */}
        {status === 'done' && cartoonUrl && (
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your cartoon case is ready!</h2>
                <p className="text-sm text-gray-500 mt-1">Preview it on different devices below</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={cartoonUrl}
                  download="cartoon-phone-case.png"
                  className="btn-success"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PNG
                </a>
                <button onClick={handleReset} className="btn-primary bg-gray-600 hover:bg-gray-700 active:bg-gray-800">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  New image
                </button>
              </div>
            </div>

            {/* Before / After comparison */}
            {originalPreview && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Original</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={originalPreview} alt="Original" className="w-full rounded-xl object-cover aspect-square" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Cartoon</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cartoonUrl} alt="Cartoon result" className="w-full rounded-xl object-cover aspect-square" />
                </div>
              </div>
            )}

            {/* Device mockup carousel */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Phone case preview</p>
              <MockupCarousel cartoonUrl={cartoonUrl} />
            </div>
          </section>
        )}
      </main>

      <footer className="text-center py-8 text-sm text-gray-400">
        <p>CaseArt &mdash; Custom phone cases made easy</p>
      </footer>
    </div>
  )
}
