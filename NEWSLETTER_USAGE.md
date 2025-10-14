# Newsletter Concert Alert System - Usage Guide

## Overview

The newsletter system automatically manages concert alerts for Arvid Einarsson's subscribers. When a new concert is added to Google Calendar, you can send beautiful email notifications to all subscribers.

## Features

✅ **Subscriber Management** - Stores names and emails in Google Sheets
✅ **Concert Alert Emails** - Sends styled emails matching website aesthetic
✅ **Unsubscribe Functionality** - One-click unsubscribe for users
✅ **Duplicate Prevention** - Tracks sent concerts to avoid duplicate emails
✅ **Admin Authentication** - Secure endpoint with token protection

---

## Setup

### 1. Google Sheets Structure

Your Google Sheets should have **two sheets**:

**Sheet1** (Subscribers):
```
Column A: Email
Column B: Name
Column C: Timestamp
```

**SentConcerts** (Tracking):
```
Column A: Concert ID
Column B: Sent Timestamp
```

Create the second sheet manually:
1. Open your Google Sheet
2. Click the "+" button at the bottom to add a new sheet
3. Rename it to "SentConcerts"

### 2. Environment Variables

All required variables are already set in `.env.local`:
```env
GOOGLE_SHEETS_NEWSLETTER_ID=1BMetHuedsJPTEq6jHEKVU_k386kdcawy3iTLBFi9r-4
ADMIN_AUTH_TOKEN=arvid-secret-token-2025
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important for Production:**
- Change `ADMIN_AUTH_TOKEN` to a secure random string
- Update `NEXT_PUBLIC_BASE_URL` to your actual domain

---

## How to Use

### Send Concert Alert to All Subscribers

**Method 1: Send Latest Concert**

Use this to send the most recent upcoming concert:

```bash
curl -X POST http://localhost:3000/api/newsletter/send-concert-alert \
  -H "Content-Type: application/json" \
  -d '{"authToken": "arvid-secret-token-2025"}'
```

**Method 2: Send Specific Concert**

If you want to send a specific concert by ID:

```bash
curl -X POST http://localhost:3000/api/newsletter/send-concert-alert \
  -H "Content-Type: application/json" \
  -d '{
    "authToken": "arvid-secret-token-2025",
    "concertId": "your-concert-id-here"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Concert alert sent to 45 subscribers",
  "stats": {
    "total": 45,
    "successful": 45,
    "failed": 0
  },
  "concert": {
    "id": "abc123",
    "title": "Torsjö Live 2025",
    "date": "March 15, 2025"
  }
}
```

---

## Email Template

The concert alert email includes:

- **Artist Name Header** - "ARVID EINARSSON" with "NEW SHOW" subtitle
- **Concert Image** - First image from Google Drive (if available)
- **Concert Details:**
  - Concert Title
  - Venue
  - City (auto-extracted from venue or description)
  - Date
  - Time
- **Get Tickets Button** - Links to ticket URL (if available)
- **Unsubscribe Link** - One-click unsubscribe

### Color Scheme

The email matches the website's Nordic aesthetic:
- Background: `#121212` (Dark)
- Header: `#e8e8e8` (Light Gray)
- Accent: `#60a5fa` (Blue)
- Text: `#e8e8e8` (Light)
- Borders: `#333333` (Dark Gray)

---

## Testing

### 1. Test Newsletter Signup

Navigate to your website and use the Newsletter Form component:

```javascript
import NewsletterForm from '@/components/NewsletterForm';

// In your page/component
<NewsletterForm />
```

Or test via API:

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }'
```

### 2. Test Concert Alert

First, ensure you have concerts in your Google Calendar, then:

```bash
curl -X POST http://localhost:3000/api/newsletter/send-concert-alert \
  -H "Content-Type: application/json" \
  -d '{"authToken": "arvid-secret-token-2025"}'
```

### 3. Test Unsubscribe

Visit in browser:
```
http://localhost:3000/api/newsletter/unsubscribe?email=test@example.com
```

---

## Workflow

1. **Add Concert to Google Calendar**
   - Use tag format: `(CONCERT)` or include keywords like "konsert"
   - Add venue, date, time
   - Include ticket URL in description
   - Upload images to Google Drive "Konsert Bilder" folder

2. **Concert Appears on Website**
   - Automatically fetched every 24 hours
   - Displays in navigation banner and home page

3. **Send Newsletter Alert**
   - Run the curl command with your admin token
   - All subscribers receive styled email
   - Concert ID logged to prevent duplicates

4. **Users Can Unsubscribe**
   - Click link in email footer
   - Automatically removed from Google Sheets

---

## Security Notes

⚠️ **Important:**

1. **Admin Token** - Keep `ADMIN_AUTH_TOKEN` secret. Change it before going to production.
2. **Google Sheets** - Current setup uses API key (simple but less secure). For production, consider using a Service Account.
3. **Rate Limiting** - No rate limiting implemented. Consider adding for production.
4. **Email Sending** - Uses Resend's free tier. Monitor usage limits.

---

## Troubleshooting

### "No subscribers found"
- Check Google Sheets ID is correct
- Verify Sheet1 has data starting from row 2 (row 1 is headers)
- Ensure column A contains valid emails

### "Concert not found"
- Verify concerts are in Google Calendar
- Check calendar ID in `.env.local`
- Ensure concert has proper tag or keywords

### "Unauthorized"
- Verify `authToken` matches `ADMIN_AUTH_TOKEN` in `.env.local`
- Check for typos in the token

### Emails not sending
- Verify `RESEND_API_KEY` is valid
- Check Resend dashboard for errors
- Ensure "from" email is verified in Resend

### Unsubscribe not working
- Check Google Sheets API permissions
- Verify the email exists in the spreadsheet
- Look for errors in server logs

---

## Future Enhancements

Possible improvements:

- [ ] Admin dashboard to send newsletters via UI
- [ ] Welcome email for new subscribers
- [ ] Email preview before sending
- [ ] Scheduled automatic sends when new concert added
- [ ] A/B testing for subject lines
- [ ] Analytics tracking (open rates, click rates)
- [ ] Multi-language support (Swedish/English)
- [ ] Custom email templates per concert type

---

## Support

For issues or questions:
- Email: malte.binz@gmail.com
- Check server logs for detailed error messages
- Verify all environment variables are set correctly
