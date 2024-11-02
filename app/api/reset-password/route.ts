import User from '@/models/User'
import { PasswordReset } from '@/models/PasswordReset'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'

export async function POST(request: Request) {
  await dbConnect()
  const { token, newPassword } = await request.json()

  // Find the password reset record
  const passwordReset = await PasswordReset.findOne({ token }).populate('userId')

  if (!passwordReset || passwordReset.expiresAt < new Date()) {
    return Response.json({ success: false, message: 'Invalid or expired token' }, { status: 400 })
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update the user's password
  await User.updateOne({ _id: passwordReset.userId }, { password: hashedPassword })

  // Delete the password reset record
  await PasswordReset.deleteOne({ _id: passwordReset._id })

  return Response.json({ success: true, message: 'Password reset successfully' })
}