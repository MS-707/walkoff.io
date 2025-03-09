import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for scoreboard data

/**
 * Formats date in MM/DD/YYYY
 */
function formatDateForAPI(date) {
  const d = date ? new Date(date) : new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

export async function GET(request) {
  try {
    // Get date from query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '';
    
    // Format date for API
    const formattedDate = date ? formatDateForAPI(date) : formatDateForAPI(new Date());
    
    // Use cache if available
    const cacheKey = `scoreboard-${formattedDate}`;
    const now = Date.now();
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Using cached scoreboard data for ${formattedDate}`);
      return NextResponse.json(cachedData.data);
    }
    
    // Fetch from MLB API
    console.log(`Fetching fresh scoreboard data for ${formattedDate}`);
    const url = `https://statsapi.mlb.com/api/v1/schedule`;
    const params = {
      sportId: 1,
      date: formattedDate,
      hydrate: 'team,linescore,flags,liveLookin,person,probablePitcher,stats,broadcasts(all),tickets,game(content(media(epg),summary),tickets),seriesStatus(useOverride=true)'
    };
    
    const response = await axios.get(url, { params });
    
    // Process and simplify data if needed
    const processedData = {
      dates: response.data.dates,
      totalGames: response.data.totalGames,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, {
      data: processedData,
      timestamp: now
    });
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error fetching MLB scoreboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch MLB scoreboard data" },
      { status: 500 }
    );
  }
}