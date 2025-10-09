import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');

  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send notification email to Arvid about new subscriber
    const data = await resend.emails.send({
      from: 'Newsletter <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'arvideinarssonartist@gmail.com',
      subject: 'New Newsletter Subscriber',
      text: `New newsletter subscriber:\n\nEmail: ${email}\n\nAdd this email to your mailing list for concert and release updates.`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
