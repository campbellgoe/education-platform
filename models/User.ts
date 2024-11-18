// models/User.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  teacherCourses: mongoose.Types.ObjectId[];
  emailVerified: boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    // match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters long'],
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  teacherCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  emailVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Add any pre-save hooks, methods, or statics here
// UserSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const bcrypt = await import('bcryptjs');
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;