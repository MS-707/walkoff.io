'use client';

import React, { useMemo } from 'react';
import StatsTable from './StatsTable';
import Chart from 'chart.js/auto';
import { Line, Scatter } from 'react-chartjs-2';
import { getTableConfig } from '@/lib/advanced-stats/tableConfigs';

const ComparisonDashboard = ({ data, filters, onFilterChange, type }) => {
  const teams = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Extract unique teams from data
    const uniqueTeams = [...new Set(data.map(item => item.team).filter(Boolean))];
    return ['all', ...uniqueTeams.sort()];
  }, [data]);
  
  const positions = useMemo(() => {
    if (!data || data.length === 0 || type !== 'batting') return ['all'];
    
    // Extract unique positions from data
    const uniquePositions = [...new Set(data.map(item => item.position).filter(Boolean))];
    return ['all', ...uniquePositions.sort()];
  }, [data, type]);
  
  // Get metrics for the current tab
  const metricsConfig = getTableConfig(type);
  
  const metricsOptions = useMemo(() => {
    return metricsConfig.columns.map(column => ({
      value: column.key,
      label: column.label
    }));
  }, [metricsConfig]);
  
  // Visualization data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    if (type === 'batting') {
      // Create batting visualization (e.g., HR vs AVG)
      return {
        labels: data.slice(0, 20).map(player => player.name || 'Unknown'),
        datasets: [
          {
            label: 'Home Runs',
            data: data.slice(0, 20).map(player => player.HR || 0),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            yAxisID: 'y',
          },
          {
            label: 'Batting Average',
            data: data.slice(0, 20).map(player => player.AVG || 0),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.5)',
            yAxisID: 'y1',
          }
        ]
      };
    } else if (type === 'pitching') {
      // Create pitching visualization (e.g., ERA vs SO)
      return {
        labels: data.slice(0, 20).map(player => player.name || 'Unknown'),
        datasets: [
          {
            label: 'ERA',
            data: data.slice(0, 20).map(player => player.ERA || 0),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            yAxisID: 'y',
          },
          {
            label: 'Strikeouts',
            data: data.slice(0, 20).map(player => player.SO || 0),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            yAxisID: 'y1',
          }
        ]
      };
    } else if (type === 'statcast') {
      // Create statcast scatter plot (e.g., Exit Velocity vs Launch Angle)
      return {
        datasets: [
          {
            label: 'Exit Velocity vs Launch Angle',
            data: data.slice(0, 100).map(item => ({
              x: item.launch_angle || 0,
              y: item.exit_velocity || 0,
            })),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 8,
          }
        ]
      };
    }
    
    return null;
  }, [data, type]);
  
  const chartOptions = useMemo(() => {
    if (type === 'batting' || type === 'pitching') {
      return {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: type === 'batting' ? 'Home Runs' : 'ERA'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: type === 'batting' ? 'Batting Average' : 'Strikeouts'
            }
          },
        }
      };
    } else if (type === 'statcast') {
      return {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const item = data[context.dataIndex];
                return `${item.name || 'Unknown'}: ${context.parsed.y} mph, ${context.parsed.x}°`;
              }
            }
          },
          legend: {
            display: true
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Launch Angle (degrees)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Exit Velocity (mph)'
            }
          }
        }
      };
    }
    
    return {};
  }, [type, data]);
  
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Filters panel */}
        <div className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              value={filters.team}
              onChange={(e) => onFilterChange('team', e.target.value)}
            >
              {teams.map(team => (
                <option key={team} value={team}>
                  {team === 'all' ? 'All Teams' : team}
                </option>
              ))}
            </select>
          </div>
          
          {type === 'batting' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <select
                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                value={filters.position}
                onChange={(e) => onFilterChange('position', e.target.value)}
              >
                {positions.map(position => (
                  <option key={position} value={position}>
                    {position === 'all' ? 'All Positions' : position}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              {metricsOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort Direction
            </label>
            <div className="flex">
              <button
                className={`flex-1 py-2 ${filters.sortDirection === 'desc' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'} rounded-l`}
                onClick={() => onFilterChange('sortDirection', 'desc')}
              >
                Highest
              </button>
              <button
                className={`flex-1 py-2 ${filters.sortDirection === 'asc' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'} rounded-r`}
                onClick={() => onFilterChange('sortDirection', 'asc')}
              >
                Lowest
              </button>
            </div>
          </div>
        </div>
        
        {/* Visualization panel */}
        <div className="lg:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Visualization</h3>
          
          {chartData ? (
            <div className="h-80">
              {type === 'statcast' ? (
                <Scatter data={chartData} options={chartOptions} />
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500">No visualization data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Data table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <StatsTable 
          data={data} 
          config={metricsConfig}
          type={type}
        />
      </div>
    </div>
  );
};

export default ComparisonDashboard;