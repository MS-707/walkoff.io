'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import TeamLogo from '@/components/teams/TeamLogo';
import { useTeamLogos } from '@/components/teams/TeamLogoProvider';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Fetch function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

const LiveGameItem = ({ game }) => {
  const { teamsById } = useTeamLogos();
  const router = useRouter();
  
  // Extract data
  const homeTeam = game?.teams?.home?.team || { name: 'Home' };
  const awayTeam = game?.teams?.away?.team || { name: 'Away' };
  const homeScore = game?.teams?.home?.score || 0;
  const awayScore = game?.teams?.away?.score || 0;
  const gameStatus = game?.status?.abstractGameState || 'Unknown';
  const inning = game?.linescore?.currentInning;
  const inningHalf = game?.linescore?.inningHalf;
  const gameId = game?.gamePk;
  
  // Get team data from context if available
  const homeTeamData = teamsById[homeTeam.id] || null;
  const awayTeamData = teamsById[awayTeam.id] || null;
  
  // Create fallback texts
  const homeFallback = homeTeam.abbreviation || homeTeam.name?.substr(0, 3) || '';
  const awayFallback = awayTeam.abbreviation || awayTeam.name?.substr(0, 3) || '';
  
  // Generate MLB Gameday URL
  const getGamedayUrl = () => {
    if (!gameId) return null;
    return `https://www.mlb.com/gameday/${gameId}/live`;
  };
  
  // Handle click events - either go to scoreboard or open Gameday
  const handleClick = (e) => {
    // If Shift or Ctrl key is pressed, let default behavior happen
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      return;
    }
    
    e.preventDefault();
    
    // Check if game has started or finished
    const gameActive = gameStatus === 'Live' || gameStatus === 'In Progress' || gameStatus === 'Final';
    
    if (gameActive && gameId) {
      // Open Gameday in new tab
      window.open(getGamedayUrl(), '_blank', 'noopener,noreferrer');
    } else {
      // Go to scoreboard page
      router.push('/scoreboard');
    }
  };
  
  return (
    <div 
      className="flex items-center space-x-3 px-3 py-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors relative"
      onClick={handleClick}
    >
      {(gameStatus === 'Live' || gameStatus === 'In Progress' || gameStatus === 'Final') && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1">
          <div className="bg-blue-500 rounded-full h-2 w-2 animate-pulse"></div>
        </div>
      )}
      
      <div className="flex items-center">
        <TeamLogo 
          teamId={awayTeam.id} 
          size={24} 
          fallbackText={awayFallback}
          team={awayTeamData}
        />
        <span className="ml-1 text-sm font-semibold">{awayScore}</span>
      </div>
      
      <span className="text-xs text-gray-400">@</span>
      
      <div className="flex items-center">
        <TeamLogo 
          teamId={homeTeam.id} 
          size={24} 
          fallbackText={homeFallback}
          team={homeTeamData}
        />
        <span className="ml-1 text-sm font-semibold">{homeScore}</span>
      </div>
      
      {gameStatus === 'In Progress' && (
        <div className="text-xs text-red-500 font-medium ml-auto">
          {`${inningHalf} ${inning}`}
        </div>
      )}
      
      {gameStatus === 'Final' && (
        <div className="text-xs text-gray-400 ml-auto">FINAL</div>
      )}
    </div>
  );
};

export default function LiveScoresTicker() {
  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR(
    `/api/mlb/scoreboard`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
      dedupingInterval: 15000 // Don't make duplicate requests within 15 seconds
    }
  );
  
  // Filter for live and recent games
  const allGames = data?.dates?.[0]?.games || [];
  const liveGames = allGames.filter(game => 
    game.status.abstractGameState === 'Live' || 
    game.status.abstractGameState === 'In Progress'
  );
  
  // If no live games, show recently completed games
  const recentGames = allGames.filter(game => 
    game.status.abstractGameState === 'Final'
  ).slice(0, 3);
  
  // Determine which games to display
  const gamesToDisplay = liveGames.length > 0 ? liveGames : recentGames;
  
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-gray-900 rounded-lg p-3">
        <div className="flex justify-center items-center py-2">
          <LoadingSpinner size="sm" color="blue" />
          <span className="ml-2 text-sm text-gray-400">Loading live scores...</span>
        </div>
      </div>
    );
  }
  
  if (error || gamesToDisplay.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-gray-900 rounded-lg p-3">
        <p className="text-gray-400 text-sm text-center">
          No games in progress
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden bg-gray-900 rounded-lg p-2">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
        {liveGames.length > 0 ? 'Live Games' : 'Recent Games'}
      </h3>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {gamesToDisplay.map((game) => (
          <LiveGameItem key={game.gamePk} game={game} />
        ))}
      </div>
    </div>
  );
}