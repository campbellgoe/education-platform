'use client'

import { useState, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/PersistentAppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import NavBarMain from '@/components/NavBarMain'
import dynamic from 'next/dynamic'
import { forwardRef } from "react"
import {
  type MDXEditorMethods,
  type MDXEditorProps
} from '@mdxeditor/editor'
// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('@/components/InitializedMDXEditor'), {
  // Make sure we turn SSR off
  ssr: false
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
const MyMDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => <Editor {...props} editorRef={ref} />)

// TS complains without the following line
MyMDXEditor.displayName = 'MyMDXEditor'

export default function CreateCoursePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const { user } = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const courseData = {
      title,
      description,
      category,
      content,
      teacherId: user?._id,
      authorName: user?.name || 'Unknown',
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
  const mdxEditorRef = useRef<MDXEditorMethods>(null)
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
              required
              onChange={(e: any) => {
                setContent(e.target.value)
                mdxEditorRef.current?.setMarkdown(e.target.value)
              }}
              rows={10}
            />
            <Suspense fallback={null}>
              <MyMDXEditor
                ref={mdxEditorRef}
                markdown={content}
                onChange={(e: string) => setContent(e)}
                contentEditableClassName="my-mdx-editor"
              />
            </Suspense>
          </div>
          <Button type="submit">Create Course</Button>
        </form>
      </CardContent>
    </Card>
  )
}