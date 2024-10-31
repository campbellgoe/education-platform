"use client";
import { useAppContext } from '@/contexts/PersistentAppContext'
import NavBar from './NavBar'

import { usePathname } from 'next/navigation'
function NavBarMain() {
  const pathname = usePathname()
  const { user, logout } = useAppContext()
  return (
    <NavBar user={user} logout={logout} pathname={pathname} />
  )
}

export default NavBarMain