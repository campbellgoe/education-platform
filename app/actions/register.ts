'use server'

import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { sendVerificationEmail } from './sendVerificationEmail';
import dbConnect from "@/lib/dbConnect";

export async function register(prevState: any, formData: FormData) {
  await dbConnect();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const type = formData.get('type') as 'student' | 'teacher';
  const captchaToken = formData.get('captchaToken') as string;

  if (!name || !email || !password || !type || !captchaToken) {
    return { success: false, message: 'All fields are required.' };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { success: false, message: 'Email already in use.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    type,
    emailVerified: false,
  });

  const verificationFormData = new FormData();
  verificationFormData.append('email', email);
  verificationFormData.append('captchaToken', captchaToken);

  try {
    await sendVerificationEmail(null, verificationFormData);
    return { success: true, message: 'Registration successful. Please check your email to verify your account.' };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, message: 'Registration successful, but failed to send verification email. Please try to resend the verification email.' };
  }
}