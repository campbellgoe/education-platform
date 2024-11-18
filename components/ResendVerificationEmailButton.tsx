'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendVerificationEmail } from '@/app/actions/sendVerificationEmail';

export default function ResendVerificationEmail(formData: FormData) {
  const [loading, setLoading] = useState('Resend Verification Email');
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setLoading('Sending...');
    setMessage('');
    try {
      if(formData.has("email") && formData.has("captchaToken")){
        const result = await sendVerificationEmail(null, formData);
        if (result.success) {
          setMessage('Verification email sent successfully. Please check your inbox.');
        } else {
          setMessage('Failed to send verification email. Please try again later.');
        }
      } else {
        setMessage('Email and captcha token are required.');
      }
    } catch (error) {
      console.error(error)
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading('Try again later')
      setTimeout(() => {
        setLoading('Resend Verification Email');
      }, 1000*45)
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={handleResend} disabled={loading !== 'Resend Verification Email'}>
        {loading}
      </Button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}