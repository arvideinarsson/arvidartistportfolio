# Google Calendar API Setup Instructions

## What I've Built

I've successfully integrated Google Calendar API into your Arvid Einarsson portfolio with:

✅ **Environment configuration** (`.env.local`)
✅ **API endpoint** (`/api/concerts/route.ts`)
✅ **Concert filtering** (only shows `[CONCERT]` tagged events)
✅ **24-hour caching system** with auto-refresh
✅ **Error handling** with fallback data
✅ **Loading states** and skeleton UI
✅ **Live data integration** with existing modal system

## Your Next Steps

### Step 1: Get Google Calendar API Credentials (15 minutes)

1. **Create Google Cloud Project:**
   - Go to: https://console.cloud.google.com/
   - Click "New Project" → Name it "Arvid Portfolio Calendar"
   - Click "Create"

2. **Enable Google Calendar API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google Calendar API" → Click "Enable"

3. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ Create Credentials" → "API Key"
   - **COPY THE API KEY** immediately
   - Click "Restrict Key":
     - Name: "Arvid Portfolio API Key"
     - API restrictions: Select "Google Calendar API" only
     - Website restrictions: Add `http://localhost:3000/*`

### Step 2: Create Concert Calendar (10 minutes)

1. **Create Calendar:**
   - Go to: https://calendar.google.com/
   - Left sidebar → "+" next to "Other calendars" → "Create new calendar"
   - Name: "Arvid Einarsson - Concerts"
   - ✅ **Make calendar public** (important!)
   - Click "Create Calendar"

2. **Get Calendar ID:**
   - Find your new calendar → Click three dots (⋮) → "Settings and sharing"
   - Scroll to "Integrate calendar"
   - **COPY THE CALENDAR ID** (looks like: `abc123@group.calendar.google.com`)

3. **Add Test Events:**
   - **Concert Event:** `[CONCERT] Spring Recital at Stockholm Concert Hall`
   - **Date:** Next week, 7:00 PM - 9:00 PM
   - **Location:** Stockholm Concert Hall, Sweden
   - **Description:** An evening of contemporary Nordic compositions

### Step 3: Configure Your App

1. **Update `.env.local` file:**
   ```bash
   NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
   ```

2. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

### Step 4: Test Integration

1. **Open your website:** http://localhost:3000
2. **Check browser console** (F12) for messages like:
   ```
   🎼 Fetching concerts from Google Calendar...
   ✅ Found 1 upcoming concerts
   ```
3. **Test manual refresh:** In console, run: `refreshConcerts()`

## How It Works

- **Automatic Updates:** Concerts refresh every 24 hours
- **Concert Filtering:** Only events with `[CONCERT]` in title appear
- **Caching:** Reduces API calls and improves performance
- **Fallback:** Shows backup data if API fails
- **Visual Indicators:**
  - 🟢 Green dot = Live Google Calendar data
  - 🟡 Yellow dot = Cached data
  - 🟠 Orange dot = Fallback data

## Adding Concerts

**Title Format:** `[CONCERT] Event Name at Venue Name`
**Examples:**
- `[CONCERT] Jazz Night at Malmö Live`
- `[CONCERT] Spring Recital at Stockholm Concert Hall`

Events **without** `[CONCERT]` tag won't appear on your website.

## Troubleshooting

**No concerts showing:**
- Ensure events have `[CONCERT]` in title
- Check calendar is public
- Verify API key and Calendar ID are correct
- Run `refreshConcerts()` in browser console

**API errors:**
- Check browser console for error messages
- Verify API key restrictions include your domain
- Ensure Google Calendar API is enabled

## Production Deployment

When you deploy to production:
1. Update API key restrictions to include your live domain
2. Set the same environment variables in your hosting platform
3. Test the live site functionality

The integration is now complete and ready to use! 🎉