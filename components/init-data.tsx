
'use client'

import { initializeSampleData } from '@/lib/datasource'
import { useEffect, useState } from 'react'
export default function InitializeData() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      await initializeSampleData()
      setIsInitialized(true)
    }
    initialize()
  }, [])

  if (!isInitialized) {
    return <div className="text-center align-middle w-full h-[100vh] bg-black text-yellow-400 text-3xl">Initializing data...</div>
  }

  return null
}