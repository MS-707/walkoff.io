# WalkOff.io Development Notes

## Stable Versions
- v0.2.0-stable: Working navigation with placeholder pages (Scoreboard, Discover, Lists, Community)
- v0.3.0-mlb-api: MLB Stats API integration with scoreboard implementation

## Important Commands
- Start development server: `npm run dev` (runs on http://localhost:3000)

## Environment Setup
- Branch `stable-base`: Clean version with basic navigation
- Branch `mlb-stats-api`: Contains MLB API integration 

## MLB Stats API Integration
- Base URL: `https://statsapi.mlb.com/api/v1/`
- No API key currently required
- API client: `/src/services/mlbApi.js`
- Key API endpoints:
  - Schedule/Scoreboard: `/schedule?sportId=1`
  - Live Game Feed: `/game/{gameId}/feed/live`
  - Team Info: `/teams`
  - Player Stats: `/people/{personId}/stats`
  - Leaders: `/stats/leaders`

## API Implementation Details
- Server-side API routes:
  - `/api/mlb/scoreboard` - Get games for a specific date
  - `/api/mlb/players/[playerId]` - Get player details and stats
  - `/api/mlb/leaders` - Get statistical leaders
  - `/api/mlb/teams` - Get all teams with logo information

## Team Logo Integration
- Reusable component: `/src/components/teams/TeamLogo.js`
- Team data provider: `/src/components/teams/TeamLogoProvider.js`
- Optimized image loading with Next.js Image component
- Fallback display when logo can't be loaded
- Added to game cards and live ticker

## Caching Strategy
- In-memory caching with different durations:
  - Live game data: 5 minute cache
  - Player data: 15 minute cache
  - Team data with logos: 24 hour cache
  - Other static data: 60 minute cache
- Stale-while-revalidate pattern with SWR
- Variable refresh rates (faster for live games)
- TeamLogoProvider for application-wide team data access

## Browser Issues
- If localhost doesn't work in Brave browser, check:
  - Shields (may need to disable for localhost)
  - Try using Chrome or 127.0.0.1 instead of localhost
  - Clear cache and site data if needed

## Project Structure
- `/src/app/`: Pages built with Next.js App Router
- `/src/app/api/`: API routes for server-side data fetching
- `/src/components/`: React components
- `/src/components/navigation/`: Navigation components
- `/src/components/scoreboard/`: Scoreboard components
- `/src/services/`: API clients and services
- `/public/`: Static assets

## Next Steps
- Player statistics pages
- Team pages with rosters
- Stats comparison tools
- Game detail pages with play-by-play