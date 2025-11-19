'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ArtworkGrid from '@/components/ArtworkGrid';
import ArtworkFilters from '@/components/ArtworkFilters';
import { Artwork, ArtworkFilters as Filters } from '@/lib/types';
import { mockArtworks } from '@/lib/mockData';

/**
 * Works Page - Main archive/gallery page
 *
 * Features:
 * - Responsive artwork grid (4/3/1 columns)
 * - Grid/List view toggle
 * - Year and medium filtering
 * - Real-time title search
 * - Client-side filtering for instant results
 *
 * Performance:
 * - Client component for interactivity
 * - Mock data during development
 * - Efficient filtering with Array methods
 */
export default function WorksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>(mockArtworks);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(mockArtworks);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({});

  // Extract unique years and mediums for filter dropdowns
  const years = Array.from(new Set(artworks.map(a => a.year))).sort((a, b) => b - a);
  const mediums = Array.from(
    new Set(
      artworks
        .map(a => a.medium.en)
        .filter((m): m is string => typeof m === 'string')
    )
  ).sort();

  // Apply filters whenever filters change
  useEffect(() => {
    let result = [...artworks];

    // Year filter
    if (filters.year) {
      result = result.filter(artwork => artwork.year === filters.year);
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
    <Layout>
      {/* Page Header */}
      <section className="bg-white border-b border-light-gray">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-black mb-4">
            Works
          </h1>
          <p className="font-body text-base md:text-lg text-dark-gray max-w-2xl">
            An archive of selected artworks spanning various mediums and years.
          </p>
        </div>
      </section>

      {/* Filters */}
      <ArtworkFilters
        years={years}
        mediums={mediums}
        onFilterChange={setFilters}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        totalCount={filteredArtworks.length}
      />

      {/* Artwork Grid */}
      <section className="bg-near-white min-h-screen">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
          <ArtworkGrid
            artworks={filteredArtworks}
            locale="en"
            viewMode={viewMode}
          />
        </div>
      </section>
    </Layout>
  );
}
