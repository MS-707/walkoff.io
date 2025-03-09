'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * PlayerThumbnail component displays MLB player headshots
 * 
 * @param {Object} props
 * @param {number|string} props.playerId - The MLB player ID (MLBAM ID)
 * @param {string} [props.playerName] - Player name for alt text and fallback
 * @param {number} [props.size=50] - Size in pixels for the thumbnail width
 * @param {string} [props.className] - Additional CSS classes
 */
const PlayerThumbnail = ({ 
  playerId, 
  playerName = 'MLB Player', 
  size = 50, 
  className = ''
}) => {
  // Define multiple image URLs to try in sequence
  const imageUrls = [
    `https://img.mlbstatic.com/mlb-photos/image/upload/w_180,h_270,q_auto/v1/people/${playerId}/headshot/67/current`,
    `https://www.mlbstatic.com/players/${playerId}.jpg`,
    `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_180,h_270,q_auto/v1/people/${playerId}/headshot/67/current`
  ];

  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrls[0]);
  const [imageUrlIndex, setImageUrlIndex] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Calculate height based on 3:4 aspect ratio typical for player headshots
  const height = Math.round(size * 1.33);

  // Handle error by trying the next image URL in sequence
  const handleImageError = () => {
    const nextIndex = imageUrlIndex + 1;
    
    if (nextIndex < imageUrls.length) {
      setCurrentImageUrl(imageUrls[nextIndex]);
      setImageUrlIndex(nextIndex);
    } else {
      // All URLs failed
      setError(true);
      setLoading(false);
    }
  };

  // Handle successful image load
  const handleImageLoaded = () => {
    setLoading(false);
  };

  // Render different states based on loading and error
  if (error) {
    // Fallback display when no image is available
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded overflow-hidden ${className}`}
        style={{ width: size, height: height }}
      >
        <span className="text-xs font-medium text-center text-gray-600 dark:text-gray-300 px-1">
          {playerName?.split(' ').pop() || 'MLB'}
        </span>
      </div>
    );
  }

  // Display image with loading state overlay
  return (
    <div 
      className={`relative rounded overflow-hidden ${className}`}
      style={{ width: size, height: height }}
    >
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 z-10" />
      )}
      
      <Image
        src={currentImageUrl}
        alt={`${playerName} headshot`}
        width={size}
        height={height}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoaded}
        className="object-cover"
      />
    </div>
  );
};

export default PlayerThumbnail;