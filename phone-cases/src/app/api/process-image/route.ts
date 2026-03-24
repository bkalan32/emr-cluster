import { NextRequest, NextResponse } from 'next/server'
import { applyCartoonEffect } from '@/lib/cartoon'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('image') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported format. Please upload a JPEG, PNG, or WebP image.' },
      { status: 422 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'File exceeds 20 MB limit. Please use a smaller image.' },
      { status: 413 }
    )
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)
    const outputBuffer = await applyCartoonEffect(inputBuffer)

    return new NextResponse(outputBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="cartoon-phone-case.png"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Image processing error:', err)
    return NextResponse.json({ error: 'Failed to process image. Please try again.' }, { status: 500 })
  }
}
