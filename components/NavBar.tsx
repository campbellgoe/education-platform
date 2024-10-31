"use client"
import type { User } from '@/contexts/PersistentAppContext'
import { cn } from '@/lib/utils'
import clsx from 'clsx'
import Link from 'next/link'
function capitaliseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function NavBar({ pathname, user, logout, type,  }: { pathname: string, user: User | null, logout: any, type: 'header' | undefined }) {
  return (
    pathname === '/app' ? null : 
    <nav className={clsx("flex justify-evenly text-3xl shadow-md", {
      "flex-col": type !== 'header',
    })}>
      {user ? <Link href="/app" className={cn({
        "underline": pathname === "/app/dashboard"
      })}>{capitaliseFirstLetter(user.type)} Dashboard</Link> : <>
      <Link href="/app" className={cn({
        "underline": pathname === "/app"
      })}>Welcome</Link>
<Link href="/app/login" className={cn({
        "underline": pathname === "/app/login"
      })}>Login</Link><Link href="/app/register" className={cn({
        "underline": pathname === "/app/register"
      })}>Register</Link>
      </>}
      {user ? <>You: {user.email}<button onClick={logout}>Logout</button></> : null}
    </nav>
  )
}

export default NavBar