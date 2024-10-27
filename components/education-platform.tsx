'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Download, Upload } from 'lucide-react'

type Course = {
  id: number
  title: string
  description: string
  youtubeUrl: string
}

function CourseForm({ course, onSubmit, onCancel }: { 
  course: Course, 
  onSubmit: (course: Course) => void, 
  onCancel: () => void 
}) {
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description)
  const [youtubeUrl, setYoutubeUrl] = useState(course.youtubeUrl)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...course, title, description, youtubeUrl })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="youtubeUrl">YouTube Video or Playlist URL</Label>
        <Input
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Course</Button>
      </div>
    </form>
  )
}

export function EducationPlatformComponent() {
  const [courses, setCourses] = useState<Course[]>([])
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, { ...newCourse, id: Date.now() }])
    setEditingCourse(null)
  }

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ))
    setEditingCourse(null)
  }

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/)
    const playlistIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=(.+)/)
    
    if (playlistIdMatch) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistIdMatch[1]}`
    } else if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`
    }
    return url
  }

  const handleDownloadCourses = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "courses.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          try {
            const parsedCourses = JSON.parse(content)
            setCourses(parsedCourses)
          } catch (error) {
            console.error('Error parsing JSON:', error)
            alert('Error parsing JSON file. Please make sure it\'s a valid courses JSON file.')
          }
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Education Platform</h1>
      
      <Tabs defaultValue="admin" className="mb-6">
        <TabsList>
          <TabsTrigger value="admin">Admin Mode</TabsTrigger>
          <TabsTrigger value="student">Student Mode</TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <div className="flex space-x-2 mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Course</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>Fill in the details for the new course.</DialogDescription>
                </DialogHeader>
                <CourseForm 
                  course={{ id: 0, title: '', description: '', youtubeUrl: '' }}
                  onSubmit={handleAddCourse}
                  onCancel={() => setEditingCourse(null)}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={handleDownloadCourses}>
              <Download className="mr-2 h-4 w-4" /> Download Courses
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="student">
          <div className="mb-6">
            <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Courses JSON File
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                id="file-upload"
                className="flex-grow"
              />
              <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Browse
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description.slice(0, 100)}...</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Course</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{course.title}</DialogTitle>
                    <DialogDescription>{course.description}</DialogDescription>
                  </DialogHeader>
                  <div className="aspect-video mt-4">
                    <iframe
                      src={getEmbedUrl(course.youtubeUrl)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                    <DialogDescription>Update the details for this course.</DialogDescription>
                  </DialogHeader>
                  <CourseForm 
                    course={course}
                    onSubmit={handleEditCourse}
                    onCancel={() => setEditingCourse(null)}
                  />
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                <span className="sr-only">Delete</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}