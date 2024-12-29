import { Course } from '@/models/Course'
import dbConnect from '@/lib/dbConnect'
import { slugify } from '@/utils/slugify'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await dbConnect()
    const course = await Course.findOne({ slug })
    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 })
    }
    return Response.json(course)
  } catch (err) {
    console.error('Error fetching course:', err)
    return Response.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { title, description, category, content, teacherId, authorName, isPublished } = await request.json()
    await dbConnect()
    const updatedCourse = await Course.findOneAndUpdate(
      { slug },
      { title, description, category, content, teacherId, authorName, slug: slugify(title) , isPublished },
      { upsert: true }
    )
    if (!updatedCourse) {
      return Response.json({ error: 'Course not found' }, { status: 404 })
    }
    return Response.json({ message: 'Course updated successfully', course: updatedCourse })
  } catch (err) {
    console.error('Error updating course:', err)
    return Response.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await dbConnect()
    const deletedCourse = await Course.findOneAndDelete({ slug })
    if (!deletedCourse) {
      return Response.json({ error: 'Course not found' }, { status: 404 })
    }
    return Response.json({ message: 'Course deleted successfully' })
  } catch (err) {
    console.error('Error deleting course:', err)
    return Response.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}