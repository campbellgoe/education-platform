'use client'

import { useState } from 'react';
import ResendVerificationEmail from '@/components/ResendVerificationEmailButton';

export default function RegistrationConfirmation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Registration Successful</h1>
      <p className="mb-4">
        Please check your email to verify your account. If you haven't received the email, you can request a new one below.
      </p>
      <ResendVerificationEmail formData={formData} />
    </div>
  );
}