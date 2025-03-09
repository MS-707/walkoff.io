'use client';

import React from 'react';

const MetricsHeader = ({ searchQuery, onSearchChange, season, onSeasonChange }) => {
  // Available seasons
  const currentYear = new Date().getFullYear();
  const availableSeasons = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2">Advanced MLB Metrics</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Explore detailed player and team statistics with advanced analytics.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by player or team..."
            className="w-full py-2 px-4 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Season selector */}
        <div className="flex-shrink-0">
          <select
            className="py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={season}
            onChange={(e) => onSeasonChange(Number(e.target.value))}
          >
            {availableSeasons.map(year => (
              <option key={year} value={year}>
                {year} Season
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MetricsHeader;