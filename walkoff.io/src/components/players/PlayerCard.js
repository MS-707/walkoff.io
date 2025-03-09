'use client';

import { useState } from 'react';
import Link from 'next/link';

// Helper function to get a team's primary color
const getTeamColor = (teamId) => {
  const teamColors = {
    // AL East
    110: '#BA0C2F', // BAL - Orioles orange
    111: '#BD3039', // BOS - Red Sox red
    147: '#003DA5', // NYY - Yankees blue
    139: '#092C5C', // TB - Rays navy
    141: '#134A8E', // TOR - Blue Jays blue
    
    // AL Central
    145: '#C6011F', // CWS - White Sox red
    114: '#CC0000', // CLE - Guardians red
    116: '#0C2C56', // DET - Tigers navy
    118: '#004687', // KC - Royals blue
    142: '#002B5C', // MIN - Twins navy
    
    // AL West
    117: '#003831', // HOU - Astros green
    108: '#003366', // LAA - Angels blue
    133: '#006400', // OAK - Athletics green
    136: '#005C5C', // SEA - Mariners teal
    140: '#003278', // TEX - Rangers blue
    
    // NL East
    144: '#13274F', // ATL - Braves navy
    146: '#00A3E0', // MIA - Marlins blue
    121: '#002D72', // NYM - Mets blue
    143: '#E81828', // PHI - Phillies red
    120: '#AB0003', // WSH - Nationals red
    
    // NL Central
    112: '#CC3433', // CHC - Cubs red
    113: '#C6011F', // CIN - Reds red
    158: '#12284B', // MIL - Brewers navy
    134: '#C41E3A', // PIT - Pirates red
    138: '#C41E3A', // STL - Cardinals red
    
    // NL West
    109: '#A71930', // ARI - Diamondbacks red
    115: '#333366', // COL - Rockies purple
    119: '#005A9C', // LAD - Dodgers blue
    135: '#FD5A1E', // SD - Padres orange
    137: '#FD5A1E', // SF - Giants orange
  };
  
  return teamColors[teamId] || '#333333';
};

/**
 * Player Card component for displaying player information
 */
