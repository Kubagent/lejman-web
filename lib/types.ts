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
