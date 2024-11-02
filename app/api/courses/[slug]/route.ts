import dbConnect from "@/lib/dbConnect"
import { Course } from "@/models/Course"

export async function GET(request: Request,
  { params }: any) {
  const { slug } = params
  try {
    await dbConnect()
  } catch (err) {
    console.error('Failed to connect to database:', err)
    return Response.json({ error: 'Failed to connect' }, { status: 500 })
  }

  try {
    const course = await Course.findOne({ slug })
    return Response.json({ course })
  } catch (err) {
    console.error('Error fetching course:', err)
    return Response.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}