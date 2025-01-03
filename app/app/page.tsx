'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import StudentDashboard from '@/components/StudentDashboard'
import { useFetchAllCourses } from '@/hooks/useHooks'

export default function Page() {
  const [courses, isLoading] = useFetchAllCourses()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-yellow-300">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to PhiEdTech
        </h1>
        <p className="mt-3 text-2xl">
          Learn or teach, the choice is yours!
        </p>
        <StudentDashboard fullArticle={false} courses={courses} isLoading={isLoading}/>
        <div className="flex mt-6">
          <Link href="/app/login" className="mr-4">
            <Button>Login</Button>
          </Link>
          <Link href="/app/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}