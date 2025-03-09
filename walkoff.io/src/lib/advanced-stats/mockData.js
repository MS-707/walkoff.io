/**
 * Mock data for advanced stats
 * This would be replaced with actual pybaseball data in a production implementation
 */

// Generate mock batting stats
export const generateMockBattingStats = (count = 100) => {
  const positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
  const teams = ['NYY', 'BOS', 'TOR', 'TB', 'BAL', 'CLE', 'CWS', 'MIN', 'KC', 'DET', 
               'HOU', 'LAA', 'SEA', 'OAK', 'TEX', 'ATL', 'PHI', 'NYM', 'MIA', 'WSH',
               'MIL', 'CHC', 'STL', 'CIN', 'PIT', 'LAD', 'SD', 'SF', 'ARI', 'COL'];
  
  const firstNames = ['Mike', 'Aaron', 'José', 'Shohei', 'Juan', 'Bryce', 'Freddie', 'Mookie', 'Ronald', 'Fernando',
                     'Nolan', 'Alex', 'Francisco', 'Rafael', 'Corey', 'Trea', 'Tim', 'Bo', 'Vladimir', 'Manny'];
  
  const lastNames = ['Trout', 'Judge', 'Ramírez', 'Ohtani', 'Soto', 'Harper', 'Freeman', 'Betts', 'Acuña', 'Tatís',
                    'Arenado', 'Bregman', 'Lindor', 'Devers', 'Seager', 'Turner', 'Anderson', 'Bichette', 'Guerrero', 'Machado'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = 100000 + i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const team = teams[Math.floor(Math.random() * teams.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const teamId = 108 + Math.floor(Math.random() * 30);
    
    // Generate realistic baseball stats
    const G = Math.floor(Math.random() * 100) + 50; // 50-150 games
    const PA = G * (Math.floor(Math.random() * 2) + 3); // 3-5 plate appearances per game
    const AB = Math.floor(PA * 0.9); // ~90% of plate appearances are at-bats
    const H = Math.floor(AB * (Math.random() * 0.2 + 0.2)); // .200-.400 batting average
    const HR = Math.floor(H * (Math.random() * 0.2)); // ~0-20% of hits are home runs
    const RBI = HR * (Math.floor(Math.random() * 2) + 1) + Math.floor(H * 0.3); // RBIs based on HR and hits
    const SB = Math.floor(Math.random() * 20); // 0-20 stolen bases
    
    const AVG = H / AB;
    const OBP = (H + Math.floor(PA * 0.1)) / PA; // Adding ~10% of PA as walks
    const SLG = (H + HR * 3) / AB; // Single + HR weighted by 3
    const OPS = OBP + SLG;
    const WAR = Math.random() * 8; // 0-8 WAR
    
    // Advanced metrics
    const wOBA = 0.3 + Math.random() * 0.15; // .300-.450 wOBA
    const xwOBA = wOBA + (Math.random() * 0.04 - 0.02); // +/- .020 from wOBA
    
    return {
      id,
      name,
      team,
      teamId,
      position,
      G,
      PA,
      AB,
      H,
      HR,
      RBI,
      SB,
      AVG,
      OBP,
      SLG,
      OPS,
      WAR,
      wOBA,
      xwOBA
    };
  });
};

// Generate mock pitching stats
export const generateMockPitchingStats = (count = 60) => {
  const teams = ['NYY', 'BOS', 'TOR', 'TB', 'BAL', 'CLE', 'CWS', 'MIN', 'KC', 'DET', 
               'HOU', 'LAA', 'SEA', 'OAK', 'TEX', 'ATL', 'PHI', 'NYM', 'MIA', 'WSH',
               'MIL', 'CHC', 'STL', 'CIN', 'PIT', 'LAD', 'SD', 'SF', 'ARI', 'COL'];
  
  const firstNames = ['Gerrit', 'Jacob', 'Max', 'Corbin', 'Shane', 'Justin', 'Zack', 'Walker', 'Clayton', 'Aaron',
                     'Jack', 'Dylan', 'Alek', 'Sandy', 'Shohei', 'Blake', 'Kevin', 'Lance', 'Luis', 'Tyler'];
  
  const lastNames = ['Cole', 'deGrom', 'Scherzer', 'Burnes', 'Bieber', 'Verlander', 'Wheeler', 'Buehler', 'Kershaw', 'Nola',
                    'Flaherty', 'Cease', 'Manoah', 'Alcantara', 'Ohtani', 'Snell', 'Gausman', 'McCullers', 'Castillo', 'Glasnow'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = 200000 + i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const team = teams[Math.floor(Math.random() * teams.length)];
    const teamId = 108 + Math.floor(Math.random() * 30);
    
    // Generate realistic pitching stats
    const G = Math.floor(Math.random() * 20) + 15; // 15-35 games
    const GS = Math.floor(G * (Math.random() * 0.8 + 0.2)); // ~20-100% are starts
    const IP = GS * (Math.floor(Math.random() * 3) + 4) + (G - GS) * (Math.random() + 0.5); // 4-7 IP per start, 0.5-1.5 IP per relief
    const W = Math.floor(GS * (Math.random() * 0.6 + 0.1)); // Wins: 10-70% of starts
    const L = Math.floor(GS * (Math.random() * 0.5 + 0.1)); // Losses: 10-60% of starts
    const SV = GS < G ? Math.floor((G - GS) * (Math.random() * 0.7)) : 0; // Saves for relievers
    
    const SO = Math.floor(IP * (Math.random() * 6 + 6)); // 6-12 K/9
    const BB = Math.floor(IP * (Math.random() * 2 + 1)); // 1-3 BB/9
    const HR_allowed = Math.floor(IP * (Math.random() * 1 + 0.5)); // 0.5-1.5 HR/9
    
    const ER = Math.floor(HR_allowed * (Math.random() * 1.5 + 1) + BB * (Math.random() * 0.3)); // Earned runs based on HR and BB
    const ERA = (ER / IP) * 9;
    const WHIP = (BB + Math.floor(IP * (Math.random() * 6 + 4))) / IP; // BB + Hits / IP
    
    // Rate stats
    const K9 = SO / IP * 9;
    const BB9 = BB / IP * 9;
    const HR9 = HR_allowed / IP * 9;
    
    // Advanced metrics
    const FIP = (13 * HR_allowed + 3 * BB - 2 * SO) / IP + 3.10;
    const xERA = FIP + (Math.random() * 0.5 - 0.25); // +/- 0.25 from FIP
    const WAR = Math.random() * 7; // 0-7 WAR
    
    return {
      id,
      name,
      team,
      teamId,
      W,
      L,
      ERA,
      G,
      GS,
      SV,
      IP,
      SO,
      BB,
      WHIP,
      K9,
      BB9,
      HR9,
      FIP,
      xERA,
      WAR
    };
  });
};

// Generate mock fielding stats
export const generateMockFieldingStats = (count = 80) => {
  const positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
  const teams = ['NYY', 'BOS', 'TOR', 'TB', 'BAL', 'CLE', 'CWS', 'MIN', 'KC', 'DET', 
               'HOU', 'LAA', 'SEA', 'OAK', 'TEX', 'ATL', 'PHI', 'NYM', 'MIA', 'WSH',
               'MIL', 'CHC', 'STL', 'CIN', 'PIT', 'LAD', 'SD', 'SF', 'ARI', 'COL'];
  
  const firstNames = ['Nolan', 'Matt', 'Mookie', 'Andrelton', 'J.T.', 'Kevin', 'Javier', 'Carlos', 'Joey', 'Yadier',
                     'Brandon', 'Ozzie', 'Trevor', 'Francisco', 'Anthony', 'Manny', 'José', 'Cody', 'Harrison', 'Ke\'Bryan'];
  
  const lastNames = ['Arenado', 'Chapman', 'Betts', 'Simmons', 'Realmuto', 'Kiermaier', 'Báez', 'Correa', 'Gallo', 'Molina',
                    'Crawford', 'Albies', 'Story', 'Lindor', 'Rizzo', 'Machado', 'Ramírez', 'Bellinger', 'Bader', 'Hayes'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = 300000 + i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const team = teams[Math.floor(Math.random() * teams.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const teamId = 108 + Math.floor(Math.random() * 30);
    
    // Generate realistic fielding stats
    const G = Math.floor(Math.random() * 100) + 50; // 50-150 games
    const INN = G * (Math.floor(Math.random() * 3) + 6); // 6-9 innings per game
    
    let chanceMultiplier;
    switch (position) {
      case '1B': chanceMultiplier = 8; break;
      case '2B': case 'SS': chanceMultiplier = 4.5; break;
      case '3B': chanceMultiplier = 3; break;
      case 'C': chanceMultiplier = 5; break;
      default: chanceMultiplier = 2; // Outfielders
    }
    
    const PO = Math.floor(INN / 9 * chanceMultiplier); // Putouts based on position and innings
    const A = position === 'C' || position === '1B' || position.includes('F') 
      ? Math.floor(PO * 0.3) // Fewer assists for C, 1B, OF
      : Math.floor(PO * 0.8); // More assists for infielders
    
    const E = Math.floor((PO + A) * (Math.random() * 0.03)); // 0-3% error rate
    const DP = ['2B', 'SS', '1B', '3B'].includes(position) 
      ? Math.floor(G * (Math.random() * 0.5 + 0.2)) // More DPs for infielders
      : Math.floor(G * Math.random() * 0.1); // Fewer for others
    
    const FP = (PO + A) / (PO + A + E);
    const RF = (PO + A) / G;
    
    // Advanced metrics
    const dWAR = Math.random() * 3; // 0-3 defensive WAR
    const DRS = Math.floor(Math.random() * 30 - 5); // -5 to 25 Defensive Runs Saved
    const UZR = Math.random() * 20 - 5; // -5 to 15 Ultimate Zone Rating
    const OAA = Math.floor(Math.random() * 20 - 5); // -5 to 15 Outs Above Average
    
    return {
      id,
      name,
      team,
      teamId,
      position,
      G,
      INN,
      PO,
      A,
      E,
      DP,
      FP,
      RF,
      dWAR,
      DRS,
      UZR,
      OAA
    };
  });
};

// Generate mock statcast data
export const generateMockStatcastData = (count = 120) => {
  const teams = ['NYY', 'BOS', 'TOR', 'TB', 'BAL', 'CLE', 'CWS', 'MIN', 'KC', 'DET', 
               'HOU', 'LAA', 'SEA', 'OAK', 'TEX', 'ATL', 'PHI', 'NYM', 'MIA', 'WSH',
               'MIL', 'CHC', 'STL', 'CIN', 'PIT', 'LAD', 'SD', 'SF', 'ARI', 'COL'];
  
  const names = [
    'Aaron Judge', 'Mike Trout', 'Shohei Ohtani', 'Vladimir Guerrero Jr.', 'Fernando Tatis Jr.',
    'Juan Soto', 'Giancarlo Stanton', 'Joey Gallo', 'Yordan Alvarez', 'Bryce Harper',
    'Ronald Acuña Jr.', 'Byron Buxton', 'Teoscar Hernández', 'Nelson Cruz', 'Kyle Schwarber',
    'Matt Olson', 'Pete Alonso', 'Salvador Perez', 'Franmil Reyes', 'Miguel Sanó'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const id = 400000 + i;
    const name = names[Math.floor(Math.random() * names.length)];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const teamId = 108 + Math.floor(Math.random() * 30);
    
    // Generate realistic statcast data
    const exit_velocity = Math.random() * 15 + 85; // 85-100 mph exit velocity
    const launch_angle = Math.random() * 60 - 10; // -10 to 50 degrees
    const sprint_speed = Math.random() * 6 + 24; // 24-30 ft/sec sprint speed
    
    const barrel_pct = Math.random() * 0.15 + 0.03; // 3-18% barrel rate
    const hard_hit_pct = Math.random() * 0.3 + 0.25; // 25-55% hard hit rate
    const sweet_spot_pct = Math.random() * 0.2 + 0.25; // 25-45% sweet spot percentage
    
    // Expected stats
    const xBA = Math.random() * 0.15 + 0.22; // .220-.370 expected BA
    const xSLG = Math.random() * 0.25 + 0.35; // .350-.600 expected SLG
    const xwOBA = Math.random() * 0.15 + 0.3; // .300-.450 expected wOBA
    
    // Plate discipline
    const z_swing_pct = Math.random() * 0.2 + 0.6; // 60-80% zone swing percentage
    const o_swing_pct = Math.random() * 0.25 + 0.2; // 20-45% outside zone swing percentage
    const whiff_pct = Math.random() * 0.25 + 0.15; // 15-40% whiff percentage
    const meatball_pct = Math.random() * 0.05 + 0.05; // 5-10% meatball percentage
    
    return {
      id,
      name,
      team,
      teamId,
      exit_velocity,
      launch_angle,
      sprint_speed,
      barrel_pct,
      hard_hit_pct,
      sweet_spot_pct,
      xBA,
      xSLG,
      xwOBA,
      z_swing_pct,
      o_swing_pct,
      whiff_pct,
      meatball_pct
    };
  });
};