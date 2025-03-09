import axios from 'axios';

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

// Cache implementation
const cache = new Map();
const CACHE_DURATION = {
  DEFAULT: 15 * 60 * 1000, // 15 minutes for most data
  LIVE: 5 * 60 * 1000, // 5 minutes for live data
  TEAMS: 24 * 60 * 60 * 1000 // 24 hours for team data
};

/**
 * Fetch data with caching
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {boolean} isLiveData - Whether this is live game data
 * @param {string} cacheType - Cache type (LIVE, DEFAULT, TEAMS)
 */
async function fetchWithCache(endpoint, params = {}, isLiveData = false, cacheType = null) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
  const cacheKey = url;
  
  const now = Date.now();
  const cachedData = cache.get(cacheKey);
  
  // Determine cache duration based on parameters
  let cacheDuration = CACHE_DURATION.DEFAULT;
  if (cacheType && CACHE_DURATION[cacheType]) {
    cacheDuration = CACHE_DURATION[cacheType];
  } else if (isLiveData) {
    cacheDuration = CACHE_DURATION.LIVE;
  }
  
  // Return cached data if valid
  if (cachedData && now - cachedData.timestamp < cacheDuration) {
    console.log(`Using cached data for: ${url}`);
    return cachedData.data;
  }
  
  try {
    console.log(`Fetching fresh data for: ${url}`);
    const response = await axios.get(url);
    
    // Store in cache
    cache.set(cacheKey, {
      data: response.data,
      timestamp: now
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    
    // Return stale cache if available, even if expired
    if (cachedData) {
      console.log(`Returning stale cached data for: ${url}`);
      return cachedData.data;
    }
    
    throw error;
  }
}

/**
 * Get current MLB schedule
 * @param {string} date - Optional date in format 'MM/DD/YYYY'
 * @param {boolean} hydrate - Whether to include additional data
 */
export const fetchSchedule = async (date = '', hydrate = false) => {
  const params = {
    sportId: 1,
    hydrate: hydrate ? 'team,linescore,flags,liveLookin,person,probablePitcher,stats,broadcasts(all),tickets,game(content(media(epg),summary),tickets),seriesStatus(useOverride=true)' : undefined
  };
  
  if (date) {
    params.date = date;
  }
  
  return fetchWithCache('/schedule', params, true);
};

/**
 * Get live game feed data
 * @param {string} gameId - The MLB game ID
 */
export const fetchLiveGameFeed = async (gameId) => {
  return fetchWithCache(`/game/${gameId}/feed/live`, {}, true);
};

/**
 * Get team information with logos
 * @param {string} teamId - Optional team ID. If not provided, returns all teams
 * @param {boolean} includeLogos - Whether to include logo information
 */
export const fetchTeamInfo = async (teamId = '', includeLogos = true) => {
  const endpoint = teamId ? `/teams/${teamId}` : '/teams';
  const params = {
    sportId: 1,
    hydrate: includeLogos ? 'team(logo),roster(person)' : 'roster,person'
  };
  
  // Use 24-hour caching for team data
  return fetchWithCache(endpoint, params, false, 'TEAMS');
};

/**
 * Get player stats
 * @param {string} personId - The MLB person ID
 * @param {string} group - Stats group (hitting, pitching, fielding)
 * @param {string} type - Stats type (season, career, yearByYear, etc)
 */
export const fetchPlayerStats = async (personId, group = 'hitting', type = 'season') => {
  return fetchWithCache(`/people/${personId}/stats`, {
    stats: `${type},${group}`, 
    group: group
  });
};

/**
 * Get standings
 * @param {string} leagueId - Optional league ID
 * @param {string} date - Optional date in format 'MM/DD/YYYY'
 */
export const fetchStandings = async (leagueId = '', date = '') => {
  const params = {
    leagueId,
    date
  };
  
  return fetchWithCache('/standings', params);
};

/**
 * Search for players
 * @param {string} query - Search term
 */
export const searchPlayers = async (query) => {
  return fetchWithCache('/search/player', { q: query });
};

/**
 * Clear cache for testing
 */
export const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

export default {
  fetchSchedule,
  fetchLiveGameFeed,
  fetchTeamInfo,
  fetchPlayerStats,
  fetchStandings,
  searchPlayers,
  clearCache
};