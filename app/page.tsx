'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    router.push('/app')
  }, [])
  return (
    <Link href="/app">App</Link>
  )
}