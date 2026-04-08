import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ClientLayout } from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '360 Sehpa - Admin Panel',
  description: 'E-Ticaret Yönetim Paneli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
