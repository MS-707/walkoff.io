'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import TeamLogo from '@/components/teams/TeamLogo';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTeamLogos } from '@/components/teams/TeamLogoProvider';

// Lightweight fetcher for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

// Individual ticker item for a game
const TickerItem = ({ game }) => {
  const { teamsById } = useTeamLogos();
  
  // Extract game data
  const homeTeam = game?.teams?.home?.team || { name: 'Home' };
  const awayTeam = game?.teams?.away?.team || { name: 'Away' };
  const homeScore = game?.teams?.home?.score || 0;
  const awayScore = game?.teams?.away?.score || 0;
  const gameStatus = game?.status?.abstractGameState || 'Unknown';
  const inning = game?.linescore?.currentInning;
  const inningHalf = game?.linescore?.inningHalf;
  const gameId = game?.gamePk;
  
  // Get team data and logos
  const homeTeamData = teamsById[homeTeam.id] || null;
  const awayTeamData = teamsById[awayTeam.id] || null;
  
  // Create fallback texts
  const homeFallback = homeTeam.abbreviation || homeTeam.name?.substr(0, 3) || '';
  const awayFallback = awayTeam.abbreviation || awayTeam.name?.substr(0, 3) || '';
  
  // Handle click to open Gameday
  const handleClick = () => {
    if (gameId) {
      window.open(`https://www.mlb.com/gameday/${gameId}/live`, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Determine if it's a live game
  const isLive = gameStatus === 'Live' || gameStatus === 'In Progress';
  
  return (
    <div 
      className="inline-flex items-center px-4 py-1 border-r border-gray-700 last:border-r-0 cursor-pointer ticker-item-hover"
      onClick={handleClick}
    >
      {/* Away team */}
      <div className="flex items-center mr-1">
        <TeamLogo 
          teamId={awayTeam.id} 
          size={20} 
          fallbackText={awayFallback}
          team={awayTeamData}
        />
        <span className="ml-1 text-sm font-medium">{awayScore}</span>
      </div>
      
      <span className="text-xs text-gray-500 mx-1">@</span>
      
      {/* Home team */}
      <div className="flex items-center mr-2">
        <TeamLogo 
          teamId={homeTeam.id} 
          size={20} 
          fallbackText={homeFallback}
          team={homeTeamData}
        />
        <span className="ml-1 text-sm font-medium">{homeScore}</span>
      </div>
      
      {/* Game status */}
      {isLive ? (
        <div className="flex items-center">
          <span className="text-xs bg-red-600 text-white px-1 rounded mr-1">LIVE</span>
          <span className="text-xs text-gray-300">{inningHalf} {inning}</span>
        </div>
      ) : gameStatus === 'Final' ? (
        <span className="text-xs text-gray-400">FINAL</span>
      ) : (
        <span className="text-xs text-gray-400">
          {game?.gameDate ? new Date(game.gameDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
        </span>
      )}
    </div>
  );
};

const ScrollingScoresTicker = () => {
  const tickerRef = useRef(null);
  const [tickerWidth, setTickerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef(null);
  
  // Use SWR with a 5-minute cache for lightweight API calls
  const { data, error, isLoading } = useSWR(
    '/api/mlb/ticker',
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000 // 5 minutes
    }
  );
  
  // Get games from API response - with new lightweight format
  const allGames = data?.games || [];
  
  // Filter for live games first, then scheduled games, and lastly finals
  const liveGames = allGames.filter(game => 
    game.status.abstractGameState === 'Live' || 
    game.status.abstractGameState === 'In Progress'
  );
  
  const scheduledGames = allGames.filter(game =>
    game.status.abstractGameState === 'Preview' ||
    game.status.abstractGameState === 'Scheduled'
  );
  
  const finalGames = allGames.filter(game =>
    game.status.abstractGameState === 'Final'
  );
  
  // Prioritize live games, then add scheduled and finals
  const gamesToDisplay = [
    ...liveGames,
    ...scheduledGames,
    ...finalGames
  ];
  
  // Set up the scrolling animation
  useEffect(() => {
    if (!tickerRef.current || !contentRef.current) return;
    
    // Get and update widths for animation
    const updateWidths = () => {
      if (tickerRef.current && contentRef.current) {
        setTickerWidth(tickerRef.current.offsetWidth);
        setContentWidth(contentRef.current.scrollWidth);
      }
    };
    
    // Update widths initially and on window resize
    updateWidths();
    window.addEventListener('resize', updateWidths);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateWidths);
  }, [gamesToDisplay]);
  
  // Configure animation properties
  const animationDuration = Math.max(20, contentWidth / 50); // Slower for better readability
  const shouldScroll = contentWidth > tickerWidth;
  
  if (isLoading) {
    return (
      <div className="w-full bg-gray-900 border-y border-gray-700 py-2 px-4">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" color="blue" />
          <span className="ml-2 text-sm text-gray-400">Loading scores...</span>
        </div>
      </div>
    );
  }
  
  if (error || gamesToDisplay.length === 0) {
    return (
      <div className="w-full bg-gray-900 border-y border-gray-700 py-2 px-4">
        <p className="text-gray-400 text-sm text-center">
          No MLB games today. Check back later for updated scores.
        </p>
      </div>
    );
  }
  
  return (
    <div 
      ref={tickerRef}
      className="w-full bg-gray-900 border-y border-gray-700 py-2 overflow-hidden ticker-container relative"
    >
      {/* Live indicator badge */}
      {liveGames.length > 0 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center">
          <span className="animate-pulse mr-1">●</span> LIVE
        </div>
      )}
      
      {/* Scrolling content */}
      <div
        ref={contentRef}
        className={`inline-block whitespace-nowrap pl-24 ${shouldScroll ? 'scrolling-content' : ''}`}
        style={
          shouldScroll 
            ? {
                animation: `ticker ${animationDuration}s linear infinite`,
                paddingRight: '100px', // Extra padding at the end
              }
            : {}
        }
      >
        {gamesToDisplay.map((game) => (
          <TickerItem key={game.gamePk} game={game} />
        ))}
      </div>
      
      {/* Gradient fade left/right */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-900 to-transparent"></div>
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-900 to-transparent"></div>
      
      {/* Add CSS keyframes animation for the ticker */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${contentWidth}px); }
        }
        .scrolling-content {
          will-change: transform;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-delay: 1s;
        }
        
        /* Pause animation on hover for better user experience */
        .scrolling-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ScrollingScoresTicker;