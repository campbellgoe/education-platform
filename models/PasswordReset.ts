import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
})

export const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema)