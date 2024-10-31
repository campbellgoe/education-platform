'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getData, setData } from '@/lib/datasource'

type User = {
  id: string
  email: string
  type: 'student' | 'teacher'
}

type Course = {
  id: string
  title: string
  category: string
  teacherId: string
}

type AppContextType = {
  user: User | null
  courses: Course[]
  setUser: (user: User | null) => void
  setCourses: (courses: Course[]) => void
  login: (email: string) => Promise<boolean>
  logout: () => void
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

  const login = async (email: string): Promise<boolean> => {
    const users = await getData<User[]>('users')
    const foundUser = users?.find(u => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      await setData('currentUser', foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setData('currentUser', null)
  }

  return (
    <AppContext.Provider value={{ user, courses, setUser, setCourses, login, logout }}>
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