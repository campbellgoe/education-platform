'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/PersistentAppContext'
import StudentDashboard from '@/components/StudentDashboard'
import TeacherDashboard from '@/components/TeacherDashboard'
import NavBarMain from '@/components/NavBarMain'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useFetchAllCourses } from '@/hooks/useHooks'
type ViewType = 'student' | 'teacher' | null
const localStorageKey = 'phiedtech.dashboard.view'
export default function Dashboard() {
  const { user } = useAppContext()
  const router = useRouter()
  const [view, setView] = useState<ViewType>(null)
useEffect(() => {
setView(localStorage.getItem(localStorageKey) as ViewType || 'student')
}, [])
  useEffect(() => {
    if(view) localStorage.setItem(localStorageKey, view)
  }, [view])
  useEffect(() => {
    if (!user) {
      router.push('/app/login')
    }
  }, [user, router])
  const isTeacherView = view === 'teacher'
  const qs = (isTeacherView && user?._id) ? '?teacherId='+user._id : ''
  const [courses, isLoading] = useFetchAllCourses(qs)
  const toggleView = () => {
    setView(isTeacherView ? 'student' : 'teacher')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <NavBarMain type="header" className="bg-yellow-300"/>
      {view ? <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="view-toggle" checked={isTeacherView} onCheckedChange={toggleView} />
          <Label htmlFor="view-toggle">
            {isTeacherView ? 'Teacher View' : 'Student View'}
          </Label>
        </div>
        {isTeacherView ? <TeacherDashboard isLoading={isLoading} /> : <StudentDashboard courses={courses} isLoading={isLoading}/>}
      </div>: <p>Loading...</p>}
    </div>
  )
}