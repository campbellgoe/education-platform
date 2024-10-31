
import type { Metadata } from 'next'
import NavBarMain from '@/components/NavBarMain'

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
    <NavBarMain />
    {children}
    </>
  )
}