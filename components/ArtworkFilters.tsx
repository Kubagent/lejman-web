'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArtworkFilters as Filters } from '@/lib/types';
import CustomDropdown from './CustomDropdown';

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
    <div className="w-full bg-white sticky top-0 z-10 border-b border-[#E5E5E5]">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
        {/* Two-Row Layout: Filters on top, Actions below */}
        <div className="space-y-8">
          {/* Top Row: View Toggle, Search and Filters - Desktop: single row, Mobile: 3 rows */}
          <div className="flex items-stretch gap-6 w-full flex-wrap">
            {/* Grid View Button */}
            <button
              onClick={() => onViewModeChange('grid')}
              className={`border-0 outline-none transition-all duration-300 ease-in-out ${
                viewMode === 'grid'
                  ? 'bg-[#000000] text-[#FFFFFF]'
                  : 'bg-[#FAFAFA] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF]'
              }`}
              style={{
                border: 'none',
                padding: '16px 24px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                width: '180px',
                minWidth: '180px',
                textAlign: 'center'
              }}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              Grid View
            </button>

            {/* List View Button */}
            <button
              onClick={() => onViewModeChange('list')}
              className={`border-0 outline-none transition-all duration-300 ease-in-out ${
                viewMode === 'list'
                  ? 'bg-[#000000] text-[#FFFFFF]'
                  : 'bg-[#FAFAFA] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF]'
              }`}
              style={{
                border: 'none',
                padding: '16px 24px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                width: '180px',
                minWidth: '180px',
                textAlign: 'center'
              }}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              List View
            </button>

            {/* Search Input */}
            <input
              id="artwork-search"
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`outline-none transition-all duration-300 ease-in-out text-center ${
                searchTerm.length > 0
                  ? 'bg-[#000000] text-[#FFFFFF] placeholder:text-[#999999]'
                  : 'bg-[#FAFAFA] text-[#000000] placeholder:text-[#999999] hover:bg-[#000000] hover:text-[#FFFFFF]'
              }`}
              style={{
                border: 'none',
                padding: '16px 24px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                flex: '1',
                minWidth: '200px'
              }}
              aria-label="Search artworks by title"
            />

            {/* Year Filter */}
            <div style={{ flex: '1', minWidth: '160px' }}>
              <CustomDropdown
                label="Year"
                options={[
                  { value: '', label: 'Year' },
                  ...years.map(year => ({ value: String(year), label: String(year) }))
                ]}
                value={selectedYear ? String(selectedYear) : ''}
                onChange={(value) => setSelectedYear(value ? Number(value) : undefined)}
                placeholder="Year"
                activeBackgroundShift={true}
              />
            </div>

            {/* Medium Filter */}
            <div style={{ flex: '1', minWidth: '160px' }}>
              <CustomDropdown
                label="Medium"
                options={[
                  { value: '', label: 'Medium' },
                  ...mediums.map(medium => ({ value: medium, label: medium }))
                ]}
                value={selectedMedium ?? ''}
                onChange={(value) => setSelectedMedium(value || undefined)}
                placeholder="Medium"
                activeBackgroundShift={true}
              />
            </div>
          </div>

          {/* Bottom Row: Clear and Results - Right side */}
          <div className="flex flex-wrap items-center justify-end gap-6 w-full">
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="bg-[#000000] text-[#FFFFFF] hover:bg-[#FAFAFA] hover:text-[#000000] border-0 outline-none transition-all duration-300 ease-in-out"
                style={{
                  border: 'none',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  textAlign: 'center'
                }}
                aria-label="Clear all filters"
              >
                Clear Filters
              </button>
            )}

            {/* Results Count */}
            <span className="whitespace-nowrap" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12.5px',
              color: '#999999'
            }}>
              {totalCount} {totalCount === 1 ? 'artwork' : 'artworks'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
