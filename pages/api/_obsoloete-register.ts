// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { Error } from 'mongoose';

type Data = {
  message: string;
  user?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();

    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (type !== 'student' && type !== 'teacher') {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password, type });
    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        type: newUser.type
      }
    });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
}