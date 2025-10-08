import { NextResponse } from 'next/server';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  description?: string;
  htmlLink: string;
}

interface Concert {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  images: string[];
  ticketUrl?: string;
  details?: {
    price?: string;
    duration?: string;
    genre?: string;
  };
}

async function fetchConcertImages(concertTitle: string, apiKey: string): Promise<string[]> {
  try {
    const parentFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_PARENT_FOLDER_ID;

    if (!parentFolderId) {
      console.warn('No parent folder ID provided');
      return [];
    }

    // Clean concert title - remove all tags in parentheses
    const cleanTitle = concertTitle
      .replace(/\([^)]*\)/g, '')
      .trim();

    // Search for images directly in "Konsert Bilder" folder that contain the concert title in the filename
    const imagesSearchUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and (mimeType contains 'image/') and name contains '${encodeURIComponent(cleanTitle)}'&fields=files(id,name,webViewLink,webContentLink)&key=${apiKey}`;
    const imagesResponse = await fetch(imagesSearchUrl, {
      headers: {
        'Referer': 'http://localhost:3000'
      }
    });

    if (!imagesResponse.ok) {
      console.warn('Could not fetch images:', imagesResponse.status);
      return [];
    }

    const imagesData = await imagesResponse.json();
    let imageFiles = imagesData.files || [];

    // If no exact match, try searching with just the first word
    if (imageFiles.length === 0) {
      const firstWord = cleanTitle.split(' ')[0];
      if (firstWord && firstWord.length > 2) {
        const altSearchUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and (mimeType contains 'image/') and name contains '${encodeURIComponent(firstWord)}'&fields=files(id,name,webViewLink,webContentLink)&key=${apiKey}`;
        const altResponse = await fetch(altSearchUrl);
        if (altResponse.ok) {
          const altData = await altResponse.json();
          imageFiles = altData.files || [];
        }
      }
    }

    // Convert to public URLs
    const imageUrls = imageFiles
      .slice(0, 5) // Limit to 5 images per concert
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((file: any) => {
        // Use thumbnail URL which works better for direct embedding
        return `https://lh3.googleusercontent.com/d/${file.id}`;
      });

    return imageUrls;

  } catch (error) {
    console.warn('Error fetching concert images:', error);
    return [];
  }
}

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const tagFilter = process.env.NEXT_PUBLIC_CONCERT_TAG_FILTER || '[CONCERT]';
    const maxConcerts = parseInt(process.env.NEXT_PUBLIC_MAX_CONCERTS_DISPLAY || '5');

    if (!apiKey || !calendarId) {
      return NextResponse.json(
        { error: 'Missing API credentials' },
        { status: 500 }
      );
    }

    // Format current time for API
    const now = new Date().toISOString();

    // Fetch upcoming events from Google Calendar
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=20`;

    const response = await fetch(calendarUrl, {
      headers: {
        'Referer': 'http://localhost:3000'
      }
    });

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    const events: GoogleCalendarEvent[] = data.items || [];

    // Filter for concert events - any event with tags in parentheses OR specific keywords
    const concertEvents = events.filter((event: GoogleCalendarEvent) => {
      const title = event.summary || '';
      const lowerTitle = title.toLowerCase();

      // Check if title has any tag in parentheses at the start (case-insensitive)
      const hasParenthesesTag = /^\([^)]+\)/i.test(title);

      // Check for specific keywords
      const hasKeyword = lowerTitle.includes('concert') ||
                        lowerTitle.includes('konsert') ||
                        lowerTitle.includes('event') ||
                        lowerTitle.includes('performance') ||
                        lowerTitle.includes('recital');

      return hasParenthesesTag || hasKeyword;
    });

    // Transform to our concert format with images
    const concerts: Concert[] = [];

    for (const event of concertEvents.slice(0, maxConcerts)) {
        // Extract venue from title or use location
        const title = event.summary || '';
        let venue = event.location || 'TBA';
        // Remove all tags in parentheses from title
        let cleanTitle = title
          .replace(/\([^)]*\)/g, '')
          .trim();

        // Try to extract venue from title (format: "Title at Venue")
        const atMatch = cleanTitle.match(/(.+?)\s+at\s+(.+)/i);
        if (atMatch) {
          cleanTitle = atMatch[1].trim();
          venue = atMatch[2].trim();
        }

        // Format date and time
        const startDateTime = event.start.dateTime || event.start.date;
        const endDateTime = event.end?.dateTime || event.end?.date;

        let date = 'TBA';
        let time = 'TBA';

        if (startDateTime) {
          const startDate = new Date(startDateTime);
          date = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          if (event.start.dateTime) {
            time = startDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
          }
        }

        // Calculate duration if both start and end times exist
        let duration;
        if (event.start.dateTime && endDateTime) {
          const start = new Date(event.start.dateTime);
          const end = new Date(endDateTime);
          const diffMs = end.getTime() - start.getTime();
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

          if (hours > 0) {
            duration = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
          } else if (minutes > 0) {
            duration = `${minutes}m`;
          }
        }

        // Extract ticket URL from description only
        const description = event.description || 'Concert details to be announced.';
        let ticketUrl: string | undefined;

        // Decode HTML entities first
        const decodedDescription = description
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        // Look for URLs in description (Ticketmaster, venue websites, etc.)
        const urlRegex = /https?:\/\/[^\s<>"']+/gi;
        const urlMatches = decodedDescription.match(urlRegex);

        if (urlMatches && urlMatches.length > 0) {
          // Prefer ticket-related URLs
          const ticketKeywords = ['ticket', 'biljett', 'buy', 'köp', 'purchase', 'event', 'concert', 'konsert'];
          const ticketUrl_found = urlMatches.find(url =>
            ticketKeywords.some(keyword => url.toLowerCase().includes(keyword))
          );

          if (ticketUrl_found) {
            ticketUrl = ticketUrl_found;
          } else {
            // Use the first URL found, but limit to one
            ticketUrl = urlMatches[0];
          }
        }
        // If no URL found in description, leave ticketUrl as undefined

        // Fetch images for this concert
        const images = await fetchConcertImages(cleanTitle, apiKey);

        const concert: Concert = {
          id: event.id,
          title: cleanTitle,
          venue: venue,
          date: date,
          time: time,
          description: description,
          images: images,
          ticketUrl: ticketUrl,
          details: {
            duration: duration,
            genre: 'Contemporary Nordic'
          }
        };

        concerts.push(concert);
    }

    return NextResponse.json({
      concerts,
      lastUpdated: new Date().toISOString(),
      source: 'google-calendar'
    });

  } catch (error) {
    console.error('Google Calendar API error:', error);

    // Return empty array on error
    return NextResponse.json({
      concerts: [],
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Using fallback data due to API error'
    });
  }
}