import { Resend } from 'resend';
import config from 'src/config';

const apiKey = config.RESEND_API_KEY;
const from = config.RESEND_FROM_EMAIL;
const resend = new Resend(apiKey);

export async function sendOtpEmail(email: string, otp: string) {
  await resend.emails.send({
    from,
    to: email,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  });
}
