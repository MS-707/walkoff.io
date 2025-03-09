'use client';

import { useState } from 'react';
import { useLeadersUpdates } from '@/lib/api/mlb/mlbRealTimeService';
import Link from 'next/link';

// Helper to get team abbreviation color
const getTeamColor = (teamAbbreviation) => {
  const teamColors = {
    // AL East
    'BAL': '#BA0C2F', // Orioles orange
    'BOS': '#BD3039', // Red Sox red
    'NYY': '#003DA5', // Yankees blue
    'TB': '#092C5C',  // Rays navy
    'TOR': '#134A8E', // Blue Jays blue
    
    // AL Central
    'CWS': '#C6011F', // White Sox red
    'CLE': '#CC0000', // Guardians red
    'DET': '#0C2C56', // Tigers navy
    'KC': '#004687',  // Royals blue
    'MIN': '#002B5C', // Twins navy
    
    // AL West
    'HOU': '#003831', // Astros green
    'LAA': '#003366', // Angels blue
    'OAK': '#006400', // Athletics green
    'SEA': '#005C5C', // Mariners teal
    'TEX': '#003278', // Rangers blue
    
    // NL East
    'ATL': '#13274F', // Braves navy
    'MIA': '#00A3E0', // Marlins blue
    'NYM': '#002D72', // Mets blue
    'PHI': '#E81828', // Phillies red
    'WSH': '#AB0003', // Nationals red
    
    // NL Central
    'CHC': '#CC3433', // Cubs red
    'CIN': '#C6011F', // Reds red
    'MIL': '#12284B', // Brewers navy
    'PIT': '#C41E3A', // Pirates red
    'STL': '#C41E3A', // Cardinals red
    
    // NL West
    'ARI': '#A71930', // Diamondbacks red
    'COL': '#333366', // Rockies purple
    'LAD': '#005A9C', // Dodgers blue
    'SD': '#FD5A1E',  // Padres orange
    'SF': '#FD5A1E',  // Giants orange
  };
  
  return teamColors[teamAbbreviation] || '#333333';
};

// Individual leader row
const LeaderRow = ({ leader, index, showRank = true }) => {
  return (
    <div className="flex items-center py-2 hover:bg-surface-dark transition-colors duration-200">
      {showRank && (
        <div className="w-8 text-center text-text-muted">{leader.rank}</div>
      )}
      <div className="flex-grow flex items-center">
        <div 
          className="w-4 h-4 rounded-full mr-2" 
          style={{ backgroundColor: getTeamColor(leader.teamAbbreviation) }}
        ></div>
        <Link 
          href={`/player/${leader.playerId}`}
          className="text-text hover:text-primary transition-colors duration-200"
        >
          {leader.playerName}
        </Link>
        <span className="text-text-muted text-xs ml-2">
          {leader.teamAbbreviation}
        </span>
      </div>
      <div className="font-mono text-text">{leader.formattedValue}</div>
    </div>
  );
};

// Stats category component showing single category with leaders
const StatsCategory = ({ title, shortTitle, leaders = [], showViewAll = true }) => {
  // Display at most 5 leaders by default
  const displayLeaders = leaders.slice(0, 5);

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden">
      <div className="bg-secondary-dark p-3">
        <h3 className="font-semibold text-white">{title || shortTitle}</h3>
      </div>
      
      <div className="p-3">
        {displayLeaders.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {displayLeaders.map((leader, index) => (
              <LeaderRow key={index} leader={leader} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-text-muted">
            No data available
          </div>
        )}
        
        {showViewAll && leaders.length > 5 && (
          <div className="mt-3 text-right">
            <button className="text-primary text-sm hover:text-primary-light transition-colors duration-200">
              View All Leaders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Stats Leaders Component for MLB stat leaders
 */
export default function StatsLeaders({ 
  initialStatGroup = 'hitting',
  initialStatType = 'season', 
  limit = 10,
  className = '',
}) {
  const [statGroup, setStatGroup] = useState(initialStatGroup);
  const [statType, setStatType] = useState(initialStatType);
  
  // Use our hooks for real-time data
  const { leadersData, loading, error, lastUpdate, refresh } = useLeadersUpdates(
    statGroup,
    statType,
    limit
  );
  
  // Available stat groups
  const statGroups = [
    { id: 'hitting', label: 'Hitting' },
    { id: 'pitching', label: 'Pitching' },
    { id: 'fielding', label: 'Fielding' }
  ];
  
  // Available stat types
  const statTypes = [
    { id: 'season', label: 'Season' },
    { id: 'career', label: 'Career' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'lastWeek', label: 'Last Week' }
  ];
  
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">MLB Leaders</h2>
        
        <button
          onClick={() => refresh()}
          className="text-sm py-1 px-3 rounded bg-surface hover:bg-surface-dark text-text transition-colors duration-200"
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      
      {/* Stat group tabs */}
      <div className="mb-4">
        <div className="flex space-x-2 mb-2">
          {statGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setStatGroup(group.id)}
              className={`py-2 px-4 rounded-lg transition-colors duration-200 ${
                statGroup === group.id 
                  ? 'bg-secondary text-white' 
                  : 'bg-surface hover:bg-surface-dark text-text'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {statTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setStatType(type.id)}
              className={`py-1 px-3 rounded transition-colors duration-200 text-sm ${
                statType === type.id 
                  ? 'bg-primary text-white' 
                  : 'bg-surface hover:bg-surface-dark text-text'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-900/20 border border-red-700 text-white p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Error loading leaders data</h3>
          <p>{error}</p>
          <button 
            onClick={() => refresh()} 
            className="mt-2 bg-primary hover:bg-primary-dark text-white px-4 py-1 rounded transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Categories grid - different for different stat groups */}
      {!loading && !error && leadersData?.categories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Display categories based on the selected stat group */}
          {leadersData.categories.map((category, index) => (
            <StatsCategory
              key={category.categoryName || index}
              title={category.displayName}
              shortTitle={category.shortName}
              leaders={category.leaders}
            />
          ))}
        </div>
      )}
      
      {/* Last update info */}
      {lastUpdate && (
        <div className="mt-6 text-center text-text-muted text-sm">
          Last updated: {lastUpdate.toLocaleTimeString()}
          {leadersData?.cached && ' (from cache)'}
          {leadersData?.stale && ' (stale data)'}
        </div>
      )}
    </div>
  );
}