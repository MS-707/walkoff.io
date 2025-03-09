'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TeamLogo from '@/components/teams/TeamLogo';

const StatsTable = ({ data, config, type }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  
  // Calculate total pages
  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage);
  
  // Get current page data
  const currentData = data?.slice((page - 1) * rowsPerPage, page * rowsPerPage) || [];
  
  // Field formatters for different stat types
  const formatValue = (value, format) => {
    if (value === undefined || value === null) return '-';
    
    switch (format) {
      case 'decimal':
        return Number(value).toFixed(3).replace(/^0+/, '');
      case 'decimal2':
        return Number(value).toFixed(2);
      case 'percent':
        return `${(Number(value) * 100).toFixed(1)}%`;
      case 'integer':
        return Math.round(Number(value)).toString();
      default:
        return value.toString();
    }
  };
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {config.columns.map((column) => (
                <th 
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((item, index) => (
              <tr 
                key={item.id || index}
                className={index % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-900/50'}
              >
                {config.columns.map((column) => (
                  <td 
                    key={`${item.id || index}-${column.key}`}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.highlight ? 'font-semibold' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {column.key === 'name' ? (
                      <Link 
                        href={`/players/${item.id || 'unknown'}`}
                        className="text-primary hover:underline font-medium flex items-center"
                      >
                        {item[column.key] || '-'}
                      </Link>
                    ) : column.key === 'team' ? (
                      <div className="flex items-center">
                        <TeamLogo teamId={item.teamId} size={20} className="mr-2" />
                        <span>{item[column.key] || '-'}</span>
                      </div>
                    ) : (
                      formatValue(item[column.key], column.format)
                    )}
                  </td>
                ))}
              </tr>
            ))}
            
            {currentData.length === 0 && (
              <tr>
                <td 
                  colSpan={config.columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                page === 1
                  ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-800'
                  : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                page === totalPages
                  ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-800'
                  : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * rowsPerPage, data?.length || 0)}
                </span>{' '}
                of <span className="font-medium">{data?.length || 0}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    page === 1
                      ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-800'
                      : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">First</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    page === 1
                      ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-800'
                      : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  // Calculate page numbers to show (centered around current page)
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        page === pageNum
                          ? 'z-10 bg-primary text-white border-primary'
                          : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    page === totalPages
                      ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-800'
                      : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                    page === totalPages
                      ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-800'
                      : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Last</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTable;