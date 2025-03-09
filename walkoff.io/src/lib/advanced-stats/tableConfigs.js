/**
 * Table configuration for different stat types
 */

// Batting stats table configuration
const battingConfig = {
  title: 'Batting Statistics',
  columns: [
    { key: 'name', label: 'Player', highlight: true },
    { key: 'team', label: 'Team' },
    { key: 'position', label: 'Pos' },
    { key: 'G', label: 'G', format: 'integer' },
    { key: 'PA', label: 'PA', format: 'integer' },
    { key: 'AB', label: 'AB', format: 'integer' },
    { key: 'H', label: 'H', format: 'integer' },
    { key: 'HR', label: 'HR', format: 'integer' },
    { key: 'RBI', label: 'RBI', format: 'integer' },
    { key: 'SB', label: 'SB', format: 'integer' },
    { key: 'AVG', label: 'AVG', format: 'decimal' },
    { key: 'OBP', label: 'OBP', format: 'decimal' },
    { key: 'SLG', label: 'SLG', format: 'decimal' },
    { key: 'OPS', label: 'OPS', format: 'decimal' },
    { key: 'WAR', label: 'WAR', format: 'decimal2' },
    { key: 'wOBA', label: 'wOBA', format: 'decimal' },
    { key: 'xwOBA', label: 'xwOBA', format: 'decimal' }
  ]
};

// Pitching stats table configuration
const pitchingConfig = {
  title: 'Pitching Statistics',
  columns: [
    { key: 'name', label: 'Player', highlight: true },
    { key: 'team', label: 'Team' },
    { key: 'W', label: 'W', format: 'integer' },
    { key: 'L', label: 'L', format: 'integer' },
    { key: 'ERA', label: 'ERA', format: 'decimal2' },
    { key: 'G', label: 'G', format: 'integer' },
    { key: 'GS', label: 'GS', format: 'integer' },
    { key: 'SV', label: 'SV', format: 'integer' },
    { key: 'IP', label: 'IP', format: 'decimal2' },
    { key: 'SO', label: 'SO', format: 'integer' },
    { key: 'BB', label: 'BB', format: 'integer' },
    { key: 'WHIP', label: 'WHIP', format: 'decimal2' },
    { key: 'K9', label: 'K/9', format: 'decimal2' },
    { key: 'BB9', label: 'BB/9', format: 'decimal2' },
    { key: 'HR9', label: 'HR/9', format: 'decimal2' },
    { key: 'FIP', label: 'FIP', format: 'decimal2' },
    { key: 'xERA', label: 'xERA', format: 'decimal2' },
    { key: 'WAR', label: 'WAR', format: 'decimal2' }
  ]
};

// Fielding stats table configuration
const fieldingConfig = {
  title: 'Fielding Statistics',
  columns: [
    { key: 'name', label: 'Player', highlight: true },
    { key: 'team', label: 'Team' },
    { key: 'position', label: 'Pos' },
    { key: 'G', label: 'G', format: 'integer' },
    { key: 'INN', label: 'Inn', format: 'decimal2' },
    { key: 'PO', label: 'PO', format: 'integer' },
    { key: 'A', label: 'A', format: 'integer' },
    { key: 'E', label: 'E', format: 'integer' },
    { key: 'DP', label: 'DP', format: 'integer' },
    { key: 'FP', label: 'FP', format: 'decimal' },
    { key: 'RF', label: 'RF', format: 'decimal2' },
    { key: 'dWAR', label: 'dWAR', format: 'decimal2' },
    { key: 'DRS', label: 'DRS', format: 'integer' },
    { key: 'UZR', label: 'UZR', format: 'decimal2' },
    { key: 'OAA', label: 'OAA', format: 'integer' }
  ]
};

// Statcast stats table configuration
const statcastConfig = {
  title: 'Statcast Data',
  columns: [
    { key: 'name', label: 'Player', highlight: true },
    { key: 'team', label: 'Team' },
    { key: 'exit_velocity', label: 'Exit Velo', format: 'decimal2' },
    { key: 'launch_angle', label: 'Launch Angle', format: 'decimal2' },
    { key: 'sprint_speed', label: 'Sprint Speed', format: 'decimal2' },
    { key: 'barrel_pct', label: 'Barrel %', format: 'percent' },
    { key: 'hard_hit_pct', label: 'Hard Hit %', format: 'percent' },
    { key: 'sweet_spot_pct', label: 'Sweet Spot %', format: 'percent' },
    { key: 'xBA', label: 'xBA', format: 'decimal' },
    { key: 'xSLG', label: 'xSLG', format: 'decimal' },
    { key: 'xwOBA', label: 'xwOBA', format: 'decimal' },
    { key: 'z_swing_pct', label: 'Z-Swing %', format: 'percent' },
    { key: 'o_swing_pct', label: 'O-Swing %', format: 'percent' },
    { key: 'whiff_pct', label: 'Whiff %', format: 'percent' },
    { key: 'meatball_pct', label: 'Meatball %', format: 'percent' }
  ]
};

// Player comparison table configuration
const comparisonConfig = {
  title: 'Player Comparison',
  columns: [
    { key: 'name', label: 'Player', highlight: true },
    { key: 'team', label: 'Team' },
    { key: 'position', label: 'Pos' },
    { key: 'AVG', label: 'AVG', format: 'decimal' },
    { key: 'OBP', label: 'OBP', format: 'decimal' },
    { key: 'SLG', label: 'SLG', format: 'decimal' },
    { key: 'OPS', label: 'OPS', format: 'decimal' },
    { key: 'HR', label: 'HR', format: 'integer' },
    { key: 'RBI', label: 'RBI', format: 'integer' },
    { key: 'SB', label: 'SB', format: 'integer' },
    { key: 'WAR', label: 'WAR', format: 'decimal2' },
    { key: 'wOBA', label: 'wOBA', format: 'decimal' },
    { key: 'xwOBA', label: 'xwOBA', format: 'decimal' },
    { key: 'barrel_pct', label: 'Barrel %', format: 'percent' },
    { key: 'exit_velocity', label: 'Exit Velo', format: 'decimal2' }
  ]
};

/**
 * Get table configuration for a given stat type
 * @param {string} type - The type of stats ('batting', 'pitching', 'fielding', 'statcast', 'comparison')
 * @returns {object} The table configuration for the given type
 */
export const getTableConfig = (type) => {
  switch (type) {
    case 'batting':
      return battingConfig;
    case 'pitching':
      return pitchingConfig;
    case 'fielding':
      return fieldingConfig;
    case 'statcast':
      return statcastConfig;
    case 'comparison':
      return comparisonConfig;
    default:
      return battingConfig;
  }
};