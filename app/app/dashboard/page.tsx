'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/PersistentAppContext'
import StudentDashboard from '@/components/StudentDashboard'
import TeacherDashboard from '@/components/TeacherDashboard'
import NavBarMain from '@/components/NavBarMain'

export default function Dashboard() {
  const { user, setCourses } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/app/login')
    }
  }, [user, router])

  useEffect(() => {
    if(!user) return
   const fetchAllCourses = async () => {
      const response = await fetch('/api/courses')
      const {courses} = await response.json()
      setCourses(courses)
   }
   fetchAllCourses()
   .then(() => console.log('Courses fetched'))
  }, [user])
  return (
    <div>
      <NavBarMain type="header" className="bg-yellow-300"/>
      {user?.type === 'student' ? <StudentDashboard /> : user?.type === 'teacher' ? <TeacherDashboard /> : 'Loading user...'}
    </div>
  )
}