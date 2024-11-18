import mongoose, { Document, Model } from 'mongoose';

export interface IEmailVerification extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const EmailVerificationSchema = new mongoose.Schema<IEmailVerification>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const EmailVerification: Model<IEmailVerification> = mongoose.models.EmailVerification || mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);

export default EmailVerification;