import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache implementation specific for ticker data - 5 minute expiration
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Format date in MM/DD/YYYY for API calls
 */
function formatDateForAPI(date) {
  const d = date ? new Date(date) : new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

export async function GET() {
  try {
    // Check cache first
    const cacheKey = 'ticker-data';
    const now = Date.now();
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log('Using cached ticker data');
      return NextResponse.json(cachedData.data);
    }
    
    // Fetch from MLB API with minimal hydration for efficiency
    console.log('Fetching fresh ticker data');
    const url = 'https://statsapi.mlb.com/api/v1/schedule';
    const params = {
      sportId: 1,
      date: formatDateForAPI(new Date()),
      hydrate: 'team,linescore' // Minimal data needed for ticker
    };
    
    const response = await axios.get(url, { params });
    
    // Process and simplify data for the ticker
    const games = response.data.dates?.[0]?.games || [];
    
    // Extract only the necessary fields for each game to minimize payload
    const tickerGames = games.map(game => ({
      gamePk: game.gamePk,
      status: {
        abstractGameState: game.status.abstractGameState
      },
      teams: {
        home: {
          team: {
            id: game.teams.home.team.id,
            name: game.teams.home.team.name,
            abbreviation: game.teams.home.team.abbreviation || game.teams.home.team.teamName.substring(0, 3)
          },
          score: game.teams.home.score
        },
        away: {
          team: {
            id: game.teams.away.team.id,
            name: game.teams.away.team.name,
            abbreviation: game.teams.away.team.abbreviation || game.teams.away.team.teamName.substring(0, 3)
          },
          score: game.teams.away.score
        }
      },
      linescore: {
        currentInning: game.linescore?.currentInning,
        inningHalf: game.linescore?.inningHalf
      },
      gameDate: game.gameDate
    }));
    
    // Create lightweight processed data
    const processedData = {
      games: tickerGames,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, {
      data: processedData,
      timestamp: now
    });
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error fetching MLB ticker data:", error);
    return NextResponse.json(
      { error: "Failed to fetch MLB ticker data" },
      { status: 500 }
    );
  }
}