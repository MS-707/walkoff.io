import React from 'react';

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

const TeamRow = ({ team, score, isHome }) => (
  <div className={`flex justify-between items-center py-2 ${isHome ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
    <div className="flex items-center">
      <div className="w-6 h-6 mr-3">
        {/* Placeholder for team logo */}
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <span className="font-medium">{team.name}</span>
    </div>
    <div className="text-xl font-bold">{score}</div>
  </div>
);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
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
    </div>
  );
};

export default GameCard;