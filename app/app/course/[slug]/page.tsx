"use client";
import { Course, useAppContext } from "@/contexts/PersistentAppContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function CoursePage() {
  const params = useParams<{ slug: string }>()
  const { slug } = params
  const { courses, setCourses } = useAppContext()
  useEffect(() => {
   const fetchAllCourses = async () => {
      const response = await fetch('/api/courses')
      const {courses} = await response.json()
      setCourses(courses)
   }
   fetchAllCourses()
   .then(() => console.log('Courses fetched'))
  }, [setCourses])
  const [filteredCourses, setFilteredCourses] = useState(courses)
  const course = filteredCourses[0]
  useEffect(() => {
   setFilteredCourses(courses.filter((course: Course) => course.slug === slug))
  }, [slug, courses])
 
//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [category, setCategory] = useState('')
//   const [content, setContent] = useState('')
//   const router = useRouter()
//   const { user } = useAppContext()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user || user.type !== 'teacher') {
//       alert('You must be logged in as a teacher to create a course')
//       return
//     }
// console.log('user:', user)
//     const courseData = {
//       title,
//       description,
//       category,
//       content,
//       teacherId: user._id,
//     }

    // if(user.type === 'teacher'){
    //   // const response = await fetch('/api/courses', {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify(courseData),
    //   // })
    //   if (response.ok) {
    //     router.push('/app/dashboard')
    //   } else {
    //     alert('Failed to create course')
    // // }
  //   }
    
  // }

  return (
    <div>
      <h1>Course Page</h1>
      {course ? (
        <div>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>{course.category}</p>
          <pre className="whitespace-pre-wrap">{course.content}</pre>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  )
}