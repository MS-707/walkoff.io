'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import MetricsHeader from './MetricsHeader';
import MetricsTabs from './MetricsTabs';
import ComparisonDashboard from './ComparisonDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Fetch function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

const AdvancedMetricsContent = () => {
  // State for active tab and filters
  const [activeTab, setActiveTab] = useState('batting');
  const [season, setSeason] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    team: 'all',
    position: 'all',
    sortBy: 'WAR',
    sortDirection: 'desc'
  });
  
  // Fetch data based on active tab
  const { data, error, isLoading } = useSWR(
    `/api/advanced-stats/${activeTab}?season=${season}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 43200000, // 12 hours
      revalidateOnMount: true
    }
  );
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle season change
  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
  };
  
  // Handle search query change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  
  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(query) || 
        item.team?.toLowerCase().includes(query)
      );
    }
    
    // Apply team filter
    if (filters.team !== 'all') {
      filtered = filtered.filter(item => item.team === filters.team);
    }
    
    // Apply position filter
    if (filters.position !== 'all') {
      filtered = filtered.filter(item => item.position === filters.position);
    }
    
    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy] || 0;
      const bValue = b[filters.sortBy] || 0;
      
      return filters.sortDirection === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
    
    return filtered;
  }, [data, searchQuery, filters]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MetricsHeader 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange}
        season={season}
        onSeasonChange={handleSeasonChange}
      />
      
      <MetricsTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-lg text-gray-500">Loading advanced metrics...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg my-6">
          <p className="text-center">Failed to load {activeTab} statistics.</p>
          <p className="text-center text-sm mt-2">
            We're currently integrating with MLB's advanced stats.
          </p>
        </div>
      ) : (
        <ComparisonDashboard 
          data={filteredData}
          filters={filters}
          onFilterChange={handleFilterChange}
          type={activeTab}
        />
      )}
    </div>
  );
};

export default AdvancedMetricsContent;