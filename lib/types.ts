// Sanity Asset Types
export interface SanityAsset {
  _type: 'file' | 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface SanityFileAsset extends SanityAsset {
  _type: 'file';
}

export interface SanityImageAsset extends SanityAsset {
  _type: 'image';
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

// Localized Text Type
export interface LocalizedText {
  en?: string;
  de?: string;
  pl?: string;
}

// River Video Types
export interface RiverVideo {
  _id: string;
  title: LocalizedText;
  order: number;
  videoFile: SanityFileAsset;
  posterImage: SanityImageAsset;
  description?: LocalizedText;
  year?: number;
  linkedArtwork?: {
    slug: {
      current: string;
    };
  };
}

// Props for River Components
export interface RiverVideoSlotProps {
  video: RiverVideo;
  locale?: 'en' | 'de' | 'pl';
  isInView?: boolean;
}

export interface RiverProps {
  videos: RiverVideo[];
  locale?: 'en' | 'de' | 'pl';
}

// Helper type for video URL resolution
export interface ResolvedRiverVideo extends Omit<RiverVideo, 'videoFile' | 'posterImage'> {
  videoUrl: string;
  posterUrl: string;
}

// Artwork Types
export interface ArtworkDimensions {
  width?: number;
  height?: number;
  depth?: number;
  unit?: 'cm' | 'in' | 'm';
}

export interface Artwork {
  _id: string;
  title: LocalizedText;
  slug: {
    _type: 'slug';
    current: string;
  };
  year: number;
  medium: LocalizedText;
  dimensions?: ArtworkDimensions;
  images: SanityImageAsset[];
  description?: LocalizedText;
  mainImage: SanityImageAsset;
  featured?: boolean;
  exhibitions?: string[]; // Array of exhibition _id references
}

// Props for Artwork Components
export interface ArtworkCardProps {
  artwork: Artwork;
  locale?: 'en' | 'de' | 'pl';
  viewMode?: 'grid' | 'list';
}

export interface ArtworkGridProps {
  artworks: Artwork[];
  locale?: 'en' | 'de' | 'pl';
  viewMode?: 'grid' | 'list';
}

// Filter types for artwork archive
export interface ArtworkFilters {
  year?: number;
  medium?: string;
  search?: string;
}

// Exhibition Types
export interface Exhibition {
  _id: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  title: LocalizedText;
  year: number;
  startDate?: string; // ISO format: '2024-03-15'
  endDate?: string;
  type: 'solo' | 'group' | 'institutional';
  venue: {
    name: LocalizedText;
    city: string;
    country: string;
  };
  description?: LocalizedText;
  featuredArtworks?: string[]; // Array of artwork IDs
  images?: SanityImageAsset[];
  pressRelease?: SanityFileAsset;
  mainImage?: SanityImageAsset;
}

// Props for Exhibition Components
export interface ExhibitionCardProps {
  exhibition: Exhibition;
  locale?: 'en' | 'de' | 'pl';
  viewMode?: 'detailed' | 'compact';
}

// Filter types for exhibitions
export interface ExhibitionFilters {
  year?: number;
  type?: 'solo' | 'group' | 'institutional' | 'all';
  search?: string;
}

// Publication/Text Document Types
export interface Publication {
  _id: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  title: LocalizedText;
  description?: LocalizedText;
  year: number;
  type: 'pdf' | 'doc' | 'epub' | 'other';
  category: 'essay' | 'catalog' | 'interview' | 'press' | 'monograph' | 'other';
  file: SanityFileAsset;
  fileUrl?: string; // For direct file paths in public folder
  fileSize?: string; // e.g., "2.4 MB"
  pageCount?: number;
  thumbnail?: SanityImageAsset; // Preview image of first page
  author?: LocalizedText;
  publisher?: string;
  language?: 'en' | 'de' | 'pl' | 'multiple';
  featured?: boolean;
}

// Props for Publication Components
export interface PublicationCardProps {
  publication: Publication;
  locale?: 'en' | 'de' | 'pl';
  viewMode?: 'grid' | 'list';
}

// Filter types for publications
export interface PublicationFilters {
  year?: number;
  type?: 'pdf' | 'doc' | 'epub' | 'other' | 'all';
  category?: 'essay' | 'catalog' | 'interview' | 'press' | 'monograph' | 'other' | 'all';
  search?: string;
}
