/**
 * MLB API Client
 * 
 * This module provides functions to interact with the MLB Stats API
 * MLB Stats API documentation: https://statsapi.mlb.com/docs/
 */

import axios from 'axios';

// Base configuration for MLB Stats API requests
const mlbApiClient = axios.create({
  baseURL: 'https://statsapi.mlb.com/api/v1',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Cache configuration
const CACHE_DURATION = {
  SCHEDULE: 15 * 60 * 1000, // 15 minutes for schedules
  LIVE_GAME: 30 * 1000,     // 30 seconds for live game data
  STANDINGS: 60 * 60 * 1000, // 1 hour for standings
  PLAYER: 24 * 60 * 60 * 1000, // 24 hours for player data
};

// Cache storage
const cache = new Map();

/**
 * Fetch data from MLB API with caching
 * 
 * @param {string} endpoint - API endpoint to fetch
 * @param {Object} params - Query parameters
 * @param {number} cacheDuration - Cache duration in milliseconds
 * @returns {Promise<any>} API response data
 */
export async function fetchMLBData(endpoint, params = {}, cacheDuration = CACHE_DURATION.SCHEDULE) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  
  // Check if we have cached data that hasn't expired
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < cacheDuration) {
      console.log(`[MLB API] Cache hit for ${cacheKey}`);
      return data;
    }
    // Expired cache, will refetch
    console.log(`[MLB API] Cache expired for ${cacheKey}`);
  }
  
  try {
    // Actual API request
    console.log(`[MLB API] Fetching ${endpoint}`);
    const response = await mlbApiClient.get(endpoint, { params });
    
    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.error(`[MLB API] Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Batch fetch multiple MLB API endpoints in a single function call
 * 
 * @param {Array<{endpoint: string, params: Object, cacheDuration: number}>} requests - Array of request configs
 * @returns {Promise<Array<any>>} Array of API response data
 */
export async function batchFetchMLBData(requests) {
  return Promise.all(
    requests.map(({ endpoint, params, cacheDuration }) => 
      fetchMLBData(endpoint, params, cacheDuration)
    )
  );
}

// Schedule/Scoreboard Endpoints

/**
 * Get today's MLB schedule with live game data
 * 
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Today's schedule with game data
 */
export async function getTodaySchedule(params = {}) {
  return fetchMLBData('/schedule', { 
    sportId: 1,
    hydrate: 'team,linescore,game(content(media(featured,epg),summary)),probablePitcher',
    ...params 
  }, CACHE_DURATION.SCHEDULE);
}

/**
 * Get MLB schedule for a specific date
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Schedule for the specified date
 */
export async function getScheduleForDate(date, params = {}) {
  return fetchMLBData('/schedule', { 
    sportId: 1,
    date,
    hydrate: 'team,linescore,game(content(media(featured,epg),summary)),probablePitcher',
    ...params 
  }, CACHE_DURATION.SCHEDULE);
}

/**
 * Get live data for a specific game
 * 
 * @param {number} gamePk - Game ID
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Live game data
 */
export async function getLiveGameData(gamePk, params = {}) {
  return fetchMLBData(`/game/${gamePk}/feed/live`, params, CACHE_DURATION.LIVE_GAME);
}

// Team Endpoints

/**
 * Get list of all MLB teams
 * 
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} List of teams
 */
export async function getAllTeams(params = {}) {
  return fetchMLBData('/teams', { 
    sportId: 1,
    ...params 
  }, CACHE_DURATION.STANDINGS);
}

/**
 * Get specific team data
 * 
 * @param {number} teamId - Team ID
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Team data
 */
export async function getTeam(teamId, params = {}) {
  return fetchMLBData(`/teams/${teamId}`, { 
    hydrate: 'roster(person(stats(type=season)))',
    ...params 
  }, CACHE_DURATION.STANDINGS);
}

// Player Endpoints

/**
 * Get player data
 * 
 * @param {number} playerId - Player ID
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Player data
 */
export async function getPlayer(playerId, params = {}) {
  return fetchMLBData(`/people/${playerId}`, { 
    hydrate: 'stats(group=[hitting,pitching,fielding],type=[season,career])',
    ...params 
  }, CACHE_DURATION.PLAYER);
}

/**
 * Get stats leaders
 * 
 * @param {string} statGroup - Stat group ('hitting', 'pitching', 'fielding')
 * @param {string} statType - Stat type ('season', 'career', etc.)
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Stats leaders
 */
export async function getStatsLeaders(statGroup, statType, params = {}) {
  return fetchMLBData('/stats/leaders', { 
    leaderCategories: getLeaderCategories(statGroup),
    statGroup,
    statType,
    limit: 10,
    ...params 
  }, CACHE_DURATION.STANDINGS);
}

// Helper function to get leader categories based on stat group
function getLeaderCategories(statGroup) {
  switch (statGroup) {
    case 'hitting':
      return 'homeRuns,battingAverage,onBasePlusSlugging,runs,rbi';
    case 'pitching':
      return 'earnedRunAverage,wins,strikeouts,saves,whip';
    case 'fielding':
      return 'assists,putOuts,errors,fielding';
    default:
      return '';
  }
}

// Standings Endpoints

/**
 * Get current MLB standings
 * 
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Current standings
 */
export async function getStandings(params = {}) {
  return fetchMLBData('/standings', { 
    leagueId: '103,104',
    season: new Date().getFullYear(),
    ...params 
  }, CACHE_DURATION.STANDINGS);
}

// Fallback mock data for development and backup
export const mockData = {
  schedule: {
    dates: [{
      games: Array(8).fill().map((_, i) => ({
        gamePk: 12345 + i,
        status: { abstractGameState: i < 3 ? 'Live' : (i < 6 ? 'Final' : 'Preview') },
        teams: {
          away: { score: Math.floor(Math.random() * 10), team: { name: 'Away Team ' + i, id: 1000 + i } },
          home: { score: Math.floor(Math.random() * 10), team: { name: 'Home Team ' + i, id: 2000 + i } }
        },
        linescore: {
          currentInning: i < 3 ? Math.floor(Math.random() * 9) + 1 : 9,
          inningState: i < 3 ? (Math.random() > 0.5 ? 'Top' : 'Bottom') : 'End'
        }
      }))
    }]
  }
};

export default {
  getTodaySchedule,
  getScheduleForDate,
  getLiveGameData,
  getAllTeams,
  getTeam,
  getPlayer,
  getStatsLeaders,
  getStandings,
  mockData
};