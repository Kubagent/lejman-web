import { client } from './client';
import { siteSettingsQuery } from './queries';

export interface SiteSettings {
  artistName: string;
  contactEmail: string;
  galleryEmail?: string;
  galleryName: {
    en: string;
    de: string;
    pl: string;
  };
  galleryUrl: string;
  biography: {
    en: string;
    de: string;
    pl: string;
  };
  biographyImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
    caption?: string;
  };
  metaDescription: {
    en: string;
    de: string;
    pl: string;
  };
}

/**
 * Fetch site settings from Sanity
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return default values if fetch fails
    return {
      artistName: 'Dominik L.',
      contactEmail: '',
      galleryName: {
        en: 'Gallery',
        de: 'Galerie',
        pl: 'Galeria'
      },
      galleryUrl: '',
      biography: {
        en: '',
        de: '',
        pl: ''
      },
      metaDescription: {
        en: '',
        de: '',
        pl: ''
      }
    };
  }
}
