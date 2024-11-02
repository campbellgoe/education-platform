'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import NavBarMain from '@/components/NavBarMain'

export default function ResetPassword({ params }: any) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, newPassword: password })
      })

      const result = await response.json()
      setMessage(result.message)

      if (result.success) {
        setTimeout(() => router.push('/login'), 3000)
      }
    } catch (error: any) {
      setMessage('An error occurred. Please try again. ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-yellow-300">
      <NavBarMain type={undefined} />
      <div className="flex-grow flex items-center justify-center">
        <div className="p-6 bg-white rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
          {message && (
            <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}