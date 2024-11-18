import { NextResponse } from 'next/server';
import EmailVerification from '@/models/EmailVerification';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  request: Request,
  params: any
) {
  await dbConnect();

  const { token } = await params;

  const verification = await EmailVerification.findOne({ token });

  if (!verification || verification.expiresAt < new Date()) {
    return NextResponse.redirect(`${process.env.WEB_URL}/app/login?error=invalid_token`);
  }

  const user = await User.findById(verification.userId);

  if (!user) {
    return NextResponse.redirect(`${process.env.WEB_URL}/app/login?error=user_not_found`);
  }

  user.emailVerified = true;
  await user.save();

  await EmailVerification.deleteOne({ _id: verification._id });

  return NextResponse.redirect(`${process.env.WEB_URL}/app/login?verified=true`);
}