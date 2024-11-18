'use server'

// import mongoose from 'mongoose'
import User from '@/models/User'
import { PasswordReset } from '@/models/PasswordReset'
import { sendPasswordResetEmail } from './sendEmail'
import dbConnect from '@/lib/dbConnect'
export async function forgotPassword(formData: FormData) {
  await dbConnect()
  const email = formData.get('email') as string

  // Check if the user exists
  const users = await User.find({ email }).distinct('_id')

  if (users.length === 0) {
    return { success: false, message: 'No user found with this email address.' }
  }

  const userId = users[0]

  // Generate a unique token
  const token = crypto.randomUUID()

  // Save the token in the database with an expiration time
  await PasswordReset.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 3600000) // Token expires in 1 hour
  })

  // Send password reset email
  formData.set('token', token)
  await sendPasswordResetEmail(undefined, formData)

  return { success: true, message: 'Password reset link sent to your email.' }
}