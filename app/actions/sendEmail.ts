"use server"
import dbConnect from "@/lib/dbConnect";
import { PasswordReset } from "@/models/PasswordReset";
import User from "@/models/User";
// import token from "@/utils/basic-auth-token";
import LeakyBucket from 'leaky-bucket';
import { makeForwardEmailNetTransporter } from "./_makeTransport";

export async function sendThrottledEmail(transporter: any = makeForwardEmailNetTransporter(process.env.EMAIL_DEFAULT_USER, process.env.EMAIL_DEFAULT_PASS), mailOptions: any, fnBeforeSend?: any, fnAfterSend?: any) {
  let response;
  try {
    
    // a leaky bucket, that will burst 3 items, then will throttle the items to one per minute
    try {
      const bucket = new LeakyBucket({
        capacity: 3,
        interval: 60, // 60 seconds
      });
      await bucket.throttle();
    } catch (err:any) {
      throw 'Rate limit exceeded, try again in a moment. '+err.message
    }
    await fnBeforeSend?.()
    console.log('sending email', mailOptions)
    response = await transporter.sendMail(mailOptions)
    await fnAfterSend?.(response)
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
async function checkCapctchaValidation(captchaToken: string) {
  const captchaValidationResponse = await validateCaptcha(captchaToken);
  if (
    captchaValidationResponse &&
    captchaValidationResponse.success &&
    captchaValidationResponse.score > 0.5
  ) {
    return true
  }
  return false
}
export async function verifyCaptchaAndCheckEmailExistenceAndGetUser(formData: FormData): Promise<any> {
  await dbConnect()
  const email = formData.get('email')?.toString()
  const captchaToken = formData.get('captchaToken')?.toString()
  const user = await User.findOne({ email })
  if(!user){
    throw 'No user found with this email address.'
  }
  if (email && captchaToken) {
    const isValid = await checkCapctchaValidation(captchaToken)
    if (
      isValid
    ) {
      return [user, email]
    } else {
      throw "Failed to validate captcha"
    }
  }
}
const passwordResetEmailTransport = makeForwardEmailNetTransporter(process.env.EMAIL_RESET_USER, process.env.EMAIL_RESET_PASS)
export async function sendPasswordResetEmail(prevState: any, formData: FormData) {
  await dbConnect()
  const [user, email] = await verifyCaptchaAndCheckEmailExistenceAndGetUser(formData)
    const emailTo = email;
    const emailFrom = process.env.EMAIL_RESET_USER;
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
  const sentResponse = await sendThrottledEmail(passwordResetEmailTransport, mailOptions)
  return sentResponse
  // throw "Failed to send email"

}

async function validateCaptcha(captchaToken: string) {
  try {
    // Verify that both captchaToken and MASSLESS_RECAPTCHA_SECRET_KEY were set.
    if (captchaToken && process.env.MASSLESS_RECAPTCHA_SECRET_KEY) {
      console.log("Validating captcha...");
      // Validate captcha.
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?${new URLSearchParams({
          secret: process.env.MASSLESS_RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        })}`,
        {
          method: "POST",
        }
      );

      return response.json();
    } else {
      // Show in the console if needed values are not set.
      console.log(
        "captchaToken or RECAPTCHA_SECRET_KEY not set. Captcha could not be validated"
      );
    }
  } catch (err) {
    console.error("Failed to validate captcha", err);
  }
  return null
}