'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/PersistentAppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import NavBarMain from '@/components/NavBarMain'

export default function CreateCoursePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const { user } = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.type !== 'teacher') {
      alert('You must be logged in as a teacher to create a course')
      return
    }
console.log('user:', user)
    const courseData = {
      title,
      description,
      category,
      content,
      teacherId: user._id,
      authorName: user.name || 'Unknown',
    }

    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    })

    if (response.ok) {
      router.push('/app/dashboard')
    } else {
      alert('Failed to create course')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <NavBarMain type="header" />
      <CardHeader>
        <CardTitle>Create a New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)}/>
             
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
          <Button type="submit">Create Course</Button>
        </form>
      </CardContent>
    </Card>
  )
}