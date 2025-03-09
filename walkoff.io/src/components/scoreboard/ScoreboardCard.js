'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Game status indicator with appropriate styling
 */
const GameStatus = ({ game }) => {
  if (!game || !game.status) return null;
  
  const { abstractGameState, detailedState } = game.status;
  const inningState = game.linescore?.inningState;
  const currentInning = game.linescore?.currentInning;
  
  // Live game
  if (abstractGameState === 'Live') {
    return (
      <div className="flex items-center">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
        <span className="text-text font-medium">
          {inningState} {currentInning}
        </span>
      </div>
    );
  }
  
  // Final game
  if (abstractGameState === 'Final') {
    return (
      <span className="text-text-muted">
        Final{game.linescore?.innings?.length > 9 ? ` (${game.linescore.innings.length})` : ''}
      </span>
    );
  }
  
  // Upcoming game
  const gameTime = game.gameDate 
    ? new Date(game.gameDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';
  
  return <span className="text-text-muted">{gameTime || detailedState}</span>;
};

/**
 * Team display with logo and score
 */
const TeamDisplay = ({ team, score, isWinner, showLogo = true }) => {
  // Default placeholder logo if needed
  const logoUrl = team?.logo || `/mlb-logos/${team?.abbreviation || 'MLB'}.svg`;
  
  return (
    <div className="flex items-center">
      {showLogo && (
        <div className="w-8 h-8 mr-3 flex-shrink-0">
          <img 
            src={logoUrl} 
            alt={team?.name || 'Team'} 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/mlb-logos/MLB.svg';
            }}
          />
        </div>
      )}
      <div className={`flex-grow ${isWinner ? 'font-bold' : ''}`}>
        <span className={isWinner ? 'text-primary' : 'text-text'}>
          {team?.abbreviation || team?.teamName || team?.name || 'TBD'}
        </span>
      </div>
      {score !== undefined && (
        <div className={`text-xl font-mono ${isWinner ? 'font-bold text-primary' : 'text-text'}`}>
          {score}
        </div>
      )}
    </div>
  );
};

/**
 * Scoreboard card component for a single game
 */
export default function ScoreboardCard({ game, className = '' }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!game || !game.teams) {
    return (
      <div className={`bg-surface rounded-lg p-4 flex flex-col shadow-md ${className}`}>
        <div className="animate-pulse flex flex-col space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  const { away, home } = game.teams;
  const awayScore = away.score !== undefined ? away.score : null;
  const homeScore = home.score !== undefined ? home.score : null;
  
  // Determine winner (if game is final)
  const isGameFinal = game.status?.abstractGameState === 'Final';
  const awayWinner = isGameFinal && awayScore > homeScore;
  const homeWinner = isGameFinal && homeScore > awayScore;
  
  // Game is in progress or final, show linescore if available
  const hasLinescore = game.linescore && game.linescore.innings && game.linescore.innings.length > 0;
  
  return (
    <div className={`bg-surface hover:bg-surface-dark transition-colors duration-200 rounded-lg p-4 flex flex-col shadow-md ${className}`}>
      {/* Game status */}
      <div className="flex justify-between items-center mb-3">
        <GameStatus game={game} />
        
        {/* Expand/collapse button for linescore */}
        {hasLinescore && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-text-muted hover:text-primary transition-colors duration-200"
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>
      
      {/* Away team */}
      <div className="mb-3">
        <TeamDisplay 
          team={away.team} 
          score={awayScore} 
          isWinner={awayWinner}
        />
      </div>
      
      {/* Home team */}
      <div className="mb-3">
        <TeamDisplay 
          team={home.team} 
          score={homeScore} 
          isWinner={homeWinner}
        />
      </div>
      
      {/* Expanded linescore */}
      {expanded && hasLinescore && (
        <div className="mt-2 border-t border-gray-700 pt-3">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-1 text-left">Team</th>
                {game.linescore.innings.map((inning, i) => (
                  <th key={i} className="py-1 px-1">{i + 1}</th>
                ))}
                <th className="py-1 px-1">R</th>
                <th className="py-1 px-1">H</th>
                <th className="py-1 px-1">E</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-1 text-left">{away.team.abbreviation}</td>
                {game.linescore.innings.map((inning, i) => (
                  <td key={i} className="py-1 px-1">{inning.away?.runs ?? '-'}</td>
                ))}
                <td className="py-1 px-1">{game.linescore.teams?.away?.runs ?? '-'}</td>
                <td className="py-1 px-1">{game.linescore.teams?.away?.hits ?? '-'}</td>
                <td className="py-1 px-1">{game.linescore.teams?.away?.errors ?? '-'}</td>
              </tr>
              <tr>
                <td className="py-1 text-left">{home.team.abbreviation}</td>
                {game.linescore.innings.map((inning, i) => (
                  <td key={i} className="py-1 px-1">{inning.home?.runs ?? '-'}</td>
                ))}
                <td className="py-1 px-1">{game.linescore.teams?.home?.runs ?? '-'}</td>
                <td className="py-1 px-1">{game.linescore.teams?.home?.hits ?? '-'}</td>
                <td className="py-1 px-1">{game.linescore.teams?.home?.errors ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Game details link */}
      <div className="mt-auto pt-2">
        <Link
          href={`/game/${game.gamePk}`}
          className="text-sm text-center block w-full py-1 rounded bg-secondary hover:bg-secondary-dark transition-colors duration-200"
        >
          View Game Details
        </Link>
      </div>
    </div>
  );
}