'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * TeamLogo component displays MLB team logos
 * 
 * @param {Object} props
 * @param {number|string} props.teamId - The MLB team ID
 * @param {string} [props.fallbackText] - Text to display if logo can't be loaded
 * @param {number} [props.size=40] - Size in pixels for the logo (will be square)
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.team] - Optional pre-loaded team object with logoUrl
 */
const TeamLogo = ({ 
  teamId, 
  fallbackText = '', 
  size = 40, 
  className = '',
  team = null
}) => {
  const initialLogoUrl = team?.logoUrl || null;
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(initialLogoUrl);
  const [logoUrlIndex, setLogoUrlIndex] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!initialLogoUrl);
  
  // If team object is provided with logo, no need to fetch
  useEffect(() => {
    if (team?.logoUrl) {
      setLogoUrl(team.logoUrl);
      setCurrentLogoUrl(team.logoUrl);
      setLoading(false);
      return;
    }
    
    // Only fetch if we have a teamId and no logo yet
    if (teamId && !logoUrl && !error) {
      setLoading(true);
      
      fetch(`/api/mlb/teams?teamId=${teamId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch team data');
          }
          return response.json();
        })
        .then(data => {
          // Check if we have team data
          const teamData = data.teamsById[teamId];
          if (teamData?.logoUrl) {
            setLogoUrl(teamData.logoUrl);
            setCurrentLogoUrl(teamData.logoUrl);
          } else {
            setError(true);
          }
        })
        .catch(error => {
          console.error('Error fetching team logo:', error);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [teamId, logoUrl, error, team]);
  
  // If we have multiple logos from team data, try them in sequence
  const handleLogoError = () => {
    if (team && logoUrlIndex < 2) {
      // Try the next logo URL (logoUrl2 or logoUrl3)
      const nextIndex = logoUrlIndex + 1;
      const nextUrl = team[`logoUrl${nextIndex + 1}`];
      
      if (nextUrl) {
        setCurrentLogoUrl(nextUrl);
        setLogoUrlIndex(nextIndex);
        return;
      }
    }
    
    // All URLs failed or no more to try
    setError(true);
  };
  
  // Render different states based on loading and error
  if (error || (!logoUrl && !loading)) {
    // Fallback display when no logo
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
          {fallbackText || (teamId ? `#${teamId}` : 'MLB')}
        </span>
      </div>
    );
  } else if (loading) {
    // Loading state
    return (
      <div 
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      />
    );
  } else {
    // Display logo
    return (
      <div 
        className={`relative rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={currentLogoUrl || logoUrl}
          alt={fallbackText || `Team ${teamId} logo`}
          width={size}
          height={size}
          priority={true}
          onError={handleLogoError}
          className="object-contain"
        />
      </div>
    );
  }
};

export default TeamLogo;