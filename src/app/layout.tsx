import type { Metadata } from 'next'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Ser3nus AIGC Gallery',
  description: 'A personal gallery of AI-generated media — images, videos, audio, and text.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-warm-50 text-warm-900 font-sans">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 sm:py-12">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
