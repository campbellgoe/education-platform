'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getData } from '@/lib/datasource'
import Fuse from 'fuse.js'

type Course = {
  id: string
  title: string
  category: string
  teacherId: string
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getData<Course[]>('courses')
      if (fetchedCourses) {
        setCourses(fetchedCourses)
        setFilteredCourses(fetchedCourses)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const fuse = new Fuse(courses, {
        keys: ['title', 'category'],
        threshold: 0.3,
      })
      const results = fuse.search(searchTerm)
      setFilteredCourses(results.map(result => result.item))
    } else {
      setFilteredCourses(courses)
    }
  }, [searchTerm, courses])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-4">
        <Label htmlFor="search">Search Courses</Label>
        <Input 
          type="text" 
          id="search" 
          placeholder="Search by title or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.category}</p>
            <Button className="mt-2">View Course</Button>
          </div>
        ))}
      </div>
    </div>
  )
}