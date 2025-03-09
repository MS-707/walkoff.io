'use client';

import React from 'react';
import Link from 'next/link';
import PlayerThumbnail from './PlayerThumbnail';
import PlayerTooltip from './PlayerTooltip';
import { getPlayerMlbUrl } from '@/lib/playerUtils';

/**
 * PlayerCell component combines player thumbnail, name and tooltip
 * 
 * @param {Object} props
 * @param {Object} props.player - Player data
 * @param {string} props.type - Type of stats (batting, pitching, fielding, statcast)
 * @param {string} [props.className] - Additional CSS classes
 */
const PlayerCell = ({ player, type, className = '' }) => {
  if (!player) return null;

  const playerUrl = getPlayerMlbUrl(player.name, player.id);
  
  return (
    <div className={`group relative flex items-center ${className}`}>
      {/* Player thumbnail */}
      <PlayerThumbnail 
        playerId={player.id} 
        playerName={player.name}
        size={40}
        className="mr-3"
      />
      
      {/* Player name with MLB link */}
      <Link 
        href={playerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      >
        {player.name || '-'}
      </Link>
      
      {/* Stats tooltip on hover */}
      <PlayerTooltip player={player} type={type} />
    </div>
  );
};

export default PlayerCell;