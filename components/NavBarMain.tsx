"use client";
import { useAppContext } from '@/contexts/PersistentAppContext'
import NavBar from './NavBar'

import { usePathname } from 'next/navigation'
function NavBarMain({ type, ...props }: { type: 'header' | undefined }) {
  const pathname = usePathname()
  const { user, logout } = useAppContext()
  return (
    <NavBar user={user} logout={logout} pathname={pathname} type={type} {...props}/>
  )
}

export default NavBarMain