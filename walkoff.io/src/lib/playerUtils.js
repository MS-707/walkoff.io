/**
 * Utilities for working with player data
 */

/**
 * Creates a proper URL slug for a player name
 * @param {string} name - The player's full name
 * @returns {string} URL-friendly slug
 */
export const createPlayerSlug = (name) => {
  if (!name) return '';
  
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')  // Remove non-alphanumeric chars except hyphens
    .replace(/-+/g, '-')  // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
};

/**
 * Constructs the official MLB player page URL
 * @param {string} playerName - The player's full name
 * @param {string|number} playerId - The player's MLBAM ID
 * @returns {string} The full URL to the player's official MLB page
 */
export const getPlayerMlbUrl = (playerName, playerId) => {
  if (!playerId) return '';
  
  const nameSlug = createPlayerSlug(playerName);
  return `https://www.mlb.com/player/${nameSlug}/${playerId}`;
};

/**
 * Gets a list of possible player image URLs to try
 * @param {string|number} playerId - The player's MLBAM ID
 * @returns {string[]} Array of URLs to try for player images
 */
export const getPlayerImageUrls = (playerId) => {
  if (!playerId) return [];
  
  return [
    `https://img.mlbstatic.com/mlb-photos/image/upload/w_180,h_270,q_auto/v1/people/${playerId}/headshot/67/current`,
    `https://www.mlbstatic.com/players/${playerId}.jpg`,
    `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_180,h_270,q_auto/v1/people/${playerId}/headshot/67/current`
  ];
};

/**
 * Extracts key stats for player tooltips based on player type
 * @param {Object} player - Player data object
 * @param {string} type - Type of stats (batting, pitching, fielding, statcast)
 * @returns {Object} Formatted key stats for the tooltip
 */
export const getPlayerTooltipStats = (player, type) => {
  if (!player) return {};
  
  switch (type) {
    case 'batting':
      return {
        AVG: player.AVG ? player.AVG.toFixed(3).replace(/^0+/, '') : '-',
        HR: player.HR || 0,
        RBI: player.RBI || 0,
        OPS: player.OPS ? player.OPS.toFixed(3).replace(/^0+/, '') : '-',
      };
    case 'pitching':
      return {
        ERA: player.ERA ? player.ERA.toFixed(2) : '-',
        W: player.W || 0,
        SO: player.SO || 0,
        WHIP: player.WHIP ? player.WHIP.toFixed(2) : '-',
      };
    case 'fielding':
      return {
        FP: player.FP ? player.FP.toFixed(3).replace(/^0+/, '') : '-',
        PO: player.PO || 0,
        A: player.A || 0,
        E: player.E || 0,
      };
    case 'statcast':
      return {
        'Exit Velo': player.exit_velocity ? `${player.exit_velocity.toFixed(1)} mph` : '-',
        'Launch Angle': player.launch_angle ? `${player.launch_angle.toFixed(1)}°` : '-',
        'Barrel %': player.barrel_pct ? `${(player.barrel_pct * 100).toFixed(1)}%` : '-',
      };
    default:
      return {};
  }
};