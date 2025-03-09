'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PlayerCard from '@/components/players/PlayerCard';
import Link from 'next/link';

export default function PlayerPage() {
  const params = useParams();
  const { playerId } = params;
  
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/mlb/players/${playerId}`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setPlayer(data.player);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError(err.message || 'Failed to fetch player data');
        setLoading(false);
      }
    };
    
    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-red-900/20 border border-red-700 text-white p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error loading player</h2>
          <p className="mb-4">{error}</p>
          <Link
            href="/scoreboard"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors duration-200"
          >
            Return to Scoreboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Player not found
  if (!player) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-surface p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Player Not Found</h2>
          <p className="text-text-muted mb-6">
            The player you're looking for could not be found.
          </p>
          <Link
            href="/scoreboard"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors duration-200"
          >
            Return to Scoreboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-6">
        <Link
          href="/scoreboard"
          className="text-primary hover:text-primary-light transition-colors duration-200"
        >
          &larr; Back to Scoreboard
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {player.fullName} #{player.primaryNumber || ''}
        </h1>
        <div className="text-text-muted">
          {player.primaryPosition?.name || ''} | {player.currentTeam?.name || ''}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Player info */}
        <div>
          <div className="bg-surface rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
            <dl className="space-y-2">
              <div className="flex">
                <dt className="w-32 text-text-muted">Age:</dt>
                <dd>{player.currentAge || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">Height:</dt>
                <dd>{player.height || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">Weight:</dt>
                <dd>{player.weight ? `${player.weight} lbs` : 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">Bats:</dt>
                <dd>{player.batSide?.description || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">Throws:</dt>
                <dd>{player.pitchHand?.description || 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">Birth Date:</dt>
                <dd>{player.birthDate ? new Date(player.birthDate).toLocaleDateString() : 'N/A'}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">Birth Place:</dt>
                <dd>
                  {[player.birthCity, player.birthStateProvince, player.birthCountry]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
                </dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-text-muted">MLB Debut:</dt>
                <dd>{player.mlbDebutDate ? new Date(player.mlbDebutDate).toLocaleDateString() : 'N/A'}</dd>
              </div>
            </dl>
          </div>
          
          {/* Team info */}
          {player.currentTeam && (
            <div className="bg-surface rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Team Info</h2>
              <div className="flex justify-center mb-4">
                <img 
                  src={`/mlb-logos/${player.currentTeam.abbreviation}.svg`} 
                  alt={player.currentTeam.name}
                  className="h-32 w-32 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/mlb-logos/MLB.svg';
                  }}
                />
              </div>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="w-32 text-text-muted">Team:</dt>
                  <dd>{player.currentTeam.name}</dd>
                </div>
                {player.jerseyNumber && (
                  <div className="flex">
                    <dt className="w-32 text-text-muted">Jersey #:</dt>
                    <dd>{player.jerseyNumber}</dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="w-32 text-text-muted">Position:</dt>
                  <dd>{player.primaryPosition?.name || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        
        {/* Right column - Stats */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <PlayerCard player={player} className="w-full" />
          </div>
          
          {/* Career highlights */}
          <div className="bg-surface rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Career Highlights</h2>
            
            {player.careerStats?.hitting && Object.keys(player.careerStats.hitting).length > 0 ? (
              <div className="mb-6">
                <h3 className="font-medium mb-3 border-b border-gray-700 pb-1">Career Hitting</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">Games</div>
                    <div className="font-mono text-lg">{player.careerStats.hitting.gamesPlayed || 0}</div>
                  </div>
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">AVG</div>
                    <div className="font-mono text-lg">{player.careerStats.hitting.avg || '.000'}</div>
                  </div>
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">HR</div>
                    <div className="font-mono text-lg">{player.careerStats.hitting.homeRuns || 0}</div>
                  </div>
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">RBI</div>
                    <div className="font-mono text-lg">{player.careerStats.hitting.rbi || 0}</div>
                  </div>
                </div>
              </div>
            ) : null}
            
            {player.careerStats?.pitching && Object.keys(player.careerStats.pitching).length > 0 ? (
              <div>
                <h3 className="font-medium mb-3 border-b border-gray-700 pb-1">Career Pitching</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">Games</div>
                    <div className="font-mono text-lg">{player.careerStats.pitching.gamesPlayed || 0}</div>
                  </div>
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">ERA</div>
                    <div className="font-mono text-lg">{player.careerStats.pitching.era || '0.00'}</div>
                  </div>
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">W-L</div>
                    <div className="font-mono text-lg">
                      {player.careerStats.pitching.wins || 0}-{player.careerStats.pitching.losses || 0}
                    </div>
                  </div>
                  <div className="bg-surface-dark p-3 rounded">
                    <div className="text-text-muted text-xs">WHIP</div>
                    <div className="font-mono text-lg">{player.careerStats.pitching.whip || '0.00'}</div>
                  </div>
                </div>
              </div>
            ) : null}
            
            {(!player.careerStats?.hitting || Object.keys(player.careerStats.hitting).length === 0) && 
             (!player.careerStats?.pitching || Object.keys(player.careerStats.pitching).length === 0) && (
              <p className="text-text-muted">Career statistics not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}