'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getData, setData } from '@/lib/datasource'
import { redirect } from 'next/navigation'
import { ObjectId } from 'mongoose'

export type User = {
  name: string,
  password: string
  _id: string | ObjectId
  email: string
  type: 'student' | 'teacher'
}

export type Course = {
  description: string
  _id: string
  title: string
  category: string
  teacherId: string
  authorName: string
  slug: string
  content: string
  updatedAt: string
  isPublished: boolean
}

export type AppContextType = {
  user: User | null
  courses: Course[]
  setUser: (user: User | null) => void
  setCourses: (courses: Course[]) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void,
  register: (name: string, email: string, password: string) => Promise<boolean>
  userClientSettings: { backgroundColourHex: string },
  setUserClientSettings: (settings: any) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const initializeData = async () => {
      const storedUser = await getData<User>('currentUser')
      const storedCourses = await getData<Course[]>('courses')
      if (storedUser) setUser(storedUser)
      if (storedCourses) setCourses(storedCourses)
    }
    initializeData()
  }, [])

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const newUser = await fetch('/api/account/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    }).then(res => res.json())

    if(newUser){
      setUser(newUser)
      await setData('currentUser', newUser)
      return true
    }
    return false
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = await fetch('/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }).then(res => res.json())

    if(foundUser){
      setUser(foundUser)
      await setData('currentUser', foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setData('currentUser', null)
    fetch('/api/account/logout').then(() => {
      redirect('/app')
    })
  }

  const [userClientSettings, setUserClientSettings] = useState({
    backgroundColourHex: '#ffcc00'
  })


  return (
    <AppContext.Provider value={{ user, courses, setUser, setCourses, login, logout, register, userClientSettings, setUserClientSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}