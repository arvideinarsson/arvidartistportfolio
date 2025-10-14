import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '');

  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Add to Google Sheets using Service Account
    try {
      const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

      if (spreadsheetId) {
        const timestamp = new Date().toISOString();

        // Load service account credentials
        const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
        const auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'SubscriberList!A:C',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[email, name, timestamp]]
          }
        });

        console.log('✅ Successfully added to Google Sheets');
      }
    } catch (sheetError) {
      console.error('Error adding to Google Sheets:', sheetError);
      // Continue even if sheets fails - still send notification email
    }

    // Send notification email to Arvid about new subscriber
    const data = await resend.emails.send({
      from: 'Newsletter <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'arvideinarssonartist@gmail.com',
      subject: 'New Newsletter Subscriber',
      text: `New newsletter subscriber:\n\nName: ${name}\nEmail: ${email}\n\nSubscribed at: ${new Date().toLocaleString()}\n\nThis subscriber has been added to your Google Sheets.`,
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
