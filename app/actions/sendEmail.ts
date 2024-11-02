"use server"
import dbConnect from "@/lib/dbConnect";
import { PasswordReset } from "@/models/PasswordReset";
import User from "@/models/User";
import token from "@/utils/basic-auth-token";
import LeakyBucket from 'leaky-bucket';

const emailApiUrl = 'https://api.forwardemail.net'
const emailApiToken = process.env.EMAIL_API_TOKEN || '';



async function sendEmailReally(mailOptions: any, authPass: string) {
  let response;
  try {
    
    // a leaky bucket, that will burst 5 items, then will throttle the items to one per hour
    const bucket = new LeakyBucket({
      capacity: 4,
      interval: 60*60, // 60 seconds * 60 minutes
    });
    await bucket.throttle();
    const url = emailApiUrl + '/v1/emails'
    console.log(url)
    console.log(mailOptions)
    response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(mailOptions),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + token(emailApiToken, authPass),
      }
    })
  } catch (err) {

    console.error("unable to send email", err)
  }
  if (response) {

    try {
      response = await response.json()
    } catch (err) {
      console.error("unable to parse send email response json", err)
    }
    console.log('json response', response)
    if (response) {
      return response
    }
  }
}
export async function sendPasswordResetEmail(prevState: any, formData: FormData) {
  await dbConnect()
  // const captchaToken = formData.get('captchaToken')?.toString()
  const email = formData.get('email')?.toString()
  const user = await User.findOne({ email })
  if(!user){
    throw 'No user found with this email address.'
  }
  if (email) {
    const emailTo = email;
    const emailFrom = process.env.EMAIL_RESET_FROM;
    const authPass = process.env.EMAIL_RESET_PASS || ''
    const token = crypto.randomUUID();
    // // Define email options
    const mailOptions = {
      from: emailFrom,
      to: emailTo,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${process.env.WEB_URL}/reset-password/${token}`,
    };
    // Save the token in the database with an expiration time
    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 3600000) // Token expires in 1 hour
    })
    // Send password reset email
    const sentResponse = await sendEmailReally(mailOptions, authPass)
    return sentResponse
  
  }
  throw "Failed to send password reset email"
}

// async function validateCaptcha(captchaToken: string) {
//   try {
//     // Verify that both captchaToken and MASSLESS_RECAPTCHA_SECRET_KEY were set.
//     if (captchaToken && process.env.MASSLESS_RECAPTCHA_SECRET_KEY) {
//       console.log("Validating captcha...");
//       // Validate captcha.
//       const response = await fetch(
//         `https://www.google.com/recaptcha/api/siteverify?${new URLSearchParams({
//           secret: process.env.MASSLESS_RECAPTCHA_SECRET_KEY,
//           response: captchaToken,
//         })}`,
//         {
//           method: "POST",
//         }
//       );

//       return response.json();
//     } else {
//       // Show in the console if needed values are not set.
//       console.log(
//         "captchaToken or RECAPTCHA_SECRET_KEY not set. Captcha could not be validated"
//       );
//     }
//   } catch (err) {
//     console.error("Failed to validate captcha", err);
//   }
//   return null
// }