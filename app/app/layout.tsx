
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Education Platform App',
  description: 'Learn and teach with our innovative education platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    {/* Add logo here for /app layout */}
    {children}
    </>
  )
}