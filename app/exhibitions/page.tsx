'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ExhibitionCard from '@/components/ExhibitionCard';
import { Exhibition, ExhibitionFilters } from '@/lib/types';
import { mockExhibitions } from '@/lib/mockData';
import CustomDropdown from '@/components/CustomDropdown';

/**
 * Exhibitions Page - Comprehensive chronological exhibition history
 *
 * Features:
 * - Chronological listing (most recent first)
 * - Filter by year and type (Solo/Group/Institutional)
 * - Search by title or venue
 * - View mode toggle (Detailed/Compact)
 * - Responsive layout
 * - Total count indicator
 *
 * Design Principles:
 * - Digital White Cube aesthetic
 * - Hierarchy through scale and spacing
 * - Progressive disclosure
 * - 8px grid system
 *
 * Performance:
 * - Client component for interactivity
 * - Efficient filtering with Array methods
 * - Lazy loading images
 *
 * Accessibility:
 * - Semantic HTML structure
 * - WCAG 2.1 AA compliant
 * - Keyboard navigation
 * - Screen reader friendly
 */
export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(mockExhibitions);
  const [filteredExhibitions, setFilteredExhibitions] = useState<Exhibition[]>(mockExhibitions);
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [filters, setFilters] = useState<ExhibitionFilters>({});

  // Extract unique years for filter dropdown (sorted descending)
  const years = Array.from(new Set(exhibitions.map(e => e.year))).sort((a, b) => b - a);

  // Apply filters whenever filters change
  useEffect(() => {
    let result = [...exhibitions];

    // Sort by year (most recent first)
    result.sort((a, b) => b.year - a.year);

    // Year filter
    if (filters.year) {
      result = result.filter(exhibition => exhibition.year === filters.year);
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(exhibition => exhibition.type === filters.type);
    }

    // Search filter (title and venue across all languages)
    if (filters.search && filters.search.length >= 2) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(exhibition =>
        exhibition.title.en?.toLowerCase().includes(searchLower) ||
        exhibition.title.de?.toLowerCase().includes(searchLower) ||
        exhibition.title.pl?.toLowerCase().includes(searchLower) ||
        exhibition.venue.name.en?.toLowerCase().includes(searchLower) ||
        exhibition.venue.name.de?.toLowerCase().includes(searchLower) ||
        exhibition.venue.name.pl?.toLowerCase().includes(searchLower) ||
        exhibition.venue.city.toLowerCase().includes(searchLower) ||
        exhibition.venue.country.toLowerCase().includes(searchLower)
      );
    }

    setFilteredExhibitions(result);
  }, [filters, exhibitions]);

  const handleFilterChange = (key: keyof ExhibitionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.year || filters.type || (filters.search && filters.search.length >= 2);

  return (
    <>
      {/* Page Header */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 pt-12 md:pt-16 lg:pt-20 pb-32">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-4 text-center">
            Selected Projects
          </h1>
        </div>
      </section>

      {/* Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Filters Bar */}
      <section className="bg-white sticky top-0 z-10 border-b border-[#E5E5E5]">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
          {/* Two-Row Layout: Filters on top, Actions below */}
          <div className="space-y-8">
            {/* Top Row: View Toggle, Search and Filters - Desktop: single row, Mobile: 3 rows */}
            <div className="flex items-stretch gap-6 w-full flex-wrap">
              {/* Detailed View Button */}
              <button
                onClick={() => setViewMode('detailed')}
                className={`border-0 outline-none transition-all duration-300 ease-in-out ${
                  viewMode === 'detailed'
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
                aria-label="Detailed view"
                aria-pressed={viewMode === 'detailed'}
              >
                Detailed View
              </button>

              {/* Compact View Button */}
              <button
                onClick={() => setViewMode('compact')}
                className={`border-0 outline-none transition-all duration-300 ease-in-out ${
                  viewMode === 'compact'
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
                aria-label="Compact view"
                aria-pressed={viewMode === 'compact'}
              >
                Compact View
              </button>

              {/* Search Input */}
              <input
                id="search"
                type="text"
                placeholder="Search exhibitions..."
                value={filters.search ?? ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={`outline-none transition-all duration-300 ease-in-out text-center ${
                  filters.search && filters.search.length > 0
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
                aria-label="Search exhibitions by title or venue"
              />

              {/* Year Filter */}
              <div style={{ flex: '1', minWidth: '160px' }}>
                <CustomDropdown
                  label="Year"
                  options={[
                    { value: '', label: 'Year' },
                    ...years.map(year => ({ value: String(year), label: String(year) }))
                  ]}
                  value={filters.year ? String(filters.year) : ''}
                  onChange={(value) => handleFilterChange('year', value ? parseInt(value) : undefined)}
                  placeholder="Year"
                  activeBackgroundShift={true}
                />
              </div>

              {/* Type Filter */}
              <div style={{ flex: '1', minWidth: '160px' }}>
                <CustomDropdown
                  label="Type"
                  options={[
                    { value: '', label: 'Type' },
                    { value: 'solo', label: 'Solo' },
                    { value: 'group', label: 'Group' },
                    { value: 'institutional', label: 'Institutional' }
                  ]}
                  value={filters.type ?? ''}
                  onChange={(value) => handleFilterChange('type', value || undefined)}
                  placeholder="Type"
                  activeBackgroundShift={true}
                />
              </div>
            </div>

            {/* Bottom Row: Clear and Results - Right side */}
            <div className="flex flex-wrap items-center justify-end gap-6 w-full">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
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
                {filteredExhibitions.length} {filteredExhibitions.length === 1 ? 'exhibition' : 'exhibitions'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Exhibitions List */}
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
          {filteredExhibitions.length > 0 ? (
            <div className={viewMode === 'detailed' ? 'space-y-0' : 'space-y-0'}>
              {filteredExhibitions.map((exhibition, index) => (
                <ExhibitionCard
                  key={exhibition._id}
                  exhibition={exhibition}
                  locale="en"
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-16 md:py-24">
              <p className="font-body text-lg text-mid-gray mb-4">
                No exhibitions found matching your criteria.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-24 py-10 font-body text-base font-normal bg-[#000000] text-[#FFFFFF] border-2 border-[#000000] hover:bg-[#FFFFFF] hover:text-[#000000] focus:outline-none transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
