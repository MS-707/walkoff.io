'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mlbApi from './mlbApiClient';

// Polling interval for live games (in milliseconds)
const POLLING_INTERVAL = 30 * 1000; // 30 seconds

/**
 * Custom hook to provide real-time game updates
 * 
 * @param {string|number} gamePk - Game ID to track (optional)
 * @returns {Object} Real-time game data
 */
export function useGameUpdates(gamePk) {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLive, setIsLive] = useState(false);
  
  // Store timer ID so we can clean up
  const timerRef = useRef(null);
  
  // Fetch game data
  const fetchGameData = useCallback(async () => {
    if (!gamePk) return;
    
    try {
      const data = await mlbApi.getLiveGameData(gamePk);
      setGameData(data);
      
      // Determine if game is still live
      const gameState = data.gameData?.status?.abstractGameState;
      setIsLive(gameState === 'Live');
      
      setLastUpdate(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError(err.message || 'Failed to fetch game data');
      setLoading(false);
    }
  }, [gamePk]);
  
  // Set up polling for live game updates
  useEffect(() => {
    if (!gamePk) return;
    
    // Initial fetch
    fetchGameData();
    
    // Set up polling interval if game is live
    if (isLive) {
      timerRef.current = setInterval(fetchGameData, POLLING_INTERVAL);
    }
    
    // Clean up on unmount or when gamePk changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gamePk, fetchGameData, isLive]);
  
  return {
    gameData,
    loading,
    error,
    lastUpdate,
    isLive,
    refresh: fetchGameData
  };
}

/**
 * Custom hook to provide real-time scoreboard updates
 * 
 * @returns {Object} Scoreboard data and control functions
 */
export function useScoreboardUpdates() {
  const [scoreboardData, setScoreboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [pollingEnabled, setPollingEnabled] = useState(true);
  
  // Store timer ID so we can clean up
  const timerRef = useRef(null);
  
  // Track whether we have any live games
  const [hasLiveGames, setHasLiveGames] = useState(false);
  
  // Fetch scoreboard data
  const fetchScoreboardData = useCallback(async (date) => {
    try {
      // Use our API endpoint to benefit from server-side caching
      const response = await fetch(`/api/mlb/scoreboard${date ? `?date=${date}` : ''}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setScoreboardData(data);
      
      // Check if there are any live games
      setHasLiveGames(data.liveGames && data.liveGames.length > 0);
      
      setLastUpdate(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching scoreboard data:', err);
      setError(err.message || 'Failed to fetch scoreboard data');
      setLoading(false);
    }
  }, []);
  
  // Set up polling for scoreboard updates
  useEffect(() => {
    // Initial fetch
    fetchScoreboardData();
    
    // Set up polling if enabled and we have live games
    if (pollingEnabled && hasLiveGames) {
      timerRef.current = setInterval(() => {
        fetchScoreboardData();
      }, POLLING_INTERVAL);
    }
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fetchScoreboardData, pollingEnabled, hasLiveGames]);
  
  // Allow changing the polling state
  const enablePolling = useCallback(() => {
    setPollingEnabled(true);
  }, []);
  
  const disablePolling = useCallback(() => {
    setPollingEnabled(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  return {
    scoreboardData,
    loading,
    error,
    lastUpdate,
    hasLiveGames,
    refresh: fetchScoreboardData,
    enablePolling,
    disablePolling,
    pollingEnabled
  };
}

/**
 * Custom hook to provide real-time leaders updates
 * 
 * @param {string} statGroup - The stat group ('hitting', 'pitching', 'fielding')
 * @param {string} statType - The stat type ('season', 'career', etc.)
 * @param {number} limit - Number of leaders to fetch
 * @returns {Object} Leaders data
 */
export function useLeadersUpdates(statGroup = 'hitting', statType = 'season', limit = 10) {
  const [leadersData, setLeadersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Fetch leaders data
  const fetchLeadersData = useCallback(async () => {
    try {
      // Use our API endpoint to benefit from server-side caching
      const response = await fetch(
        `/api/mlb/leaders?statGroup=${statGroup}&statType=${statType}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setLeadersData(data);
      setLastUpdate(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaders data:', err);
      setError(err.message || 'Failed to fetch leaders data');
      setLoading(false);
    }
  }, [statGroup, statType, limit]);
  
  // Fetch data when dependencies change
  useEffect(() => {
    setLoading(true);
    fetchLeadersData();
  }, [fetchLeadersData]);
  
  return {
    leadersData,
    loading,
    error,
    lastUpdate,
    refresh: fetchLeadersData
  };
}

export default {
  useGameUpdates,
  useScoreboardUpdates,
  useLeadersUpdates
};