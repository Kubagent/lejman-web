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

export interface CustomDimension {
  value: number;
  label: string;
}

// Linked project reference (expanded from Sanity query)
export interface LinkedProject {
  _id: string;
  title: LocalizedText;
  slug?: {
    current: string;
  };
  year?: number;
  venue?: LocalizedText;
  thumbnail?: SanityImageAsset;
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
  customDimensions?: CustomDimension[];
  images: SanityImageAsset[];
  videos?: any[]; // Array of video assets (Mux or file)
  description?: LocalizedText;
  mainImage: SanityImageAsset;
  featured?: boolean;
  projects?: LinkedProject[]; // Array of expanded project references
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

// Project Types
export interface Project {
  _id: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  title: LocalizedText;
  year: number;
  startDate?: string; // ISO format: '2024-03-15'
  endDate?: string;
  isOngoing?: boolean; // Flag for ongoing/permanent projects
  type: 'solo' | 'group' | 'institutional';
  venue: LocalizedText;
  location: string; // City, Country
  description?: LocalizedText;
  featuredArtworks?: string[]; // Array of artwork IDs
  images?: SanityImageAsset[]; // First image used as thumbnail
  videos?: any[]; // Array of video assets (Mux or file)
  pressRelease?: SanityFileAsset;
  artworks?: Artwork[]; // Populated artworks for detail page
}

// Props for Project Components
export interface ProjectCardProps {
  project: Project;
  locale?: 'en' | 'de' | 'pl';
  viewMode?: 'list' | 'grid';
}

// Filter types for projects
export interface ProjectFilters {
  year?: number;
  type?: 'solo' | 'group' | 'institutional' | 'all';
  search?: string;
}

// Written Work Document Types
export interface WrittenWork {
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

// Props for Written Work Components
export interface WrittenWorkCardProps {
  writtenWork: WrittenWork;
  locale?: 'en' | 'de' | 'pl';
  viewMode?: 'grid' | 'list';
}

// Filter types for written works
export interface WrittenWorkFilters {
  year?: number;
  type?: 'pdf' | 'doc' | 'epub' | 'other' | 'all';
  category?: 'essay' | 'catalog' | 'interview' | 'press' | 'monograph' | 'other' | 'all';
  search?: string;
}
