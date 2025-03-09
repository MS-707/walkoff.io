'use client';

import { useState } from 'react';
import { useScoreboardUpdates } from '@/lib/api/mlb/mlbRealTimeService';
import ScoreboardCard from './ScoreboardCard';

// Custom date selector component
const DateSelector = ({ currentDate, onDateChange }) => {
  const today = new Date();
  
  // Generate dates for the next 7 days and previous 7 days
  const dates = [];
  for (let i = -7; i <= 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-text font-medium">Select Date</h3>
        <button 
          onClick={() => onDateChange(today)}
          className="text-sm text-primary hover:text-primary-light transition-colors duration-200"
        >
          Today
        </button>
      </div>
      
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {dates.map((date) => {
          const isSelected = date.toDateString() === currentDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`flex-shrink-0 py-2 px-4 rounded-full transition-colors duration-200 ${
                isSelected 
                  ? 'bg-primary text-white' 
                  : 'bg-surface hover:bg-surface-dark text-text'
              } ${isToday ? 'border border-primary' : ''}`}
            >
              <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
              <div className="font-bold text-lg leading-none">{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Filter controls for the scoreboard
const ScoreboardFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: 'All Games' },
    { id: 'live', label: 'Live' },
    { id: 'final', label: 'Final' },
    { id: 'upcoming', label: 'Upcoming' }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${
              activeFilter === filter.id 
                ? 'bg-secondary text-white' 
                : 'bg-surface hover:bg-surface-dark text-text'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Scoreboard component
export default function Scoreboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Format date for API request
  const formattedDate = selectedDate.toISOString().split('T')[0];
  
  // Use our real-time scoreboard hook
  const { 
    scoreboardData, 
    loading, 
    error, 
    lastUpdate,
    refresh,
    hasLiveGames,
    pollingEnabled,
    enablePolling,
    disablePolling
  } = useScoreboardUpdates();
  
  // Filter games based on active filter
  const filterGames = (games) => {
    if (!games) return [];
    
    switch (activeFilter) {
      case 'live':
        return games.filter(game => 
          game.status?.abstractGameState === 'Live'
        );
      case 'final':
        return games.filter(game => 
          game.status?.abstractGameState === 'Final'
        );
      case 'upcoming':
        return games.filter(game => 
          game.status?.abstractGameState === 'Preview'
        );
      default:
        return games;
    }
  };
  
  // Filter and sort games
  const games = scoreboardData?.games || [];
  const filteredGames = filterGames(games);
  
  // Sort games: Live first, then Upcoming, then Final
  const sortedGames = [...filteredGames].sort((a, b) => {
    const gameStateOrder = {
      'Live': 0,
      'Preview': 1,
      'Final': 2
    };
    
    const aState = a.status?.abstractGameState;
    const bState = b.status?.abstractGameState;
    
    return gameStateOrder[aState] - gameStateOrder[bState];
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">MLB Scoreboard</h1>
        
        <div className="flex items-center space-x-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => pollingEnabled ? disablePolling() : enablePolling()}
            className={`text-sm py-1 px-3 rounded ${
              pollingEnabled 
                ? 'bg-secondary text-white' 
                : 'bg-surface text-text-muted'
            }`}
          >
            {pollingEnabled ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </button>
          
          {/* Manual refresh button */}
          <button
            onClick={() => refresh(formattedDate)}
            className="text-sm py-1 px-3 rounded bg-surface hover:bg-surface-dark text-text"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>
      
      {/* Date selector */}
      <DateSelector 
        currentDate={selectedDate} 
        onDateChange={(date) => {
          setSelectedDate(date);
          refresh(date.toISOString().split('T')[0]);
        }} 
      />
      
      {/* Filters */}
      <ScoreboardFilters 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-900/20 border border-red-700 text-white p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Error loading scoreboard</h3>
          <p>{error}</p>
          <button 
            onClick={() => refresh(formattedDate)} 
            className="mt-2 bg-primary hover:bg-primary-dark text-white px-4 py-1 rounded transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* No games message */}
      {!loading && !error && sortedGames.length === 0 && (
        <div className="bg-surface text-text p-8 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">No games found</h3>
          <p className="text-text-muted">
            There are no games scheduled for this date or matching your filters.
          </p>
        </div>
      )}
      
      {/* Games grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedGames.map(game => (
          <ScoreboardCard key={game.gamePk} game={game} />
        ))}
      </div>
      
      {/* Last update info */}
      {lastUpdate && (
        <div className="mt-6 text-center text-text-muted text-sm">
          Last updated: {lastUpdate.toLocaleTimeString()}
          {scoreboardData?.cached && ' (from cache)'}
          {scoreboardData?.stale && ' (stale data)'}
        </div>
      )}
    </div>
  );
}