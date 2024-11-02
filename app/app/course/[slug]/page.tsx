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
 

  return (
    <div className="bg-yellow-300 mx-auto w-[40ch] md:w-[60ch] p-4">
      <h1>Course Page</h1>
      {course ? (
        <div>
          <h2>Author: {course.authorName}</h2>
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