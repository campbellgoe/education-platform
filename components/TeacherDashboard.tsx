'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppContext } from '@/contexts/PersistentAppContext'

export default function TeacherDashboard() {
  const { courses, user } = useAppContext()
  const teacherCourses = courses?.filter(course => course.teacherId === user?._id)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <Link href="/app/create">
        <Button>Create New Course</Button>
      </Link>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherCourses.map(course => (
            <div key={course.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.category}</p>
              <Button className="mt-2">Edit Course</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}