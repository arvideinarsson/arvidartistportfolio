import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Initialize Resend inside the function to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  try {
    const { email, subject, message } = await request.json();

    // Validate input
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Send email with text format (not HTML/React)
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'arvideinarssonartist@gmail.com',
      replyTo: email,
      subject: subject,
      text: `New Contact Form Submission\n\nFrom: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
