import { useAppContext } from "@/contexts/PersistentAppContext"
import { useEffect } from "react"

export const useFetchAllCourses = (querystring = '') => {
  const { courses, setCourses } = useAppContext()
  useEffect(() => {
  const fetchAllCourses = async () => {
     const response = await fetch('/api/courses'+querystring)
     const {courses} = await response.json()
     setCourses(courses)
  }
  fetchAllCourses()
  .then(() => console.log('Courses fetched'))
 }, [setCourses])
 return courses
}