export default function PlayerCard({ player, className = '' }) {
  const [activeTab, setActiveTab] = useState('hitting');
  
  if (!player) {
    return (
      <div className={`bg-surface rounded-lg p-4 shadow-md ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  // Determine which stats to show based on active tab and position
  const isPitcher = player.primaryPosition?.code === 'P';
  const defaultTab = isPitcher ? 'pitching' : 'hitting';
  
  // Use the selected tab unless it doesn't make sense for this player
  const displayTab = activeTab || defaultTab;
  
  // Extract player information
  const { 
    id, 
    fullName, 
    primaryNumber, 
    currentTeam, 
    primaryPosition,
    stats = [],
  } = player;
  
  // Get current season stats
  const currentHittingStats = stats?.find(stat => 
    stat.group?.displayName === 'hitting' && 
    stat.type?.displayName === 'season'
  )?.splits?.[0]?.stat || {};
  
  const currentPitchingStats = stats?.find(stat => 
    stat.group?.displayName === 'pitching' && 
    stat.type?.displayName === 'season'
  )?.splits?.[0]?.stat || {};
  
  const currentFieldingStats = stats?.find(stat => 
    stat.group?.displayName === 'fielding' && 
    stat.type?.displayName === 'season'
  )?.splits?.[0]?.stat || {};
  
  // Team color for styling
  const teamColor = currentTeam?.id ? getTeamColor(currentTeam.id) : '#333333';
  
  return (
    <div className={`bg-surface rounded-lg overflow-hidden shadow-md ${className}`}>
      {/* Header with player name and team */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: teamColor }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{fullName}</h3>
            <div className="text-white/80">
              {currentTeam?.name} {primaryNumber ? `#${primaryNumber}` : ''}
            </div>
            <div className="text-white/80">
              {primaryPosition?.name || 'Unknown Position'}
            </div>
          </div>
          
          {/* Team logo */}
          {currentTeam?.id && (
            <div className="w-16 h-16">
              <img 
                src={`/mlb-logos/${currentTeam.abbreviation}.svg`} 
                alt={currentTeam.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/mlb-logos/MLB.svg';
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Stat tabs */}
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 text-center transition-colors ${
              displayTab === 'hitting' 
                ? 'bg-surface-dark text-primary border-b-2 border-primary' 
                : 'text-text-muted hover:bg-surface-dark'
            }`}
            onClick={() => setActiveTab('hitting')}
          >
            Hitting
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center transition-colors ${
              displayTab === 'pitching' 
                ? 'bg-surface-dark text-primary border-b-2 border-primary' 
                : 'text-text-muted hover:bg-surface-dark'
            }`}
            onClick={() => setActiveTab('pitching')}
          >
            Pitching
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center transition-colors ${
              displayTab === 'fielding' 
                ? 'bg-surface-dark text-primary border-b-2 border-primary' 
                : 'text-text-muted hover:bg-surface-dark'
            }`}
            onClick={() => setActiveTab('fielding')}
          >
            Fielding
          </button>
        </div>
      </div>
      
      {/* Hitting stats */}
      {displayTab === 'hitting' && (
        <div className="p-4">
          <h4 className="font-medium mb-2">Hitting Stats</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">AVG</div>
              <div className="font-mono text-text">{currentHittingStats.avg || '.000'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">HR</div>
              <div className="font-mono text-text">{currentHittingStats.homeRuns || 0}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">RBI</div>
              <div className="font-mono text-text">{currentHittingStats.rbi || 0}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">OBP</div>
              <div className="font-mono text-text">{currentHittingStats.obp || '.000'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">SLG</div>
              <div className="font-mono text-text">{currentHittingStats.slg || '.000'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">OPS</div>
              <div className="font-mono text-text">{currentHittingStats.ops || '.000'}</div>
            </div>
          </div>
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-1">G</th>
                <th className="text-left py-1">AB</th>
                <th className="text-left py-1">H</th>
                <th className="text-left py-1">2B</th>
                <th className="text-left py-1">3B</th>
                <th className="text-left py-1">HR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">{currentHittingStats.gamesPlayed || 0}</td>
                <td className="py-1">{currentHittingStats.atBats || 0}</td>
                <td className="py-1">{currentHittingStats.hits || 0}</td>
                <td className="py-1">{currentHittingStats.doubles || 0}</td>
                <td className="py-1">{currentHittingStats.triples || 0}</td>
                <td className="py-1">{currentHittingStats.homeRuns || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pitching stats */}
      {displayTab === 'pitching' && (
        <div className="p-4">
          <h4 className="font-medium mb-2">Pitching Stats</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">ERA</div>
              <div className="font-mono text-text">{currentPitchingStats.era || '0.00'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">W-L</div>
              <div className="font-mono text-text">
                {currentPitchingStats.wins || 0}-{currentPitchingStats.losses || 0}
              </div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">SO</div>
              <div className="font-mono text-text">{currentPitchingStats.strikeOuts || 0}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">WHIP</div>
              <div className="font-mono text-text">{currentPitchingStats.whip || '0.00'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">IP</div>
              <div className="font-mono text-text">{currentPitchingStats.inningsPitched || '0.0'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">SV</div>
              <div className="font-mono text-text">{currentPitchingStats.saves || 0}</div>
            </div>
          </div>
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-1">G</th>
                <th className="text-left py-1">GS</th>
                <th className="text-left py-1">BB</th>
                <th className="text-left py-1">SO</th>
                <th className="text-left py-1">H</th>
                <th className="text-left py-1">HR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">{currentPitchingStats.gamesPlayed || 0}</td>
                <td className="py-1">{currentPitchingStats.gamesStarted || 0}</td>
                <td className="py-1">{currentPitchingStats.baseOnBalls || 0}</td>
                <td className="py-1">{currentPitchingStats.strikeOuts || 0}</td>
                <td className="py-1">{currentPitchingStats.hits || 0}</td>
                <td className="py-1">{currentPitchingStats.homeRuns || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Fielding stats */}
      {displayTab === 'fielding' && (
        <div className="p-4">
          <h4 className="font-medium mb-2">Fielding Stats</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">FLD%</div>
              <div className="font-mono text-text">{currentFieldingStats.fielding || '.000'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">POS</div>
              <div className="font-mono text-text">{primaryPosition?.abbreviation || '-'}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">G</div>
              <div className="font-mono text-text">{currentFieldingStats.gamesPlayed || 0}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">PO</div>
              <div className="font-mono text-text">{currentFieldingStats.putOuts || 0}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">A</div>
              <div className="font-mono text-text">{currentFieldingStats.assists || 0}</div>
            </div>
            <div className="bg-surface-dark p-2 rounded">
              <div className="text-text-muted text-xs">E</div>
              <div className="font-mono text-text">{currentFieldingStats.errors || 0}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Player details link */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href={`/player/${id}`}
          className="text-sm text-center block w-full py-2 rounded bg-secondary hover:bg-secondary-dark transition-colors duration-200"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
}