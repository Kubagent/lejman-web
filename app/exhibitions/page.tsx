'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ExhibitionCard from '@/components/ExhibitionCard';
import { Exhibition, ExhibitionFilters } from '@/lib/types';
import { mockExhibitions } from '@/lib/mockData';

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
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-4 ml-8">
            Exhibitions
          </h1>
          <p className="font-body text-base md:text-lg text-dark-gray max-w-2xl ml-8">
            A comprehensive chronological record of solo and group exhibitions spanning {years[years.length - 1]}-{years[0]}.
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6">
          <div className="flex flex-wrap items-center gap-3 max-w-5xl ml-8">
            {/* Search */}
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={filters.search ?? ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="px-4 py-2 bg-[#FAFAFA] font-body text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors w-64"
              aria-label="Search exhibitions by title or venue"
            />

            {/* Year Filter */}
            <select
              id="year-filter"
              value={filters.year ?? ''}
              onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-4 py-2 bg-[#FAFAFA] font-body text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
              aria-label="Filter exhibitions by year"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              id="type-filter"
              value={filters.type ?? 'all'}
              onChange={(e) => handleFilterChange('type', e.target.value === 'all' ? undefined : e.target.value)}
              className="px-4 py-2 bg-[#FAFAFA] font-body text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
              aria-label="Filter exhibitions by type"
            >
              <option value="all">All Types</option>
              <option value="solo">Solo</option>
              <option value="group">Group</option>
              <option value="institutional">Institutional</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-1" role="group" aria-label="View mode toggle">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-2 font-body text-sm transition-colors ${
                  viewMode === 'detailed'
                    ? 'bg-black text-white'
                    : 'bg-[#FAFAFA] text-dark-gray hover:bg-[#F0F0F0]'
                }`}
                aria-label="Detailed view"
                aria-pressed={viewMode === 'detailed'}
              >
                Detailed
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-2 font-body text-sm transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-black text-white'
                    : 'bg-[#FAFAFA] text-dark-gray hover:bg-[#F0F0F0]'
                }`}
                aria-label="Compact view"
                aria-pressed={viewMode === 'compact'}
              >
                Compact
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 font-body text-sm text-[#666666] hover:text-black transition-colors"
                aria-label="Clear all filters"
              >
                Clear
              </button>
            )}

            {/* Results Count */}
            <span className="ml-auto font-body text-sm text-mid-gray">
              {filteredExhibitions.length} {filteredExhibitions.length === 1 ? 'exhibition' : 'exhibitions'}
            </span>
          </div>
        </div>
      </section>

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
                  className="px-6 py-3 bg-black text-white font-body text-sm hover:bg-dark-gray transition-colors"
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
