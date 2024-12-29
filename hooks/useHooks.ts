import { useAppContext } from "@/contexts/PersistentAppContext"
import { useEffect, useState } from "react"

export const useFetchAllCourses = (querystring = '') => {
  const [isLoading, setIsLoading] = useState(true)
  const { courses, setCourses } = useAppContext()
  useEffect(() => {
  const fetchAllCourses = async () => {
     const response = await fetch('/api/courses'+querystring)
     const {courses} = await response.json()
     setCourses(courses)
     setIsLoading(false)
  }
  fetchAllCourses()
  .then(() => console.log('Courses fetched'))
 }, [setCourses])
 return [courses, isLoading]
}