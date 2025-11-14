import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './client';

// Initialize the image URL builder with the Sanity client
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URLs from Sanity image assets
 *
 * Usage:
 * urlFor(image).width(800).height(600).url()
 * urlFor(image).width(1200).quality(90).format('webp').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
