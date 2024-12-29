import { useAppContext } from "@/contexts/PersistentAppContext";
import { useEffect, useState } from "react";

export const useFetchAllCourses = (querystring = '') => {
  const [isLoading, setIsLoading] = useState(true);
  const { courses, setCourses } = useAppContext();
const [error, setError] = useState<string>('')
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchAllCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/courses' + querystring, { signal });
        if (!response.ok) throw new Error('Failed to fetch courses');
        const { courses } = await response.json();
        setCourses(courses);
        setIsLoading(false);
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
        setIsLoading(false);
        setError("Error occured.")
      }
    };

    fetchAllCourses();

    return () => {
      controller.abort(); // Abort the previous fetch request if dependencies change
    };
  }, [setCourses, querystring]);

  return [courses, isLoading, [error, setError]];
};