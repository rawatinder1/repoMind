import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, 
  },
});

interface SendMailParams {
  to: string;
  senderName: string;
  projectName: string;
  projectlink: string;
}

export async function sendMail({
  to,
  senderName,
  projectName,
  projectlink,
}: SendMailParams) {
  console.log('Attempting to send email to:', to);
  console.log('Gmail user:', process.env.GMAIL_USER);
  console.log('App password exists:', !!process.env.GMAIL_APP_PASSWORD);

  const subject = "You've been invited to collaborate on a RepoMind project";
  const text = `Hi there!

${senderName} has invited you to collaborate on "${projectName}" using RepoMind.

Click here to join: ${projectlink}

Best regards,
The RepoMind Team`;

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    });
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, info };
  } catch (error:any ) {
    console.error('Detailed email error:', error); 
    return { success: false, error: error.message };
  }
}