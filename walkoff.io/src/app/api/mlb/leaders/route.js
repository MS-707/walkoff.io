import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache implementation
const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour for leaders data (changes less frequently)

export async function GET(request) {
  try {
    // Get parameters
    const { searchParams } = new URL(request.url);
    const statGroup = searchParams.get('statGroup') || 'hitting'; // hitting, pitching, fielding
    const leaderCategories = searchParams.get('leaderCategories') || 'homeRuns'; // Depends on statGroup
    const season = searchParams.get('season') || new Date().getFullYear().toString();
    
    // Check cache first
    const cacheKey = `leaders-${statGroup}-${leaderCategories}-${season}`;
    const now = Date.now();
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Using cached leaders data for ${statGroup}-${leaderCategories}-${season}`);
      return NextResponse.json(cachedData.data);
    }
    
    // Fetch from MLB API
    console.log(`Fetching fresh leaders data for ${statGroup}-${leaderCategories}-${season}`);
    const url = `https://statsapi.mlb.com/api/v1/stats/leaders`;
    const params = {
      leaderCategories,
      statGroup,
      season,
      limit: 10, // Top 10 leaders
      sportId: 1 // MLB
    };
    
    const response = await axios.get(url, { params });
    
    // Process data
    const processedData = {
      leaderCategories: response.data.leaderCategories,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, {
      data: processedData,
      timestamp: now
    });
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error fetching MLB leaders data:", error);
    return NextResponse.json(
      { error: "Failed to fetch MLB leaders data" },
      { status: 500 }
    );
  }
}