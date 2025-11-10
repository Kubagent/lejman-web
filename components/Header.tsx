'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-light-gray">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Artist Name / Logo */}
          <Link
            href="/"
            className="font-heading text-2xl md:text-3xl font-semibold text-black hover:text-dark-gray transition-colors"
            aria-label="Home"
          >
            Dominik L.
          </Link>

          {/* Menu Button & Language */}
          <div className="flex items-center gap-6">
            {/* Language Switcher - Placeholder */}
            <span className="text-sm text-mid-gray font-body hidden md:inline">
              EN
            </span>

            {/* Menu Button */}
            <button
              onClick={onMenuClick}
              className="font-body text-sm md:text-base text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Open navigation menu"
              aria-expanded="false"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">☰</span>
                <span className="hidden sm:inline">Menu</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
