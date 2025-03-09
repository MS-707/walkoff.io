'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import ScoreboardGrid from '@/components/scoreboard/ScoreboardGrid';
import DatePicker from '@/components/scoreboard/DatePicker';

// Fetch function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// Format date for API query
const formatDateParam = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export default function ScoreboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = formatDateParam(selectedDate);
  
  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR(
    `/api/mlb/scoreboard?date=${formattedDate}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute for live games
      dedupingInterval: 10000, // Prevent multiple requests in 10 seconds
      focusThrottleInterval: 120000, // Only revalidate once every 2 minutes on refocus
      errorRetryCount: 3, // Retry failed requests 3 times
      // Cache the data for 10 minutes
      // This ensures the Gameday URLs are cached efficiently
      revalidateOnMount: true,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry on 5xx errors
        if (error.status >= 500) {
          setTimeout(() => revalidate({ retryCount }), 5000);
        }
      }
    }
  );
  
  // Auto-refresh more frequently during active games
  useEffect(() => {
    let interval;
    // Check if there are any live games
    const hasLiveGames = data?.dates?.[0]?.games?.some(
      game => game.status.abstractGameState === 'Live' || game.status.abstractGameState === 'In Progress'
    );
    
    if (hasLiveGames) {
      // Refresh more frequently (every 20 seconds) during live games
      interval = setInterval(() => {
        mutate();
      }, 20000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data, mutate]);
  
  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Extract games from the response
  const games = data?.dates?.[0]?.games || [];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-primary mb-4">MLB Scoreboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        View today's MLB game scores and upcoming matchups.
      </p>
      
      <div className="mb-6">
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <button 
            onClick={() => mutate()}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
          >
            <span>Refresh</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <ScoreboardGrid 
          games={games}
          isLoading={isLoading}
          error={error}
        />
        
        {data && (
          <div className="mt-4 text-xs text-gray-500 text-right">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}