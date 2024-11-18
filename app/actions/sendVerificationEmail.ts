'use server'

import { randomBytes } from 'crypto';
import EmailVerification from '@/models/EmailVerification';
import dbConnect from "@/lib/dbConnect";
import { makeForwardEmailNetTransporter } from "./_makeTransport";
import { sendThrottledEmail, verifyCaptchaAndCheckEmailExistenceAndGetUser } from './sendEmail'; // Adjust the import path as needed


const emailTransport = makeForwardEmailNetTransporter(process.env.EMAIL_VERIFICATION_USER, process.env.EMAIL_VERIFICATION_PASS);
export async function sendVerificationEmail(prevState: any, formData: FormData) {
  await dbConnect();
  const [user, email] = await verifyCaptchaAndCheckEmailExistenceAndGetUser(formData)
  const token = randomBytes(32).toString('hex');
  const verificationUrl = `${process.env.WEB_URL}/api/verify-email/${token}`;

  await EmailVerification.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 3600000) // Token expires in 1 hour
  });

  const emailFrom = process.env.EMAIL_VERIFICATION_USER

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: 'Verify Your Email Address',
    text: `Please click on the following link to verify your email address: ${verificationUrl}`,
    html: `<p>Please click on the following link to verify your email address:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  const sentResponse = await sendThrottledEmail(emailTransport, mailOptions);
  return sentResponse;
}
