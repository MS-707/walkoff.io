import React from 'react';
import TeamLogo from '@/components/teams/TeamLogo';
import { useTeamLogos } from '@/components/teams/TeamLogoProvider';

const GameStatus = ({ status }) => {
  // Different styles based on game status
  if (status === 'In Progress') {
    return <span className="text-red-500 font-medium">LIVE</span>;
  } else if (status === 'Final') {
    return <span className="font-medium">FINAL</span>;
  } else if (status === 'Scheduled') {
    return <span className="text-gray-500 font-medium">SCHEDULED</span>;
  } else if (status === 'Postponed') {
    return <span className="text-amber-500 font-medium">POSTPONED</span>;
  } else if (status === 'Delayed') {
    return <span className="text-amber-500 font-medium">DELAYED</span>;
  } else {
    return <span className="text-gray-500 font-medium">{status}</span>;
  }
};

const TeamRow = ({ team, score, isHome }) => {
  // Use the team logos context
  const { teamsById } = useTeamLogos();
  
  // Get team data from context if available
  const teamData = teamsById[team.id] || null;
  
  // Display team abbreviation as fallback text
  const fallbackText = team.abbreviation || team.name?.substr(0, 3) || '';
  
  return (
    <div className={`flex justify-between items-center py-2 ${isHome ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
      <div className="flex items-center">
        <div className="mr-3">
          <TeamLogo 
            teamId={team.id} 
            size={28} 
            fallbackText={fallbackText}
            team={teamData}
          />
        </div>
        <span className="font-medium">{team.name}</span>
      </div>
      <div className="text-xl font-bold">{score}</div>
    </div>
  );
};

const GameCard = ({ game }) => {
  // Extract data from game object with fallbacks
  const homeTeam = game?.teams?.home?.team || { name: 'Home Team' };
  const awayTeam = game?.teams?.away?.team || { name: 'Away Team' };
  const homeScore = game?.teams?.home?.score;
  const awayScore = game?.teams?.away?.score;
  const gameStatus = game?.status?.abstractGameState || 'Unknown';
  const gameTime = game?.gameDate 
    ? new Date(game.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'TBD';
  const inning = game?.linescore?.currentInning;
  const inningHalf = game?.linescore?.inningHalf;
  const gameId = game?.gamePk;
  
  // Generate MLB Gameday URL
  const getGamedayUrl = () => {
    if (!gameId) return null;
    
    // MLB's official Gameday URL
    return `https://www.mlb.com/gameday/${gameId}/live`;
  };
  
  // Handle click to open Gameday
  const handleGamedayClick = (e) => {
    e.preventDefault();
    const gamedayUrl = getGamedayUrl();
    
    if (gamedayUrl) {
      // Open in new tab
      window.open(gamedayUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Determine if game is clickable (has gameId and isn't in pre-game state)
  const isClickable = gameId && (gameStatus !== 'Preview' && gameStatus !== 'Scheduled');
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${
        isClickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 relative' : ''
      }`}
      onClick={isClickable ? handleGamedayClick : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? "Open game details" : undefined}
    >
      {isClickable && (
        <div className="absolute top-2 right-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <GameStatus status={gameStatus} />
        <div className="text-sm text-gray-500">
          {gameStatus === 'In Progress' 
            ? `${inningHalf} ${inning}` 
            : (gameStatus === 'Final' 
              ? 'Final' 
              : gameTime)}
        </div>
      </div>
      
      <TeamRow 
        team={awayTeam}
        score={awayScore}
        isHome={false}
      />
      
      <TeamRow 
        team={homeTeam}
        score={homeScore}
        isHome={true}
      />
      
      {isClickable && (
        <div className="mt-3 text-center text-xs text-blue-500 dark:text-blue-400 hover:underline">
          View Gameday
        </div>
      )}
    </div>
  );
};

export default GameCard;