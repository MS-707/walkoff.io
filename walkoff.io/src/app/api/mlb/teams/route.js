import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache implementation
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for team data

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId') || '';
    
    // Check cache first
    const cacheKey = `teams-${teamId}`;
    const now = Date.now();
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Using cached team data`);
      return NextResponse.json(cachedData.data);
    }
    
    // Fetch from MLB API
    console.log(`Fetching fresh team data`);
    const url = `https://statsapi.mlb.com/api/v1/teams`;
    const params = {
      sportId: 1,
      hydrate: 'team(logo)'
    };
    
    if (teamId) {
      params.teamId = teamId;
    }
    
    const response = await axios.get(url, { params });
    
    // Process data - Extract logo URLs and create a simplified teams object
    const teamsData = response.data.teams.map(team => {
      // Find logo with "primary" type if available
      const primaryLogo = team.teamLogos?.find(logo => logo.logoType === "primary") || team.teamLogos?.[0];
      
      return {
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        teamName: team.teamName,
        abbreviation: team.abbreviation,
        logoUrl: primaryLogo?.url || null,
        primaryColor: team.primaryColor || "#000000",
        secondaryColor: team.secondaryColor || "#FFFFFF"
      };
    });
    
    // Create a lookup dictionary by ID for easier frontend access
    const teamsById = {};
    teamsData.forEach(team => {
      teamsById[team.id] = team;
    });
    
    const processedData = {
      teams: teamsData,
      teamsById,
      timestamp: new Date().toISOString()
    };
    
    // Store in cache
    cache.set(cacheKey, {
      data: processedData,
      timestamp: now
    });
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error fetching MLB team data:", error);
    return NextResponse.json(
      { error: "Failed to fetch MLB team data" },
      { status: 500 }
    );
  }
}