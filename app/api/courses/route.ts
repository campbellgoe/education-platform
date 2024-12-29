
import { Course } from '@/models/Course'
import dbConnect from '@/lib/dbConnect'
import { slugify } from '@/utils/slugify'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
  } catch(err){
    console.error('Failed to connect to database:', err)
    return Response.json({ error: 'Failed to connect' }, { status: 500 })
  }

  try {
    const teacherId = request.nextUrl.searchParams.get("teacherId")
    let courses
    if(teacherId){
      courses = await Course.find({ teacherId })
    } else {
      courses = await Course.find({ isPublished: true})
    }
    return Response.json({ courses })
  } catch(err) {
    console.error('Error fetching courses:', err)
    return Response.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const { title, description, category, content, teacherId, authorName, isPublished } = await request.json()
    const slug = slugify(title)
console.log('title:', title, 'description:', description, 'category:', category, 'teacherId:', teacherId, 'isPublished', isPublished, 'slug', slug)
    
try {
  await dbConnect()
} catch(err){
  console.error('Failed to connect to database:', err)
  return Response.json({ error: 'Failed to connect' }, { status: 500 })
}
    try {
    const newCourse = new Course({
      title,
      description,
      category,
      content,
      teacherId,
      authorName,
      slug,
      isPublished,
    })

    await newCourse.save()

    return Response.json({ message: 'Course created successfully', course: newCourse, slug }, { status: 201 })
  } catch(err) {
    console.error('Error creating course:', err)
    return Response.json({ error: 'Failed to create course' }, { status: 500 })
  }
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create course' }, { status: 500 })
  }
}