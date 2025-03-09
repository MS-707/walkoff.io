import React from 'react';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  }).format(date);
};

const DateButton = ({ date, isSelected, onClick }) => {
  const formattedDate = formatDate(date);
  const isToday = new Date().toDateString() === date.toDateString();
  
  return (
    <button
      onClick={() => onClick(date)}
      className={`
        px-4 py-2 rounded-lg transition-colors
        ${isSelected 
          ? 'bg-blue-600 text-white' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
        ${isToday ? 'font-bold border border-blue-500' : ''}
      `}
    >
      {formattedDate}
    </button>
  );
};

const DatePicker = ({ selectedDate, onDateChange }) => {
  const dates = [];
  
  // Generate a range of dates (3 days before, today, 3 days after)
  const today = new Date();
  for (let i = -3; i <= 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2">
        {dates.map((date) => (
          <DateButton
            key={date.toISOString()}
            date={date}
            isSelected={selectedDate?.toDateString() === date.toDateString()}
            onClick={onDateChange}
          />
        ))}
      </div>
    </div>
  );
};

export default DatePicker;