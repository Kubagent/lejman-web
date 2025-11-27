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
    <div className="w-full bg-white sticky top-0 z-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6">
        {/* Single Row: All Filters Compact */}
        <div className="flex flex-wrap items-center gap-3 max-w-5xl ml-8">
          {/* Search Input */}
          <input
            id="artwork-search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#FAFAFA] font-body text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors w-64"
            aria-label="Search artworks by title"
          />

          {/* Year Filter */}
          <select
            id="year-filter"
            value={selectedYear ?? ''}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2 bg-[#FAFAFA] font-body text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
            aria-label="Filter by year"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Medium Filter */}
          <select
            id="medium-filter"
            value={selectedMedium ?? ''}
            onChange={(e) => setSelectedMedium(e.target.value || undefined)}
            className="px-4 py-2 bg-[#FAFAFA] font-body text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
            aria-label="Filter by medium"
          >
            <option value="">All Mediums</option>
            {mediums.map((medium) => (
              <option key={medium} value={medium}>
                {medium}
              </option>
            ))}
          </select>

          {/* View Mode Toggle - Compact */}
          <div role="group" aria-label="View mode" className="flex gap-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 font-body text-sm transition-colors ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'bg-[#FAFAFA] text-dark-gray hover:bg-[#F0F0F0]'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              Grid
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 font-body text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'bg-[#FAFAFA] text-dark-gray hover:bg-[#F0F0F0]'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              List
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 font-body text-sm text-[#666666] hover:text-black transition-colors"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}

          {/* Results Count */}
          <span className="ml-auto font-body text-sm text-mid-gray">
            {totalCount} {totalCount === 1 ? 'artwork' : 'artworks'}
          </span>
        </div>
      </div>
    </div>
  );
}
