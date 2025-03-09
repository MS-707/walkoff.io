#!/bin/bash

# Stop any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "next dev" || true

# Clean up the parent node_modules to avoid conflicts
echo "Cleaning up parent node_modules..."
rm -rf /Users/markstarrpro/walkoff.io/node_modules
rm -rf /Users/markstarrpro/walkoff.io/.next

# Change directory to the main project
cd /Users/markstarrpro/walkoff.io/walkoff.io

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Start the app
echo "Starting the app..."
# Start Tailwind in the background
npm run tailwind &
TAILWIND_PID=$!

# Start Next.js
npm run dev

# Kill the Tailwind process when Next.js exits
kill $TAILWIND_PID