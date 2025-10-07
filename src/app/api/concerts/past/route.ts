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

    const cleanTitle = concertTitle
      .replace(/\[CONCERT\]/gi, '')
      .replace(/\(CONCERT\)/gi, '')
      .trim();

    // Search for concert folder within parent folder
    const folderSearchUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name contains '${encodeURIComponent(cleanTitle)}'&key=${apiKey}`;
    const folderResponse = await fetch(folderSearchUrl, {
      headers: {
        'Referer': 'http://localhost:3000'
      }
    });

    if (!folderResponse.ok) {
      console.warn('Could not search concert folders:', folderResponse.status);
      return [];
    }

    const folderData = await folderResponse.json();
    const concertFolders = folderData.files || [];

    if (concertFolders.length === 0) {
      const firstWord = cleanTitle.split(' ')[0];
      if (firstWord && firstWord.length > 2) {
        const altSearchUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name contains '${encodeURIComponent(firstWord)}'&key=${apiKey}`;
        const altResponse = await fetch(altSearchUrl);
        if (altResponse.ok) {
          const altData = await altResponse.json();
          const altFolders = altData.files || [];
          if (altFolders.length > 0) {
            concertFolders.push(altFolders[0]);
          }
        }
      }
    }

    if (concertFolders.length === 0) {
      console.warn(`No folder found for concert: ${cleanTitle}`);
      return [];
    }

    const concertFolderId = concertFolders[0].id;

    // Get images from concert folder
    const imagesSearchUrl = `https://www.googleapis.com/drive/v3/files?q='${concertFolderId}' in parents and (mimeType contains 'image/')&fields=files(id,name,webViewLink,webContentLink)&key=${apiKey}`;
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
    const imageFiles = imagesData.files || [];

    const imageUrls = imageFiles
      .slice(0, 5)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((file: any) => {
        return `https://drive.google.com/uc?export=view&id=${file.id}`;
      });

    console.log(`Found ${imageUrls.length} images for concert: ${cleanTitle}`);
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

    if (!apiKey || !calendarId) {
      return NextResponse.json(
        { concerts: [], lastUpdated: new Date().toISOString(), source: 'error' },
        { status: 200 }
      );
    }

    // Fetch past events from Google Calendar (events that have ended)
    const now = new Date().toISOString();
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMax=${now}&singleEvents=true&orderBy=startTime&maxResults=50`;

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

    // Filter for concert events
    const concertEvents = events.filter((event: GoogleCalendarEvent) => {
      const title = event.summary || '';
      return title.includes(tagFilter) ||
             title.includes('[CONCERT]') ||
             title.includes('(CONCERT)') ||
             title.toLowerCase().includes('concert') ||
             title.toLowerCase().includes('performance') ||
             title.toLowerCase().includes('recital');
    });

    // Transform to concert format
    const concerts: Concert[] = [];

    // Get the most recent 20 past concerts
    const recentPastConcerts = concertEvents.slice(-20).reverse();

    for (const event of recentPastConcerts) {
      const title = event.summary || '';
      let venue = event.location || 'TBA';
      let cleanTitle = title
        .replace(tagFilter, '')
        .replace('[CONCERT]', '')
        .replace('(CONCERT)', '')
        .trim();

      const atMatch = cleanTitle.match(/(.+?)\s+at\s+(.+)/i);
      if (atMatch) {
        cleanTitle = atMatch[1].trim();
        venue = atMatch[2].trim();
      }

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

      const description = event.description || '';

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
    console.error('Google Calendar API error (past concerts):', error);

    return NextResponse.json({
      concerts: [],
      lastUpdated: new Date().toISOString(),
      source: 'error',
      error: 'Failed to fetch past concerts'
    });
  }
}
