
import { Course } from '@/models/Course'
import dbConnect from '@/lib/dbConnect'
export async function GET(request: Request) {
  try {
    await dbConnect()
  } catch(err){
    console.error('Failed to connect to database:', err)
    return Response.json({ error: 'Failed to connect' }, { status: 500 })
  }

  try {
    const courses = await Course.find()
    return Response.json({ courses })
  } catch(err) {
    console.error('Error fetching courses:', err)
    return Response.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const { title, description, category, content, teacherId } = await request.json()
console.log('title:', title, 'description:', description, 'category:', category, 'content:', content, 'teacherId:', teacherId)
    
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
    })

    await newCourse.save()

    return Response.json({ message: 'Course created successfully', course: newCourse }, { status: 201 })
  } catch(err) {
    console.error('Error creating course:', err)
    return Response.json({ error: 'Failed to create course' }, { status: 500 })
  }
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create course' }, { status: 500 })
  }
}