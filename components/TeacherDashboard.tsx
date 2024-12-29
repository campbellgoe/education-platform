'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppContext } from '@/contexts/PersistentAppContext'
import Fuse from 'fuse.js'
import clsx from 'clsx'

export default function TeacherDashboard({ isLoading }: any) {
  const { courses, userClientSettings } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const teacherCourses = courses;//useMemo(() => courses?.filter(course => course.teacherId === user?._id) || [], [courses, user?._id])
  const [filteredCourses, setFilteredCourses] = useState(teacherCourses)

  useEffect(() => {
    if (!teacherCourses) return

    if (searchTerm === '' || searchTerm === '*') {
      setFilteredCourses(teacherCourses)
    } else {
      const fuse = new Fuse(teacherCourses, {
        keys: ['title', 'description', 'category', 'content', 'authorName'],
        threshold: 0.5,
      })
      const results = fuse.search(searchTerm)
      setFilteredCourses(results.map(result => result.item))
    }
  }, [searchTerm, teacherCourses])
const bgColour = userClientSettings.backgroundColourHex.slice(1)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <Link href="/app/create">
          <Button>Create New Course</Button>
        </Link>
        <div className="w-1/3">
          <Input 
            type="text" 
            placeholder="Search your courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search courses"
          />
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses?.map(course => (
            <div key={course._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-600">{course.category}</p>
            <Link href={`/app/course/${course.slug}/edit?bgColour=${bgColour}`} className="mr-8">
              <Button className="mt-2">Edit Course</Button>
            </Link>
            <Link href={"/app/course/"+course.slug+'?bgColour='+bgColour}>
            <Button className="mt-2">View Course</Button>
          </Link>
          <p className={clsx('rounded mt-2 p-1 max-w-[12ch]', {
            'text-red-500 bg-red-100': !course.isPublished,
            'text-green-500 bg-green-100': course.isPublished,
          })}>{course.isPublished ? 'Published' : 'Not Published'}</p>
          </div>
          ))}
        </div>
        {isLoading ? <p className="text-center text-gray-600 mt-4">Loading courses</p> : filteredCourses.length === 0 ? <p className="text-center text-gray-600 mt-4">No courses found. Try a different search term or create a new course.</p> : null}
      </div>
    </div>
  )
}