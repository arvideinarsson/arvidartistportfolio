import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface Concert {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  images: string[];
  ticketUrl?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authToken } = body;

    // Simple authentication check (you should use a proper auth token)
    const ADMIN_TOKEN = process.env.ADMIN_AUTH_TOKEN || 'change-this-token';
    if (authToken !== ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all subscribers from Google Sheets
    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Missing Google Sheets configuration' },
        { status: 500 }
      );
    }

    // Load service account credentials
    const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/calendar.readonly'
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get all subscribers
    const subscribersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'SubscriberList!A:C', // Email, Name, Timestamp
    });

    const rows = subscribersResponse.data.values || [];

    // Skip header row and extract emails
    const subscribers = rows
      .slice(1)
      .map(row => row[0])
      .filter(email => email && email.includes('@'));

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found' },
        { status: 404 }
      );
    }

    // Fetch concerts directly from Google Calendar API
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      return NextResponse.json(
        { error: 'Missing Google Calendar configuration' },
        { status: 500 }
      );
    }

    // Fetch upcoming concerts using authenticated client
    const calendar = google.calendar({ version: 'v3', auth });

    const now = new Date().toISOString();
    const calendarResponse = await calendar.events.list({
      calendarId: calendarId,
      timeMin: now,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 20
    });

    const events = calendarResponse.data.items || [];

    // Filter for concert events
    const concertEvents = events.filter((event) => {
      const title = event.summary || '';
      const lowerTitle = title.toLowerCase();
      const hasParenthesesTag = /^\([^)]+\)/i.test(title);
      const hasKeyword = lowerTitle.includes('concert') || lowerTitle.includes('konsert');
      return hasParenthesesTag || hasKeyword;
    });

    if (concertEvents.length === 0) {
      return NextResponse.json(
        { error: 'No upcoming concerts found' },
        { status: 404 }
      );
    }

    // Get the first (latest) concert
    const event = concertEvents[0];
    const title = event.summary || '';
    let venue = event.location || 'TBA';
    let cleanTitle = title.replace(/\([^)]*\)/g, '').trim();

    // Extract venue from title if format is "Title at Venue"
    const atMatch = cleanTitle.match(/(.+?)\s+at\s+(.+)/i);
    if (atMatch) {
      cleanTitle = atMatch[1].trim();
      venue = atMatch[2].trim();
    }

    // Format date and time
    const startDateTime = event.start?.dateTime || event.start?.date;
    let date = 'TBA';
    let time = 'TBA';

    if (startDateTime) {
      const startDate = new Date(startDateTime);
      date = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (event.start?.dateTime) {
        time = startDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    }

    // Extract ticket URL from description
    const description = event.description || '';
    let ticketUrl: string | undefined;
    const urlRegex = /https?:\/\/[^\s<>"']+/gi;
    const urlMatches = description.match(urlRegex);
    if (urlMatches && urlMatches.length > 0) {
      ticketUrl = urlMatches[0];
    }

    const concert: Concert = {
      id: event.id || '',
      title: cleanTitle,
      venue: venue,
      date: date,
      time: time,
      description: description,
      images: [],
      ticketUrl: ticketUrl
    };

    // Extract city from venue or description
    const city = extractCity(concert.venue, concert.description);

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (email) => {
      // Simple HTML email template
      const emailHtml = `
        <div style="background-color: #121212; color: #e8e8e8; padding: 40px; font-family: Arial, sans-serif;">
          <div style="background-color: #e8e8e8; padding: 30px; text-align: center;">
            <h1 style="color: #121212; margin: 0;">ARVID EINARSSON</h1>
            <p style="color: #60a5fa; margin: 10px 0 0 0;">NEW CONCERT</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #e8e8e8;">${concert.title}</h2>
            <p style="color: #e8e8e8;">Venue: ${concert.venue}</p>
            <p style="color: #e8e8e8;">City: ${city}</p>
            <p style="color: #e8e8e8;">Date: ${concert.date}</p>
            <p style="color: #e8e8e8;">Time: ${concert.time}</p>
            ${concert.ticketUrl ? `<a href="${concert.ticketUrl}" style="display: inline-block; background-color: #60a5fa; color: #121212; padding: 15px 40px; text-decoration: none; margin-top: 20px;">GET TICKETS</a>` : ''}
          </div>
        </div>
      `;

      console.log(`Attempting to send email to: ${email}`);

      // TEMPORARY: For testing purposes, send to Arvid's email only
      // Once domain is verified on Resend, remove this line and use 'email' variable
      const testEmail = 'arvideinarssonartist@gmail.com';

      const result = await resend.emails.send({
        from: 'Arvid Einarsson <onboarding@resend.dev>',
        to: testEmail, // Using testEmail for now due to Resend verification limits
        subject: `New Concert: ${concert.title} - ${concert.date}`,
        html: emailHtml,
      });

      console.log(`Resend API response for ${email}:`, JSON.stringify(result, null, 2));

      return result;
    });

    const results = await Promise.allSettled(emailPromises);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Log any errors
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Email ${index + 1} failed:`, result.reason);
      }
    });

    // Log the sent concert ID to prevent duplicate sends (you can store this in Google Sheets)
    await logSentConcert(concert.id, spreadsheetId, auth);

    return NextResponse.json({
      success: true,
      message: `Concert alert sent to ${successful} subscribers`,
      stats: {
        total: subscribers.length,
        successful,
        failed,
      },
      concert: {
        id: concert.id,
        title: concert.title,
        date: concert.date,
      },
    });

  } catch (error) {
    console.error('Error sending concert alerts:', error);
    return NextResponse.json(
      { error: 'Failed to send concert alerts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to extract city from venue or description
function extractCity(venue: string, description: string): string {
  // Try to extract city from venue (e.g., "Venue Name, Stockholm")
  const venueMatch = venue.match(/,\s*([^,]+)$/);
  if (venueMatch) {
    return venueMatch[1].trim();
  }

  // Common Swedish cities
  const cities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Södertälje', 'Eskilstuna', 'Karlstad', 'Hässleholm'];

  for (const city of cities) {
    if (venue.includes(city) || description.includes(city)) {
      return city;
    }
  }

  return 'Sweden';
}

// Helper function to log sent concerts (prevents duplicate sends)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logSentConcert(concertId: string, spreadsheetId: string, auth: any) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    // Append to a "SentConcerts" sheet or create a second sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'SentConcerts!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[concertId, new Date().toISOString()]]
      }
    });
  } catch (error) {
    console.error('Error logging sent concert:', error);
    // Don't throw - this is just for tracking
  }
}
