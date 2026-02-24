'use client';

import { useState, useEffect } from 'react';
import ArtworkGrid from '@/components/ArtworkGrid';
import ArtworkFilters from '@/components/ArtworkFilters';
import { Artwork, ArtworkFilters as Filters } from '@/lib/types';

interface WorksClientProps {
  artworks: Artwork[];
  years: number[];
  mediums: string[];
}

/**
 * Works Client Component
 *
 * Handles all client-side interactivity for the works page:
 * - View mode toggle (grid/list)
 * - Real-time filtering (year, medium, search)
 * - Filter state management
 */
export default function WorksClient({ artworks, years, mediums }: WorksClientProps) {
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworks);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({});

  // Apply filters whenever filters change
  useEffect(() => {
    let result = [...artworks];

    // Year filter
    if (filters.year) {
      result = result.filter(artwork =>
        filters.year! >= artwork.year && filters.year! <= (artwork.yearEnd ?? artwork.year)
      );
    }

    // Medium filter
    if (filters.medium) {
      result = result.filter(artwork =>
        artwork.medium.en?.toLowerCase().includes(filters.medium!.toLowerCase()) ||
        artwork.medium.de?.toLowerCase().includes(filters.medium!.toLowerCase()) ||
        artwork.medium.pl?.toLowerCase().includes(filters.medium!.toLowerCase())
      );
    }

    // Search filter (title across all languages)
    if (filters.search && filters.search.length >= 2) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(artwork =>
        artwork.title.en?.toLowerCase().includes(searchLower) ||
        artwork.title.de?.toLowerCase().includes(searchLower) ||
        artwork.title.pl?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredArtworks(result);
  }, [filters, artworks]);

  return (
    <>
      {/* Page Header */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 pt-12 md:pt-16 pb-32">
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-black mb-4 text-center">
            Selected Works
          </h1>
        </div>
      </section>

      {/* Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Filters */}
      <ArtworkFilters
        years={years}
        mediums={mediums}
        onFilterChange={setFilters}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        totalCount={filteredArtworks.length}
      />

      {/* Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Artwork Grid */}
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
          <ArtworkGrid
            artworks={filteredArtworks}
            locale="en"
            viewMode={viewMode}
          />
        </div>
      </section>
    </>
  );
}
