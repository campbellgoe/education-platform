'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppContext } from '@/contexts/PersistentAppContext'
import NavBarMain from '@/components/NavBarMain'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAppContext()
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    setError('')
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    // alert("Not accepting registrations yet. Login with student@example.com or teacher1@example.com to preview your dashboard (logging you in as a "+userType+")")
    // login(userType === 'student' ? "student@example.com" : 'teacher1@example.com', password)
    try {
      register(name, email, password)
      router.push('/app/dashboard')
    } catch(err: any){
      setError(err.message)
    }
    
  }

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-yellow-300">
      <NavBarMain type={undefined}/>
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
    </div>
    </>
  )
}