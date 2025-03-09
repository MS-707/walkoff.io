import React from 'react';

/**
 * LoadingSpinner component
 * @param {Object} props
 * @param {string} [props.size='md'] - Size of the spinner (sm, md, lg)
 * @param {string} [props.color='blue'] - Color of the spinner
 * @param {string} [props.className] - Additional classes
 */
const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  // Size mappings
  const sizeClasses = {
    'sm': 'h-4 w-4 border-2',
    'md': 'h-8 w-8 border-3',
    'lg': 'h-12 w-12 border-4'
  };
  
  // Color mappings
  const colorClasses = {
    'blue': 'border-blue-500',
    'red': 'border-red-500',
    'green': 'border-green-500',
    'gray': 'border-gray-500',
    'white': 'border-white'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className={`inline-block ${className}`}>
      <div 
        className={`${sizeClass} rounded-full border-t-transparent border-solid animate-spin ${colorClass}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;