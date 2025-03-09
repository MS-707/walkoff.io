'use client';

import React from 'react';

const MetricsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'batting', label: 'Batting' },
    { id: 'pitching', label: 'Pitching' },
    { id: 'fielding', label: 'Fielding' },
    { id: 'statcast', label: 'Statcast' },
    { id: 'comparison', label: 'Player Comparison' }
  ];
  
  return (
    <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
      <div className="flex flex-wrap -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`mr-2 inline-block py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetricsTabs;