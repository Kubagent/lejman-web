'use client';

import { useState, useEffect } from 'react';
import { mockPublications } from '@/lib/mockData';
import PublicationCard from '@/components/PublicationCard';
import { Publication, PublicationFilters } from '@/lib/types';

export default function TextsPage() {
  const [publications, setPublications] = useState<Publication[]>(mockPublications);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>(mockPublications);
  const [filters, setFilters] = useState<PublicationFilters>({
    year: undefined,
    type: 'all',
    category: 'all',
    search: ''
  });
  const locale = 'en'; // TODO: Get from context/router

  // Filter publications whenever filters change
  useEffect(() => {
    let filtered = [...publications];

    // Search filter (title, description, author)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (pub) =>
          pub.title.en?.toLowerCase().includes(searchLower) ||
          pub.title.de?.toLowerCase().includes(searchLower) ||
          pub.title.pl?.toLowerCase().includes(searchLower) ||
          pub.description?.en?.toLowerCase().includes(searchLower) ||
          pub.description?.de?.toLowerCase().includes(searchLower) ||
          pub.description?.pl?.toLowerCase().includes(searchLower) ||
          pub.author?.en?.toLowerCase().includes(searchLower) ||
          pub.publisher?.toLowerCase().includes(searchLower)
      );
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter((pub) => pub.year === filters.year);
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter((pub) => pub.type === filters.type);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((pub) => pub.category === filters.category);
    }

    // Sort by year (most recent first), then by featured status
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    });

    setFilteredPublications(filtered);
  }, [filters, publications]);

  // Get unique years from publications
  const years = Array.from(new Set(publications.map((pub) => pub.year))).sort((a, b) => b - a);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      year: undefined,
      type: 'all',
      category: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.search || filters.year || (filters.type && filters.type !== 'all') || (filters.category && filters.category !== 'all');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-12 md:px-12 md:py-16 lg:px-24 lg:py-20">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-4 ml-8">
          Texts & Publications
        </h1>
        <p className="font-sans text-base md:text-lg text-[#666666] max-w-2xl ml-8">
          Essays, catalogs, interviews, and scholarly publications documenting the artistic practice and critical discourse.
        </p>
      </div>

      {/* Filter Bar - Compact & Borderless */}
      <div className="sticky top-0 z-10 bg-white px-6 py-6 md:px-12 lg:px-24">
        <div className="flex flex-wrap items-center gap-3 max-w-5xl ml-8">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 bg-[#FAFAFA] font-sans text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors w-64"
            aria-label="Search publications"
          />

          {/* Year Filter */}
          <select
            value={filters.year || ''}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })
            }
            className="px-4 py-2 bg-[#FAFAFA] font-sans text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
            aria-label="Filter by year"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.type || 'all'}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
            className="px-4 py-2 bg-[#FAFAFA] font-sans text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
            aria-label="Filter by file type"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
            <option value="epub">EPUB</option>
            <option value="other">Other</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category || 'all'}
            onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
            className="px-4 py-2 bg-[#FAFAFA] font-sans text-sm focus:outline-none focus:bg-[#F0F0F0] transition-colors"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="monograph">Monographs</option>
            <option value="catalog">Catalogs</option>
            <option value="essay">Essays</option>
            <option value="interview">Interviews</option>
            <option value="press">Press</option>
            <option value="other">Other</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 font-sans text-sm text-[#666666] hover:text-black transition-colors"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}

          {/* Results Count */}
          <span className="ml-auto font-sans text-sm text-[#999999]">
            {filteredPublications.length} {filteredPublications.length === 1 ? 'publication' : 'publications'}
          </span>
        </div>
      </div>

      {/* Publications List */}
      <div className="">
        {filteredPublications.length > 0 ? (
          <div className="">
            {filteredPublications.map((publication, index) => (
              <PublicationCard
                key={publication._id}
                publication={publication}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-sans text-base text-[#999999] mb-4">No publications found</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-black text-white font-sans text-sm font-medium hover:bg-[#333333] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
