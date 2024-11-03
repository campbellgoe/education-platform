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
    if(bgColour){
      setUserClientSettings({ backgroundColourHex: '#'+bgColour })
    }
  }, [bgColour, setUserClientSettings])
  const value = bgColour ? '#'+bgColour : userClientSettings.backgroundColourHex
  return (
   !pathname.startsWith('/app') ? null :
      <nav className={clsx("flex justify-evenly text-3xl shadow-md", {
        "flex-col": type !== 'header',
      }, className)}>
        {user ? <Link href="/app/dashboard" className={cn({
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
        <ColorPicker value={value} onChange={(e: any) => {
          if (e.target.value.startsWith('#')) {
            setUserClientSettings({ backgroundColourHex: e.target.value })
            router.replace(pathname + '?' + createQueryString('bgColour', e.target.value.slice(1)))
          } else {
            throw "Need hexademical value got " + e.target.value
          }
        }}
          id="backgroundColourHex" label="" />
      </nav>
  )
}

export default NavBar