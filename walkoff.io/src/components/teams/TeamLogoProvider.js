'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import useSWR from 'swr';

// Create context
const TeamLogoContext = createContext({
  teams: [],
  teamsById: {},
  isLoading: true,
  error: null
});

// Custom hook to use the context
export const useTeamLogos = () => useContext(TeamLogoContext);

// Fetch function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch team data');
  }
  return res.json();
};

/**
 * Provider component that fetches and caches all team logos
 */
export const TeamLogoProvider = ({ children }) => {
  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR('/api/mlb/teams', fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshInterval: 86400000, // Refresh once per day (24 hours)
    dedupingInterval: 3600000 // Don't re-fetch within 1 hour
  });
  
  // Get all teams and their logos
  const teams = data?.teams || [];
  const teamsById = data?.teamsById || {};
  
  // Create the context value
  const contextValue = {
    teams,
    teamsById,
    isLoading,
    error
  };
  
  return (
    <TeamLogoContext.Provider value={contextValue}>
      {children}
    </TeamLogoContext.Provider>
  );
};

export default TeamLogoProvider;