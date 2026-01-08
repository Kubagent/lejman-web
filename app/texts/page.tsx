'use client';

import { useState, useEffect } from 'react';
import PublicationCard from '@/components/PublicationCard';
import { Publication, PublicationFilters } from '@/lib/types';
import CustomDropdown from '@/components/CustomDropdown';

export default function TextsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
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
      <div className="container mx-auto px-6 md:px-12 lg:px-24 pt-12 md:pt-16 lg:pt-20 pb-32">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-4 text-center">
          Texts & Publications
        </h1>
      </div>

      {/* Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Filter Bar - Spacious & Inviting */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E5E5]">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
          {/* Two-Row Layout: Filters on top, Actions below */}
          <div className="space-y-8">
            {/* Top Row: Search and 3 Filters - Desktop: equal width, Mobile: 2 rows */}
            <div className="flex items-stretch gap-6 w-full flex-wrap">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search publications..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
                aria-label="Search publications"
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
                  onChange={(value) => setFilters({ ...filters, year: value ? parseInt(value) : undefined })}
                  placeholder="Year"
                  activeBackgroundShift={true}
                />
              </div>

              {/* Format Filter */}
              <div style={{ flex: '1', minWidth: '160px' }}>
                <CustomDropdown
                  label="Format"
                  options={[
                    { value: '', label: 'Format' },
                    { value: 'pdf', label: 'PDF' },
                    { value: 'doc', label: 'DOC' },
                    { value: 'epub', label: 'EPUB' },
                    { value: 'other', label: 'Other' }
                  ]}
                  value={filters.type || ''}
                  onChange={(value) => setFilters({ ...filters, type: value as any })}
                  placeholder="Format"
                  activeBackgroundShift={true}
                />
              </div>

              {/* Category Filter */}
              <div style={{ flex: '1', minWidth: '160px' }}>
                <CustomDropdown
                  label="Category"
                  options={[
                    { value: '', label: 'Category' },
                    { value: 'monograph', label: 'Monographs' },
                    { value: 'catalog', label: 'Catalogs' },
                    { value: 'essay', label: 'Essays' },
                    { value: 'interview', label: 'Interviews' },
                    { value: 'press', label: 'Press' },
                    { value: 'other', label: 'Other' }
                  ]}
                  value={filters.category || ''}
                  onChange={(value) => setFilters({ ...filters, category: value as any })}
                  placeholder="Category"
                  activeBackgroundShift={true}
                />
              </div>
            </div>

            {/* Bottom Row: Clear and Results - Right side */}
            <div className="flex flex-wrap items-center justify-end gap-6 w-full">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
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
                {filteredPublications.length} {filteredPublications.length === 1 ? 'publication' : 'publications'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Publications List */}
      <div className="">
        {filteredPublications.length > 0 ? (
          <div className="max-w-[60vw] mx-auto">
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
            <p className="font-serif text-lg text-[#666666] leading-relaxed">
              {hasActiveFilters ? 'No publications found' : 'Publications will be available soon. Please check back later.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-3 font-sans text-sm font-normal bg-[#000000] text-[#FFFFFF] hover:bg-[#FAFAFA] hover:text-[#000000] focus:outline-none transition-all duration-300"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
