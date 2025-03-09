# Python Integration for Advanced MLB Stats

This document outlines how to set up a Python microservice to integrate `pybaseball` with WalkOff.io.

## Approach

Since WalkOff.io is a JavaScript/Next.js application and `pybaseball` is a Python library, we need to create a simple Python microservice to bridge the gap. This service will:

1. Expose REST API endpoints that the Next.js app can call
2. Handle data fetching using `pybaseball`
3. Process and return the data in a format the frontend can use
4. Implement efficient caching to minimize API usage

## Implementation

### 1. Setup FastAPI Service

First, create a new directory for the Python service:

```bash
mkdir pybaseball-service
cd pybaseball-service
```

Install the required dependencies:

```bash
pip install fastapi uvicorn pybaseball pandas numpy
```

Create a requirements.txt file:

```bash
fastapi>=0.95.0
uvicorn>=0.22.0
pybaseball>=2.2.0
pandas>=1.5.3
numpy>=1.24.2
```

### 2. Create the FastAPI App

Create a file named `main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pybaseball as pb
import pandas as pd
from typing import Optional, List, Dict
import json
from datetime import datetime, timedelta
import os

app = FastAPI(title="PyBaseball API", description="API for MLB statistics via pybaseball")

# Enable CORS (only needed for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple cache implementation
cache = {}
CACHE_DURATION = timedelta(hours=12)  # 12 hour cache

class SeasonRequest(BaseModel):
    season: int = datetime.now().year
    min_pa: Optional[int] = 100  # Minimum plate appearances for qualification
    min_ip: Optional[int] = 20   # Minimum innings pitched for qualification

# Helper function to clean pandas data for JSON response
def clean_dataframe(df):
    # Convert DataFrame to dict
    # Replace NaN with None for JSON compatibility
    records = df.replace({pd.NA: None}).to_dict(orient='records')
    
    # Clean numeric values for JSON
    for record in records:
        for key, value in record.items():
            if isinstance(value, float) and key not in ['ERA', 'AVG', 'OBP', 'SLG', 'OPS', 'wOBA']:
                record[key] = round(value, 3)
    
    return records

@app.get("/")
def read_root():
    return {"message": "PyBaseball API is running"}

@app.post("/api/pybaseball/batting")
def get_batting_stats(request: SeasonRequest):
    cache_key = f"batting-{request.season}-{request.min_pa}"
    
    # Check cache
    if cache_key in cache:
        cache_time, data = cache[cache_key]
        if datetime.now() - cache_time < CACHE_DURATION:
            return data
    
    try:
        # Fetch data from pybaseball
        stats = pb.batting_stats(request.season, qual=request.min_pa)
        
        # Clean up column names and select relevant columns
        selected_columns = [
            'IDfg', 'playerid', 'Name', 'Team', 'Age', 'G', 'PA', 'AB', 'H', '2B', '3B', 
            'HR', 'R', 'RBI', 'BB', 'SO', 'HBP', 'SB', 'CS', 'AVG', 'OBP', 'SLG', 'OPS', 
            'wOBA', 'wRC+', 'BsR', 'WAR', 'Barrel%', 'HardHit%', 'Position'
        ]
        
        # Only keep columns that exist
        columns_to_use = [col for col in selected_columns if col in stats.columns]
        filtered_stats = stats[columns_to_use]
        
        # Rename columns for consistency with frontend
        column_mapping = {
            'Name': 'name',
            'Team': 'team',
            'Position': 'position',
            'playerid': 'id',
            'wRC+': 'wRC_plus',
            'Barrel%': 'barrel_pct',
            'HardHit%': 'hard_hit_pct'
        }
        
        filtered_stats = filtered_stats.rename(columns=column_mapping)
        
        # Process data for API response
        result = clean_dataframe(filtered_stats)
        
        # Update cache
        cache[cache_key] = (datetime.now(), result)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching batting stats: {str(e)}")

@app.post("/api/pybaseball/pitching")
def get_pitching_stats(request: SeasonRequest):
    cache_key = f"pitching-{request.season}-{request.min_ip}"
    
    # Check cache
    if cache_key in cache:
        cache_time, data = cache[cache_key]
        if datetime.now() - cache_time < CACHE_DURATION:
            return data
    
    try:
        # Fetch data from pybaseball
        stats = pb.pitching_stats(request.season, qual=request.min_ip)
        
        # Clean up column names and select relevant columns
        selected_columns = [
            'playerid', 'Name', 'Team', 'Age', 'W', 'L', 'ERA', 'G', 'GS', 'SV', 'IP', 'SO', 
            'BB', 'H', 'HR', 'WHIP', 'K/9', 'BB/9', 'HR/9', 'AVG', 'BABIP', 'FIP', 'xFIP', 'WAR'
        ]
        
        # Only keep columns that exist
        columns_to_use = [col for col in selected_columns if col in stats.columns]
        filtered_stats = stats[columns_to_use]
        
        # Rename columns for consistency with frontend
        column_mapping = {
            'Name': 'name',
            'Team': 'team',
            'playerid': 'id',
            'K/9': 'K9',
            'BB/9': 'BB9',
            'HR/9': 'HR9',
            'xFIP': 'xERA'
        }
        
        filtered_stats = filtered_stats.rename(columns=column_mapping)
        
        # Process data for API response
        result = clean_dataframe(filtered_stats)
        
        # Update cache
        cache[cache_key] = (datetime.now(), result)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching pitching stats: {str(e)}")

@app.post("/api/pybaseball/statcast")
def get_statcast_data(request: SeasonRequest):
    cache_key = f"statcast-{request.season}"
    
    # Check cache
    if cache_key in cache:
        cache_time, data = cache[cache_key]
        if datetime.now() - cache_time < CACHE_DURATION:
            return data
    
    try:
        # Use the previous day for recent statcast data
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        one_week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        
        # Fetch data from pybaseball for a limited time window
        # Statcast API is rate-limited, so be careful with date ranges
        stats = pb.statcast(start_dt=one_week_ago, end_dt=yesterday)
        
        # Group by player and aggregate metrics
        if not stats.empty:
            player_stats = stats.groupby(['player_name']).agg({
                'exit_velocity_avg': 'mean',
                'launch_angle_avg': 'mean',
                'sprint_speed': 'mean',
                'barrel': lambda x: x.sum() / len(x) if len(x) > 0 else 0,
                'hard_hit': lambda x: x.sum() / len(x) if len(x) > 0 else 0
            }).reset_index()
            
            player_stats = player_stats.rename(columns={
                'player_name': 'name',
                'exit_velocity_avg': 'exit_velocity',
                'launch_angle_avg': 'launch_angle',
                'barrel': 'barrel_pct',
                'hard_hit': 'hard_hit_pct'
            })
            
            # Get team info from another API
            try:
                team_info = pb.team_game_logs(request.season)
                # Map player to team (simplified in this example)
                # In a real implementation, you'd need more robust player-team mapping
            except:
                # If team data fails, we can still return player data
                pass
            
            # Process data for API response
            result = clean_dataframe(player_stats)
            
            # Update cache
            cache[cache_key] = (datetime.now(), result)
            
            return result
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statcast data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 3. Create a Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 4. Deployment Options

#### Option 1: Vercel Serverless Functions

For Vercel deployment, you can use Python Runtime:

1. Create a `/api` directory in your Vercel project
2. Create Python functions there, like `/api/pybaseball/batting.py`:

```python
from http.server import BaseHTTPRequestHandler
from pybaseball import batting_stats
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        season = data.get('season', 2023)
        
        try:
            stats = batting_stats(season)
            # Process data...
            result = stats.to_dict(orient='records')
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
```

#### Option 2: Railway.app

Railway.app provides a simple way to deploy containers:

1. Push your Python service to a GitHub repository
2. Connect Railway to that repository
3. Railway will automatically build and deploy your service
4. Set your environment variables in the Railway dashboard
5. Configure the Next.js API endpoints to call your Railway service

## Integration with Next.js

In your Next.js API routes, you'd make requests to your Python service:

```javascript
// /src/app/api/advanced-stats/[type]/route.js

export async function GET(request, { params }) {
  const { type } = params;
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season') || new Date().getFullYear();
  
  try {
    // Call the Python microservice
    const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${PYTHON_SERVICE_URL}/api/pybaseball/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} stats:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${type} statistics` },
      { status: 500 }
    );
  }
}
```

## Security Considerations

1. Store your Python service URL in environment variables
2. If your Python service requires authentication, use environment variables for API keys
3. Configure CORS properly to only allow requests from your frontend domain
4. Consider adding rate limiting to prevent abuse

## Testing

You can test your Python microservice locally:

```bash
cd pybaseball-service
uvicorn main:app --reload
```

And then test the API endpoints with curl or Postman:

```bash
curl -X POST http://localhost:8000/api/pybaseball/batting -H "Content-Type: application/json" -d '{"season": 2023}'
```