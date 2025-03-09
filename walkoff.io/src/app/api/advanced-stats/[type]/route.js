import { NextResponse } from 'next/server';
import { 
  generateMockBattingStats, 
  generateMockPitchingStats,
  generateMockFieldingStats,
  generateMockStatcastData
} from '@/lib/advanced-stats/mockData';

// Cache implementation with 12-hour expiry
const cache = new Map();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Handle GET requests for advanced stats
 * @param {Request} request - The request object
 * @param {Object} params - Route parameters including the type of stats
 * @returns {NextResponse} The response with stats data
 */
export async function GET(request, { params }) {
  const { type } = params;
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season') || new Date().getFullYear();
  
  try {
    // Validate the type parameter
    if (!['batting', 'pitching', 'fielding', 'statcast', 'comparison'].includes(type)) {
      return NextResponse.json(
        { error: `Invalid stats type: ${type}` },
        { status: 400 }
      );
    }
    
    // Check cache first
    const cacheKey = `advanced-stats-${type}-${season}`;
    const now = Date.now();
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Using cached ${type} stats for ${season}`);
      return NextResponse.json(cachedData.data);
    }
    
    // Generate mock data based on the type
    // In a production environment, this would be replaced with actual pybaseball API calls
    let data;
    switch (type) {
      case 'batting':
        data = generateMockBattingStats();
        break;
      case 'pitching':
        data = generateMockPitchingStats();
        break;
      case 'fielding':
        data = generateMockFieldingStats();
        break;
      case 'statcast':
        data = generateMockStatcastData();
        break;
      case 'comparison':
        // For comparison, use a combination of batting and statcast data
        const battingStats = generateMockBattingStats(50);
        const statcastStats = generateMockStatcastData(50);
        
        data = battingStats.map((player, index) => {
          if (index < statcastStats.length) {
            // Merge some statcast data into the batting stats
            return {
              ...player,
              exit_velocity: statcastStats[index].exit_velocity,
              launch_angle: statcastStats[index].launch_angle,
              barrel_pct: statcastStats[index].barrel_pct,
              hard_hit_pct: statcastStats[index].hard_hit_pct
            };
          }
          return player;
        });
        break;
    }
    
    // Comment for production implementation: 
    // In a real implementation with pybaseball, the code would look something like:
    // if (type === 'batting') {
    //   // Use pybaseball Python API to fetch real data
    //   const response = await fetch('http://localhost:5000/api/pybaseball/batting', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ season })
    //   });
    //   data = await response.json();
    // }
    
    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: now
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} stats:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${type} statistics` },
      { status: 500 }
    );
  }
}