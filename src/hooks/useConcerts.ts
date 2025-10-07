'use client';

import { useState, useEffect, useCallback } from 'react';

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

interface ConcertResponse {
  concerts: Concert[];
  lastUpdated: string;
  source: 'google-calendar' | 'fallback';
  error?: string;
}

interface CachedData extends ConcertResponse {
  cachedAt: number;
}

export function useConcerts() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [source, setSource] = useState<'google-calendar' | 'fallback' | 'cached'>('google-calendar');

  const CACHE_KEY = 'arvid_concerts_cache';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const fetchConcerts = useCallback(async (useCache = true): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      if (useCache && typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          try {
            const parsed: CachedData = JSON.parse(cachedData);
            const now = Date.now();

            // Use cached data if less than 24 hours old
            if (now - parsed.cachedAt < CACHE_DURATION) {
              setConcerts(parsed.concerts);
              setLastUpdated(parsed.lastUpdated);
              setSource('cached');
              setIsLoading(false);

              console.log('🎵 Using cached concert data');
              return;
            }
          } catch (e) {
            console.warn('Invalid cached data, fetching fresh');
            localStorage.removeItem(CACHE_KEY);
          }
        }
      }

      // Fetch fresh data
      console.log('🎼 Fetching concerts from Google Calendar...');
      const response = await fetch('/api/concerts', {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ConcertResponse = await response.json();

      setConcerts(data.concerts);
      setLastUpdated(data.lastUpdated);
      setSource(data.source);

      // Cache the data with timestamp
      if (typeof window !== 'undefined') {
        const cacheData: CachedData = {
          ...data,
          cachedAt: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }

      if (data.error) {
        console.warn('⚠️ API warning:', data.error);
      } else {
        console.log(`✅ Found ${data.concerts.length} upcoming concerts`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('🚨 Concert fetch error:', errorMessage);
      setError(errorMessage);

      // Try to use cached data as fallback
      if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          try {
            const parsed: CachedData = JSON.parse(cachedData);
            setConcerts(parsed.concerts);
            setLastUpdated(parsed.lastUpdated);
            setSource('cached');
            console.log('🔄 Using cached data as fallback');
          } catch (e) {
            console.error('Failed to load cached data');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [CACHE_KEY, CACHE_DURATION]);

  // Manual refresh function
  const refreshConcerts = useCallback(() => {
    console.log('🔄 Manual refresh triggered...');
    return fetchConcerts(false);
  }, [fetchConcerts]);

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchConcerts();

    // Set up 24-hour auto-refresh
    const refreshInterval = setInterval(() => {
      console.log('🕐 24-hour auto-refresh triggered...');
      fetchConcerts(false);
    }, CACHE_DURATION);

    return () => clearInterval(refreshInterval);
  }, [fetchConcerts, CACHE_DURATION]);

  // Expose global refresh and cache clear functions for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshConcerts = refreshConcerts;
      (window as any).clearConcertCache = () => {
        localStorage.removeItem(CACHE_KEY);
        console.log('🗑️ Concert cache cleared');
        refreshConcerts();
      };
    }
  }, [refreshConcerts, CACHE_KEY]);

  return {
    concerts,
    isLoading,
    error,
    lastUpdated,
    source,
    refreshConcerts
  };
}