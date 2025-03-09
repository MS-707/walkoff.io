'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-secondary shadow-lg py-2' 
          : 'bg-secondary-dark py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              <span className="text-primary">Walk</span>
              <span className="text-accent">Off</span>
              <span className="text-white">.io</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/scoreboard" className="text-white hover:text-primary transition-colors duration-200">
              Scoreboard
            </Link>
            <Link href="/discover" className="text-white hover:text-primary transition-colors duration-200">
              Discover
            </Link>
            <Link href="/lists" className="text-white hover:text-primary transition-colors duration-200">
              Lists
            </Link>
            <Link href="/community" className="text-white hover:text-primary transition-colors duration-200">
              Community
            </Link>
          </div>

          {/* Search & Login (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/10 border border-white/20 rounded-full py-2 px-4 text-sm text-white w-40 focus:w-60 focus:outline-none transition-all duration-300"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full transition-colors duration-200">
              Log In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`${
            isOpen ? 'max-h-96 opacity-100 pt-6' : 'max-h-0 opacity-0'
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col pb-6 space-y-4">
            <Link href="/scoreboard" className="text-white hover:text-primary transition-colors py-2">
              Scoreboard
            </Link>
            <Link href="/discover" className="text-white hover:text-primary transition-colors py-2">
              Discover
            </Link>
            <Link href="/lists" className="text-white hover:text-primary transition-colors py-2">
              Lists
            </Link>
            <Link href="/community" className="text-white hover:text-primary transition-colors py-2">
              Community
            </Link>
            <div className="pt-2">
              <input
                type="text"
                placeholder="Search players or teams..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-4 text-sm text-white focus:outline-none"
              />
            </div>
            <div className="pt-2">
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full transition-colors duration-200">
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}