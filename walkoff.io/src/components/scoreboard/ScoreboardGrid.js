import React from 'react';
import GameCard from './GameCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ScoreboardGrid = ({ games, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" color="blue" />
        </div>
        <p className="text-center mt-4 text-gray-500">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg inline-block">
          <p>Failed to load scoreboard data</p>
          <button 
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500">No games scheduled for today</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <GameCard key={game.gamePk} game={game} />
      ))}
    </div>
  );
};

export default ScoreboardGrid;