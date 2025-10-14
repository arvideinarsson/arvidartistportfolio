# Newsletter Google Sheets Setup Guide

This guide will help you set up Google Sheets to store newsletter subscribers.

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Newsletter Subscribers"
4. In the first row, add headers:
   - Cell A1: `Email`
   - Cell B1: `Subscribed At`

## Step 2: Make the Spreadsheet Publicly Writable

1. Click the "Share" button in the top-right corner
2. Under "General access", change from "Restricted" to "Anyone with the link"
3. Change the permission from "Viewer" to "Editor"
4. Click "Done"

**Important:** This allows the API to write to the sheet using just an API key. If you want more security, you'll need to set up a Service Account (more complex).

## Step 3: Get the Spreadsheet ID

1. Look at the URL of your spreadsheet
2. The URL format is: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part (the long string between `/d/` and `/edit`)

Example:
```
https://docs.google.com/spreadsheets/d/1abc123xyz456/edit
                                    ^^^^^^^^^^^^
                                    This is your ID
```

## Step 4: Add Environment Variable

Add this line to your `.env.local` file:

```
GOOGLE_SHEETS_NEWSLETTER_ID=your_spreadsheet_id_here
```

Replace `your_spreadsheet_id_here` with the ID you copied in Step 3.

## Step 5: Test It

1. Restart your development server (`npm run dev`)
2. Go to your website
3. Open the navigation menu
4. Enter an email in the newsletter signup form
5. Click Subscribe
6. Check your Google Sheet - the email should appear with a timestamp!

## How It Works

When someone subscribes:
1. Their email is validated
2. The email and timestamp are added to your Google Sheet
3. You receive an email notification at your contact email
4. The user sees a success message

## Troubleshooting

**Problem:** Emails aren't being added to the sheet

**Solutions:**
- Make sure the spreadsheet is set to "Anyone with the link can edit"
- Verify the `GOOGLE_SHEETS_NEWSLETTER_ID` is correct in `.env.local`
- Check that `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY` is set (it uses the same API key as your calendar)
- Look at the server console for error messages

**Problem:** I want more security

**Solution:** You can set up a Google Service Account for more secure access. This requires:
1. Creating a service account in Google Cloud Console
2. Downloading the credentials JSON
3. Sharing the spreadsheet with the service account email
4. Updating the code to use service account authentication

Let me know if you need help with this more secure setup!
