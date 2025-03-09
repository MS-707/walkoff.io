import { NextResponse } from 'next/server';
import mlbApi, { mockData } from '@/lib/api/mlb/mlbApiClient';

// Server-side cache
let scoreboardCache = {
  data: null,
  timestamp: 0
};

// Cache duration: 5 minutes for scoreboard
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * GET handler for scoreboard API
 * 
 * This endpoint provides game scores and schedules with automatic server-side caching
 */
export async function GET(request) {
  try {
    // Parse request URL for date parameter
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Format: YYYY-MM-DD
    
    // Check if we have valid cached data for the same date
    const now = Date.now();
    const isCacheValid = 
      scoreboardCache.data && 
      (now - scoreboardCache.timestamp < CACHE_DURATION) &&
      (!date || date === scoreboardCache.date);
    
    if (isCacheValid) {
      console.log('[API] Using cached scoreboard data');
      return NextResponse.json({ 
        ...scoreboardCache.data, 
        cached: true,
        serverTimestamp: now 
      });
    }
    
    // Fetch fresh data from MLB API
    let scheduleData;
    try {
      scheduleData = date 
        ? await mlbApi.getScheduleForDate(date)
        : await mlbApi.getTodaySchedule();
      
      // Process data to add additional information
      const processedData = processScheduleData(scheduleData);
      
      // Update cache
      scoreboardCache = {
        data: processedData,
        timestamp: now,
        date: date || new Date().toISOString().split('T')[0]
      };
      
      return NextResponse.json({ 
        ...processedData, 
        cached: false,
        serverTimestamp: now 
      });
    } catch (error) {
      console.error('[API] Error fetching MLB data:', error);
      
      // If we have stale cache, return it with warning
      if (scoreboardCache.data) {
        return NextResponse.json({ 
          ...scoreboardCache.data, 
          cached: true,
          stale: true,
          serverTimestamp: now,
          error: 'Using stale data due to API error'
        });
      }
      
      // Otherwise, return mock data with error flag
      return NextResponse.json({ 
        ...processScheduleData(mockData.schedule), 
        cached: false,
        mock: true,
        serverTimestamp: now,
        error: 'Using mock data due to API error'
      });
    }
  } catch (error) {
    console.error('[API] Unexpected error in scoreboard handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scoreboard data', mock: true, data: processScheduleData(mockData.schedule) },
      { status: 500 }
    );
  }
}

/**
 * Process MLB schedule data to add additional derived information
 * 
 * @param {Object} scheduleData - Raw MLB schedule data
 * @returns {Object} Processed data with additional information
 */
function processScheduleData(scheduleData) {
  if (!scheduleData || !scheduleData.dates || !scheduleData.dates.length) {
    return { 
      dates: [], 
      games: [],
      liveGames: [],
      upcomingGames: [],
      completedGames: [] 
    };
  }
  
  // Extract games from all dates
  const allGames = scheduleData.dates.reduce((acc, date) => {
    return acc.concat(date.games || []);
  }, []);
  
  // Group games by status
  const liveGames = allGames.filter(game => 
    game.status && game.status.abstractGameState === 'Live'
  );
  
  const upcomingGames = allGames.filter(game => 
    game.status && game.status.abstractGameState === 'Preview'
  );
  
  const completedGames = allGames.filter(game => 
    game.status && game.status.abstractGameState === 'Final'
  );
  
  // Add derived data
  const gamesWithDerivedData = allGames.map(game => {
    let winningTeam = null;
    let losingTeam = null;
    
    if (game.status && game.status.abstractGameState === 'Final') {
      // Determine winning and losing teams for completed games
      const awayScore = game.teams.away.score || 0;
      const homeScore = game.teams.home.score || 0;
      
      if (awayScore > homeScore) {
        winningTeam = 'away';
        losingTeam = 'home';
      } else if (homeScore > awayScore) {
        winningTeam = 'home';
        losingTeam = 'away';
      }
    }
    
    return {
      ...game,
      derived: {
        winningTeam,
        losingTeam,
        isLive: game.status?.abstractGameState === 'Live',
        isComplete: game.status?.abstractGameState === 'Final',
        isUpcoming: game.status?.abstractGameState === 'Preview',
        inningDisplay: game.linescore ? `${game.linescore.inningState} ${game.linescore.currentInning}` : '',
      }
    };
  });
  
  return {
    dates: scheduleData.dates,
    games: gamesWithDerivedData,
    liveGames: liveGames.map(game => game.gamePk),
    upcomingGames: upcomingGames.map(game => game.gamePk),
    completedGames: completedGames.map(game => game.gamePk)
  };
}