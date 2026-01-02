import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { FacebookPixel } from '@/components/analytics/FacebookPixel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MINIMINDS - Construisez, Riez, Apprenez',
  description: 'Jeux éducatifs sans écrans pour toute la famille',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <FacebookPixel />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}

