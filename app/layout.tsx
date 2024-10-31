'use client'

import './globals.css'
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import InitializeData from '@/components/init-data'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Education Platform',
//   description: 'Learn and teach with our innovative education platform',
// }

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InitializeData />
        {children}
      </body>
    </html>
  )
}