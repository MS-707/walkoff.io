import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache implementation
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for player data

export async function GET(request, { params }) {
  try {
    const playerId = params.playerId;
    
    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }
    
    // Check cache first
    const cacheKey = `player-${playerId}`;
    const now = Date.now();
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Using cached player data for ${playerId}`);
      return NextResponse.json(cachedData.data);
    }
    
    // Fetch from MLB API
    console.log(`Fetching fresh player data for ${playerId}`);
    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}`;
    const params = {
      hydrate: 'stats(group=[hitting,pitching,fielding],type=[yearByYear,career,yearByYearAdvanced,careerAdvanced])'
    };
    
    const response = await axios.get(url, { params });
    
    // Process data if needed
    const processedData = {
      ...response.data,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, {
      data: processedData,
      timestamp: now
    });
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error(`Error fetching MLB player data (ID: ${params.playerId}):`, error);
    return NextResponse.json(
      { error: "Failed to fetch MLB player data" },
      { status: 500 }
    );
  }
}