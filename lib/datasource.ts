
'use client'

import localForage from 'localforage'

// Initialize localForage
localForage.config({
  name: 'EducationPlatform'
})

export async function getData<T>(key: string): Promise<T | null> {
  try {
    const value = await localForage.getItem<T>(key)
    return value
  } catch (err) {
    console.error(`Error getting data for key ${key}:`, err)
    return null
  }
}

export async function setData<T>(key: string, value: T): Promise<void> {
  try {
    await localForage.setItem(key, value)
  } catch (err) {
    console.error(`Error setting data for key ${key}:`, err)
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await localForage.removeItem(key)
  } catch (err) {
    console.error(`Error removing data for key ${key}:`, err)
  }
}

// Helper function to initialize some sample data
export async function initializeSampleData(): Promise<void> {
  const sampleCourses = [
    { id: '1', title: 'A Beginner Gardener\'s Guide', category: 'Gardening', teacherId: 'teacher1' },
    { id: '2', title: 'A Crash Course in Programming', category: 'Programming', teacherId: 'teacher1' },
    { id: '3', title: 'Baking up a storm in the kitchen', category: 'Baking', teacherId: 'teacher2' },
  ]

  const sampleUsers = [
    { id: 'student1', email: 'student@example.com', password: 'StudentEarly', type: 'student', enrolledCourses: ['1'] },
    { id: 'teacher1', email: 'teacher1@example.com', password: 'TeacherHappy',type: 'teacher', courses: ['1', '2'] },
    { id: 'teacher2', email: 'teacher2@example.com', password: 'TeacherSad', type: 'teacher', courses: ['3'] },
  ]

  await setData('courses', sampleCourses)
  await setData('users', sampleUsers)
}


