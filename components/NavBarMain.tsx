"use client";
import { useAppContext } from '@/contexts/PersistentAppContext'
import NavBar from './NavBar'

import { usePathname } from 'next/navigation'
function NavBarMain({ type, className, ...props }: { type?: 'header', className?: string }) {
  const pathname = usePathname()
  const { user, logout } = useAppContext()
  return (
    <NavBar user={user} logout={logout} pathname={pathname || ''} type={type} className={className} {...props}/>
  )
}

export default NavBarMain