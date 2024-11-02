'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPassword } from '@/app/actions/forgotPassword'
import NavBarMain from '@/components/NavBarMain'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('email', email)
      const result = await forgotPassword(formData)
      setMessage(result.message)
      if (result.success) {
        setTimeout(() => router.push('/app/login'), 3000)
      }
    } catch (error: any) {
      setMessage('An error occurred. Please try again. '+error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-yellow-300">
      <NavBarMain type={undefined} />
      <div className="flex-grow flex items-center justify-center">
        <div className="p-6 bg-white rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          {message && (
            <p className={`mb-4 text-center ${message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Reset Password'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => router.push('/app/login')}>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}