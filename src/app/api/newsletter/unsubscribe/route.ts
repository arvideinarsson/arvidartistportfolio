import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_NEWSLETTER_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Missing Google Sheets configuration' },
        { status: 500 }
      );
    }

    // Load service account credentials from environment variable or file
    let auth;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (serviceAccountJson) {
      // Production: use environment variable
      const credentials = JSON.parse(serviceAccountJson);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } else {
      // Development: use local file
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
      auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    }

    const sheets = google.sheets({ version: 'v4', auth });

    // Get all subscribers to find the row with this email
    const subscribersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'SubscriberList!A:C',
    });

    const rows = subscribersResponse.data.values || [];

    // Find the row index (1-based) of the email
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === email) {
        rowIndex = i + 1; // +1 because sheets are 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'Email not found in subscriber list' },
        { status: 404 }
      );
    }

    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming first sheet
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-indexed for API
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });

    // Return a simple HTML page confirming unsubscribe
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed - Arvid Einarsson</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #121212;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            text-align: center;
            padding: 40px;
            max-width: 500px;
          }
          h1 {
            color: #e8e8e8;
            font-size: 32px;
            margin-bottom: 20px;
          }
          p {
            color: #999999;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          a {
            display: inline-block;
            background-color: #60a5fa;
            color: #121212;
            text-decoration: none;
            padding: 14px 32px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 1px;
            border-radius: 4px;
          }
          a:hover {
            background-color: #4a90e2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Successfully Unsubscribed</h1>
          <p>You have been removed from Arvid Einarsson's concert alert mailing list.</p>
          <p>We're sorry to see you go!</p>
          <a href="https://www.arvideinarsson.com">Visit Website</a>
        </div>
      </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
