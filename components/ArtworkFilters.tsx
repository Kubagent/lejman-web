'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArtworkFilters as Filters } from '@/lib/types';

interface ArtworkFiltersProps {
  years: number[];
  mediums: string[];
  onFilterChange: (filters: Filters) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  totalCount: number;
}

/**
 * ArtworkFilters - Filter controls for artwork archive
 *
 * Features:
 * - Year dropdown filter
 * - Medium dropdown filter
 * - Real-time title search (300ms debounce, 2 char minimum)
 * - Grid/List view toggle
 * - Clear all filters button
 * - Responsive layout
 * - Keyboard accessible
 */
export default function ArtworkFilters({
  years,
  mediums,
  onFilterChange,
  onViewModeChange,
  viewMode,
  totalCount
}: ArtworkFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedMedium, setSelectedMedium] = useState<string | undefined>(undefined);

  // Debounced filter change (300ms)
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const triggerFilterChange = useCallback(() => {
    const filters: Filters = {
      search: searchTerm.length >= 2 ? searchTerm : undefined,
      year: selectedYear,
      medium: selectedMedium,
    };
    onFilterChange(filters);
  }, [searchTerm, selectedYear, selectedMedium, onFilterChange]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      triggerFilterChange();
    }, 300);

    setDebounceTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm, selectedYear, selectedMedium]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedYear(undefined);
    setSelectedMedium(undefined);
  };

  const hasActiveFilters = searchTerm.length >= 2 || selectedYear !== undefined || selectedMedium !== undefined;

  return (
    <div className="w-full bg-white border-b border-light-gray sticky top-0 z-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6">
        {/* Top Row: Search + View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="artwork-search" className="sr-only">
              Search artworks by title
            </label>
            <input
              id="artwork-search"
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 font-body text-base border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
              aria-label="Search artworks by title"
            />
            {searchTerm.length > 0 && searchTerm.length < 2 && (
              <p className="mt-1 text-xs text-mid-gray">Type at least 2 characters to search</p>
            )}
          </div>

          {/* View Mode Toggle */}
          <div
            role="group"
            aria-label="View mode"
            className="flex gap-2 border border-light-gray rounded overflow-hidden"
          >
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-4 py-2 font-body text-sm transition-colors ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'bg-white text-dark-gray hover:bg-near-white'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="0" width="7" height="7" />
                  <rect x="9" y="0" width="7" height="7" />
                  <rect x="0" y="9" width="7" height="7" />
                  <rect x="9" y="9" width="7" height="7" />
                </svg>
                Grid
              </span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-4 py-2 font-body text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'bg-white text-dark-gray hover:bg-near-white'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="0" width="16" height="3" />
                  <rect x="0" y="6" width="16" height="3" />
                  <rect x="0" y="12" width="16" height="3" />
                </svg>
                List
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Year + Medium Filters + Clear */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Year Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="year-filter" className="sr-only">
              Filter by year
            </label>
            <select
              id="year-filter"
              value={selectedYear ?? ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full sm:w-auto px-4 py-2 font-body text-sm border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
              aria-label="Filter artworks by year"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Medium Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="medium-filter" className="sr-only">
              Filter by medium
            </label>
            <select
              id="medium-filter"
              value={selectedMedium ?? ''}
              onChange={(e) => setSelectedMedium(e.target.value || undefined)}
              className="w-full sm:w-auto px-4 py-2 font-body text-sm border border-light-gray rounded focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
              aria-label="Filter artworks by medium"
            >
              <option value="">All Mediums</option>
              {mediums.map((medium) => (
                <option key={medium} value={medium}>
                  {medium}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex-1 font-body text-sm text-mid-gray">
            {totalCount} {totalCount === 1 ? 'artwork' : 'artworks'}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 font-body text-sm text-dark-gray hover:text-black border border-light-gray rounded hover:bg-near-white transition-colors"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
