import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/teams`;
    const params = {
      sportId: 1,
      hydrate: 'team(logo)'
    };
    
    const response = await axios.get(url, { params });
    
    // Just return the raw response for debugging
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching MLB team data:", error);
    return NextResponse.json(
      { error: "Failed to fetch MLB team data" },
      { status: 500 }
    );
  }
}