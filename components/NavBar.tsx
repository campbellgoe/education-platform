"use client"
import type { User } from '@/contexts/PersistentAppContext'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function NavBar({ pathname, user, logout }: { pathname: string, user: User | null, logout: any }) {
  return (
    <nav>
      <Link href="/app" className={cn({
        "underline": pathname === "/app"
      })}>App</Link>
<Link href="/app/login" className={cn({
        "underline": pathname === "/app/login"
      })}>Login</Link><Link href="/app/register" className={cn({
        "underline": pathname === "/app/register"
      })}>Register</Link>
      {user ? <>Welcome {user.email} <button onClick={logout}>Logout</button></> : null}
    </nav>
  )
}

export default NavBar