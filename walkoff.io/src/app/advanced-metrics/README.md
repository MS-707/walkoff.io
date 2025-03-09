# Advanced MLB Metrics

This directory contains the advanced MLB statistics page for WalkOff.io. This page provides detailed analytics for batting, pitching, fielding, and statcast data with interactive visualizations and filters.

## Features

- **Multi-tab Interface**: Separate tabs for batting, pitching, fielding, statcast, and player comparison
- **Interactive Filters**: Filter by team, position, sort metrics, and search by player name
- **Data Visualizations**: Charts for key metrics (home runs vs. batting average, ERA vs. strikeouts, etc.)
- **Sortable Tables**: Comprehensive statistics tables with pagination
- **Responsive Design**: Works on desktop and mobile devices

## Technical Implementation

### Frontend Components

- `page.js`: Server component for the advanced metrics page
- `AdvancedMetricsContent.js`: Client component that manages state and data fetching
- `MetricsHeader.js`: Search and filters UI at the top of the page
- `MetricsTabs.js`: Tab navigation between different stat types
- `ComparisonDashboard.js`: Main component for data visualization and filtering
- `StatsTable.js`: Paginated table for displaying statistics

### Data Fetching

The page uses SWR for efficient data fetching with caching:

```javascript
const { data, error, isLoading } = useSWR(
  `/api/advanced-stats/${activeTab}?season=${season}`,
  fetcher,
  {
    revalidateOnFocus: false,
    dedupingInterval: 43200000, // 12 hours
    revalidateOnMount: true
  }
);
```

### API Integration

The data is served from the `/api/advanced-stats/[type]` endpoint, which will integrate with pybaseball in a production environment. Currently, it uses mock data for development.

### Python Integration

For production, a Python microservice will be deployed to handle `pybaseball` integration. See `/src/app/api/PYTHON_INTEGRATION.md` for detailed implementation instructions.

## Visualizations

Charts are implemented using Chart.js:

- **Batting**: Line chart of Home Runs vs. Batting Average
- **Pitching**: Line chart of ERA vs. Strikeouts
- **Statcast**: Scatter plot of Exit Velocity vs. Launch Angle

## Data Filtering and Sorting

The ComparisonDashboard component handles filtering and sorting:

```javascript
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
```

## Usage

Navigate to `/advanced-metrics` in the application to access this page. You can:

1. Select different stat types using the tabs
2. Search for specific players or teams
3. Filter by team, position, or other metrics
4. Sort by different statistical categories
5. View visualizations for the selected data

## Future Enhancements

- Add more advanced metrics (xwOBA, Barrel%, etc.)
- Create player comparison pages for head-to-head analysis
- Add historical data trends and visualizations
- Implement custom metrics and projections
- Add predictive analytics for player performance