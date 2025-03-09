import { NextResponse } from 'next/server';
import mlbApi from '@/lib/api/mlb/mlbApiClient';

// Server-side cache for leaders data
const leadersCache = {
  data: {},
  timestamp: 0
};

// Cache duration: 6 hours for stats leaders
const CACHE_DURATION = 6 * 60 * 60 * 1000;

/**
 * GET handler for stats leaders API
 * 
 * This endpoint provides MLB statistical leaders by category
 */
export async function GET(request) {
  try {
    // Parse request URL for parameters
    const { searchParams } = new URL(request.url);
    const statGroup = searchParams.get('statGroup') || 'hitting';
    const statType = searchParams.get('statType') || 'season';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Create a cache key based on parameters
    const cacheKey = `${statGroup}_${statType}_${limit}`;
    
    // Check if we have valid cached data
    const now = Date.now();
    const isCacheValid = 
      leadersCache.data[cacheKey] && 
      (now - leadersCache.timestamp < CACHE_DURATION);
    
    if (isCacheValid) {
      console.log(`[API] Using cached ${statGroup} leaders data`);
      return NextResponse.json({ 
        ...leadersCache.data[cacheKey], 
        cached: true,
        serverTimestamp: now 
      });
    }
    
    // Determine leader categories based on stat group
    const leaderCategories = getLeaderCategories(statGroup);
    
    try {
      // Fetch leader data from MLB API
      const leadersData = await mlbApi.getStatsLeaders(statGroup, statType, {
        leaderCategories,
        limit
      });
      
      // Process and structure the leaders data
      const processedData = processLeadersData(leadersData, statGroup);
      
      // Update cache
      leadersCache.data[cacheKey] = processedData;
      leadersCache.timestamp = now;
      
      return NextResponse.json({ 
        ...processedData, 
        cached: false,
        serverTimestamp: now 
      });
    } catch (error) {
      console.error(`[API] Error fetching ${statGroup} leaders:`, error);
      
      // If we have stale cache, return it with warning
      if (leadersCache.data[cacheKey]) {
        return NextResponse.json({ 
          ...leadersCache.data[cacheKey], 
          cached: true,
          stale: true,
          serverTimestamp: now,
          error: 'Using stale data due to API error'
        });
      }
      
      // Otherwise, return error
      return NextResponse.json(
        { error: `Failed to fetch ${statGroup} leaders` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Unexpected error in leaders handler:', error);
    return NextResponse.json(
      { error: 'Failed to process leaders data request' },
      { status: 500 }
    );
  }
}

/**
 * Process leaders data for better client consumption
 * 
 * @param {Object} leadersData - Raw leaders data from MLB API
 * @param {string} statGroup - The stat group ('hitting', 'pitching', 'fielding')
 * @returns {Object} Processed leaders data
 */
function processLeadersData(leadersData, statGroup) {
  if (!leadersData || !leadersData.leagueLeaders) {
    return { categories: [] };
  }
  
  // Transform data to be more useful for the client
  const categories = leadersData.leagueLeaders.map(category => {
    // Add some useful metadata for each stat
    const metadata = getStatMetadata(category.statGroup, category.leaderCategory);
    
    return {
      statGroup: category.statGroup,
      statType: category.statType,
      categoryName: category.leaderCategory,
      displayName: metadata.displayName,
      shortName: metadata.shortName,
      description: metadata.description,
      format: metadata.format,
      leaders: category.leaders.map((leader, index) => ({
        rank: index + 1,
        playerId: leader.person?.id,
        playerName: [leader.person?.firstName, leader.person?.lastName].filter(Boolean).join(' '),
        teamId: leader.team?.id,
        teamName: leader.team?.name,
        teamAbbreviation: leader.team?.abbreviation,
        value: leader.value,
        formattedValue: formatStatValue(leader.value, metadata.format)
      }))
    };
  });
  
  return {
    statGroup,
    categories,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get leader categories based on stat group
 * 
 * @param {string} statGroup - Stat group ('hitting', 'pitching', 'fielding')
 * @returns {string} Comma-separated leader categories
 */
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

/**
 * Get metadata for a specific statistic
 * 
 * @param {string} statGroup - Stat group ('hitting', 'pitching', 'fielding')
 * @param {string} statName - The name of the statistic
 * @returns {Object} Metadata for the stat
 */
function getStatMetadata(statGroup, statName) {
  const metadata = {
    // Hitting stats
    homeRuns: {
      displayName: 'Home Runs',
      shortName: 'HR',
      description: 'Total number of home runs hit',
      format: 'integer'
    },
    battingAverage: {
      displayName: 'Batting Average',
      shortName: 'AVG',
      description: 'Hits divided by at bats',
      format: 'decimal3'
    },
    onBasePlusSlugging: {
      displayName: 'On-base Plus Slugging',
      shortName: 'OPS',
      description: 'On-base percentage plus slugging percentage',
      format: 'decimal3'
    },
    runs: {
      displayName: 'Runs',
      shortName: 'R',
      description: 'Total number of runs scored',
      format: 'integer'
    },
    rbi: {
      displayName: 'Runs Batted In',
      shortName: 'RBI',
      description: 'Number of runs batted in',
      format: 'integer'
    },
    
    // Pitching stats
    earnedRunAverage: {
      displayName: 'Earned Run Average',
      shortName: 'ERA',
      description: 'Earned runs allowed per nine innings',
      format: 'decimal2'
    },
    wins: {
      displayName: 'Wins',
      shortName: 'W',
      description: 'Games won as a pitcher',
      format: 'integer'
    },
    strikeouts: {
      displayName: 'Strikeouts',
      shortName: 'K',
      description: 'Number of batters struck out',
      format: 'integer'
    },
    saves: {
      displayName: 'Saves',
      shortName: 'SV',
      description: 'Games finished with a save',
      format: 'integer'
    },
    whip: {
      displayName: 'Walks & Hits per Inning Pitched',
      shortName: 'WHIP',
      description: 'Walks plus hits divided by innings pitched',
      format: 'decimal2'
    },
    
    // Fielding stats
    assists: {
      displayName: 'Assists',
      shortName: 'A',
      description: 'Defensive plays contributing to an out',
      format: 'integer'
    },
    putOuts: {
      displayName: 'Put Outs',
      shortName: 'PO',
      description: 'Number of outs recorded directly',
      format: 'integer'
    },
    errors: {
      displayName: 'Errors',
      shortName: 'E',
      description: 'Defensive mistakes resulting in bases or outs',
      format: 'integer'
    },
    fielding: {
      displayName: 'Fielding Percentage',
      shortName: 'FLD%',
      description: 'Percentage of successfully fielded balls',
      format: 'decimal3'
    }
  };
  
  return metadata[statName] || {
    displayName: statName,
    shortName: statName,
    description: `${statName} statistic`,
    format: 'decimal3'
  };
}

/**
 * Format a stat value based on its type
 * 
 * @param {number|string} value - The value to format
 * @param {string} format - The format type
 * @returns {string} Formatted value
 */
function formatStatValue(value, format) {
  if (value === undefined || value === null) return '';
  
  switch (format) {
    case 'integer':
      return parseInt(value).toString();
    case 'decimal2':
      return parseFloat(value).toFixed(2);
    case 'decimal3':
      return parseFloat(value).toFixed(3).replace(/^0+/, '');
    case 'percentage':
      return `${(parseFloat(value) * 100).toFixed(1)}%`;
    default:
      return value.toString();
  }
}