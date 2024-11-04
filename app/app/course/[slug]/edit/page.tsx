'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/PersistentAppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import NavBarMain from '@/components/NavBarMain'

export default function EditCoursePage({ params }: any) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [authorId, setAuthorId] = useState('')
  const router = useRouter()
  const { user } = useAppContext()
const { slug } = params
  useEffect(() => {
    // Fetch the course data when the component mounts
    const fetchCourse = async () => {
      const response = await fetch(`/api/course/${slug}`)
      if (response.ok) {
        const course = await response.json()
        setTitle(course.title)
        setDescription(course.description)
        setCategory(course.category)
        setContent(course.content)
        setAuthorId(course.teacherId)
      } else {
        console.error('Failed to fetch course')
        // error
      }
    }
    fetchCourse()
  }, [slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.type !== 'teacher' || user._id !== authorId) {
      alert('You must be logged in as a teacher who made this course, to edit it')
      return
    }

    const courseData = {
      title,
      description,
      category,
      content,
      teacherId: authorId,
      authorName: user.name || 'Unknown',
    }

    const response = await fetch(`/api/course/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    })

    if (response.ok) {
      router.push('/app/dashboard')
    } else {
      alert('Failed to update course')
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this course?')) {
      const response = await fetch(`/api/course/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/app/dashboard')
      } else {
        alert('Failed to delete course')
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <NavBarMain type="header" />
      <CardHeader>
        <CardTitle>Edit Course</CardTitle>
      </CardHeader>
      <CardContent>
        {!!(title && content) ? <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Course Content (MDX)
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
            />
          </div>
          <Button type="submit">Update Course</Button>
          <Button type="button" onClick={handleDelete} className="ml-4 bg-red-600 hover:bg-red-700">
            Delete Course
          </Button>
        </form>: <div>Loading</div>}
      </CardContent>
    </Card>
  )
}