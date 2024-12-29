"use client";
import { useAppContext } from '@/contexts/PersistentAppContext'
import NavBar from './NavBar'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react';
import { isMobile } from 'react-device-detect';
function NavBarMain({ type, className, ...props }: { type?: 'header', className?: string }) {
  const pathname = usePathname()
  const { user, logout } = useAppContext()
  return (
    <Suspense fallback={<p>Loaing...</p>}><NavBar user={user} logout={logout} pathname={pathname || ''} type={type === 'header' ? isMobile ? undefined : 'header' : undefined} className={className} {...props}/></Suspense>
  )
}

export default NavBarMain