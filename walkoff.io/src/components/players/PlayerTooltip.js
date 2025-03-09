'use client';

import React from 'react';
import { getPlayerTooltipStats } from '@/lib/playerUtils';

/**
 * PlayerTooltip component for displaying player stats on hover
 * 
 * @param {Object} props
 * @param {Object} props.player - Player data
 * @param {string} props.type - Type of stats (batting, pitching, fielding, statcast)
 * @param {string} [props.className] - Additional CSS classes
 */
const PlayerTooltip = ({ player, type, className = '' }) => {
  if (!player) return null;
  
  const stats = getPlayerTooltipStats(player, type);
  const statEntries = Object.entries(stats);
  
  return (
    <div className={`
      hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
      bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 z-20
      min-w-[150px] text-sm border border-gray-200 dark:border-gray-700
      ${className}
    `}>
      <div className="font-semibold text-center mb-1 border-b pb-1 dark:border-gray-700">
        {player.name}
      </div>
      
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {statEntries.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{label}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
      
      {/* Tooltip arrow */}
      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 
                    border-l-8 border-r-8 border-t-8 
                    border-l-transparent border-r-transparent 
                    border-t-white dark:border-t-gray-800" />
    </div>
  );
};

export default PlayerTooltip;