'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/PersistentAppContext'
import StudentDashboard from '@/components/StudentDashboard'
import TeacherDashboard from '@/components/TeacherDashboard'
import NavBarMain from '@/components/NavBarMain'

export default function Dashboard() {
  const { user } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/app/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div>
      <NavBarMain type="header" className="bg-yellow-300"/>
      {user.type === 'student' ? <StudentDashboard /> : user.type === 'teacher' ? <TeacherDashboard /> : 'Unknown type of user ('+user.type+').'}
    </div>
  )
}