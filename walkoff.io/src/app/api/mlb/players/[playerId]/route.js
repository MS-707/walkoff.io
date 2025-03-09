import { NextResponse } from 'next/server';
import mlbApi from '@/lib/api/mlb/mlbApiClient';

// Server-side cache for player data
// Using a Map with playerIds as keys
const playerCache = new Map();

// Cache duration: 12 hours for player data (as it changes less frequently)
const CACHE_DURATION = 12 * 60 * 60 * 1000;

/**
 * GET handler for individual player data
 * 
 * @param {Object} request - The incoming request
 * @param {Object} params - Route parameters including playerId
 */
export async function GET(request, { params }) {
  try {
    const { playerId } = params;
    
    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    // Check if we have valid cached data for this player
    const now = Date.now();
    const cachedData = playerCache.get(playerId);
    const isCacheValid = cachedData && (now - cachedData.timestamp < CACHE_DURATION);
    
    if (isCacheValid) {
      console.log(`[API] Using cached data for player ${playerId}`);
      return NextResponse.json({ 
        ...cachedData.data, 
        cached: true,
        serverTimestamp: now 
      });
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const hydrate = searchParams.get('hydrate');
    
    // Fetch player data from MLB API
    try {
      const playerData = await mlbApi.getPlayer(playerId, {
        hydrate: hydrate || 'stats(group=[hitting,pitching,fielding],type=[season,career])'
      });
      
      // Process data to enhance it
      const processedData = processPlayerData(playerData);
      
      // Update cache
      playerCache.set(playerId, {
        data: processedData,
        timestamp: now
      });
      
      return NextResponse.json({ 
        ...processedData, 
        cached: false,
        serverTimestamp: now 
      });
    } catch (error) {
      console.error(`[API] Error fetching player ${playerId} data:`, error);
      
      // If we have stale cache, return it with warning
      if (cachedData) {
        return NextResponse.json({ 
          ...cachedData.data, 
          cached: true,
          stale: true,
          serverTimestamp: now,
          error: 'Using stale data due to API error'
        });
      }
      
      // Otherwise, return error
      return NextResponse.json(
        { error: `Failed to fetch player ${playerId} data` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Unexpected error in player handler:', error);
    return NextResponse.json(
      { error: 'Failed to process player data request' },
      { status: 500 }
    );
  }
}

/**
 * Process player data to enhance it with derived information
 * 
 * @param {Object} playerData - Raw player data from MLB API
 * @returns {Object} Enhanced player data
 */
function processPlayerData(playerData) {
  if (!playerData || !playerData.people || !playerData.people.length) {
    return { player: null };
  }
  
  const player = playerData.people[0];
  
  // Extract notable career stats if available
  const careerStats = extractCareerStats(player);
  
  // Calculate derived statistics
  const derivedStats = calculateDerivedStats(player);
  
  return {
    player: {
      ...player,
      careerStats,
      derivedStats
    }
  };
}

/**
 * Extract important career statistics from player data
 * 
 * @param {Object} player - Player data object
 * @returns {Object} Career statistics
 */
function extractCareerStats(player) {
  if (!player.stats) return {};
  
  // Look for career hitting stats
  const careerHitting = player.stats?.find(stat => 
    stat.group?.displayName === 'hitting' && 
    stat.type?.displayName === 'career'
  )?.splits?.[0]?.stat || {};
  
  // Look for career pitching stats
  const careerPitching = player.stats?.find(stat => 
    stat.group?.displayName === 'pitching' && 
    stat.type?.displayName === 'career'
  )?.splits?.[0]?.stat || {};
  
  return {
    hitting: careerHitting,
    pitching: careerPitching
  };
}

/**
 * Calculate additional statistics based on raw stats
 * 
 * @param {Object} player - Player data
 * @returns {Object} Derived statistics
 */
function calculateDerivedStats(player) {
  const derivedStats = {};
  
  // Current season hitting stats
  const currentHitting = player.stats?.find(stat => 
    stat.group?.displayName === 'hitting' && 
    stat.type?.displayName === 'season'
  )?.splits?.[0]?.stat;
  
  // Current season pitching stats
  const currentPitching = player.stats?.find(stat => 
    stat.group?.displayName === 'pitching' && 
    stat.type?.displayName === 'season'
  )?.splits?.[0]?.stat;
  
  // Calculate OPS (On-base Plus Slugging)
  if (currentHitting) {
    const onBasePercentage = currentHitting.obp || 0;
    const sluggingPercentage = currentHitting.slg || 0;
    derivedStats.ops = (onBasePercentage + sluggingPercentage).toFixed(3);
    
    // Calculate ISO (Isolated Power)
    derivedStats.iso = (sluggingPercentage - (currentHitting.avg || 0)).toFixed(3);
  }
  
  // Calculate WHIP (Walks + Hits per Inning Pitched)
  if (currentPitching) {
    const walks = currentPitching.baseOnBalls || 0;
    const hits = currentPitching.hits || 0;
    const inningsPitched = currentPitching.inningsPitched || 1;
    
    derivedStats.whip = ((walks + hits) / parseFloat(inningsPitched)).toFixed(2);
    
    // Calculate K/9 (Strikeouts per 9 innings)
    const strikeouts = currentPitching.strikeOuts || 0;
    derivedStats.k9 = ((strikeouts * 9) / parseFloat(inningsPitched)).toFixed(2);
  }
  
  return derivedStats;
}