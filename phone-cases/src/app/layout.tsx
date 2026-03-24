import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CaseArt — Custom Phone Cases',
  description: 'Upload your photo and get a cartoon-style custom phone case for any device.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
