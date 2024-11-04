"use client"
import { useAppContext, type AppContextType } from '@/contexts/PersistentAppContext'
import { capitaliseFirstLetter, cn } from '@/lib/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useLayoutEffect } from 'react'

type ColorPickerPropsType = {
  id: string
  name?: string
  label: string
  onChange: (e: any) => void
  value: string
}
function ColorPicker({ id, name = "color", label = "Colour", onChange, value }: ColorPickerPropsType) {
  return <div>
    <input type="color" id={id} name={name || id} value={value} onChange={onChange} />
    <label htmlFor={id}>{label}</label>
  </div>
}
type NavLinkProps = {
  active: boolean,
  href: string,
  label?: string,
  children?: any;
}
const NavLink = ({ active, href, label, children }: NavLinkProps) => {
  return <Link href={href} className={cn({
    "underline": active
  })}>{children || label}</Link>
}
function NavBar({ pathname, user, logout, type, className = "" }: { pathname: string, user: AppContextType["user"] | null, logout: (() => void), type?: 'header', className?: string }) {
  const { userClientSettings, setUserClientSettings } = useAppContext()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  const router = useRouter()
  const bgColour = searchParams.get('bgColour')
  useLayoutEffect(() => {
    if (bgColour) {
      setUserClientSettings({ backgroundColourHex: '#' + bgColour })
    }
  }, [bgColour, setUserClientSettings])
  const value = bgColour ? '#' + bgColour : userClientSettings.backgroundColourHex
  const hrefs = [
    {
      href: "/app",
      label: "App"
    },
    {
      href: "/app/login",
      label: "Login"
    },
    {
      href: "/app/register",
      label: "Register"
    }
  ]
  return (
    !pathname.startsWith('/app') ? null :
      <nav className={clsx("flex justify-evenly text-3xl shadow-md", {
        "flex-col": type !== 'header',
      }, className)}>
        {/* conditionally render Student dashboard link on dashboard page only if user logged in */}
        {user ? <NavLink href="/app/dashboard" active={pathname === "/app/dashboard"}>{capitaliseFirstLetter(user.type)} Dashboard</NavLink> : <>
          {hrefs.map(({ href, label }: { href: string, label: string }) => <NavLink key={href} href={href} active={pathname === href} label={label} />
          )}
        </>}
        {user ? <>You: {user.email}<button onClick={logout}>Logout</button></> : null}
        {pathname.startsWith("/app/course") && !pathname.includes("/edit") ? (
          <ColorPicker
            value={value}
            onChange={(e: any) => {
              if (e.target.value.startsWith('#')) {
                setUserClientSettings({ backgroundColourHex: e.target.value })
                router.replace(pathname + '?' + createQueryString('bgColour', e.target.value.slice(1)))
              } else {
                throw "Need hexadecimal value got " + e.target.value
              }
            }}
            id="backgroundColourHex"
            label=""
          />
        ) : null}
      </nav>
  )
}

export default NavBar