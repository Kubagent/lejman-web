import { SanityFileAsset } from '../types';

/**
 * Generate download URL for Sanity file assets (videos, PDFs, etc.)
 *
 * Sanity file URLs follow the pattern:
 * https://cdn.sanity.io/files/{projectId}/{dataset}/{assetId}.{extension}
 *
 * Usage:
 * const videoUrl = getFileAssetUrl(video.videoFile);
 */
export function getFileAssetUrl(file: SanityFileAsset): string {
  if (!file?.asset?._ref) {
    console.error('[getFileAssetUrl] Invalid file asset:', file);
    return '';
  }

  const ref = file.asset._ref;

  // DEVELOPMENT MODE: Handle mock URLs (full HTTP/HTTPS URLs)
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    return ref;
  }

  // PRODUCTION MODE: Build Sanity CDN URL
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

  // CRITICAL: Validate environment variables
  if (!projectId) {
    console.error('[getFileAssetUrl] NEXT_PUBLIC_SANITY_PROJECT_ID is not defined');
    return '';
  }

  // Extract asset ID and extension from the reference
  // Format: file-{assetId}-{extension}
  const parts = ref.split('-');

  if (parts.length < 3 || parts[0] !== 'file') {
    console.error('Invalid file reference format:', ref);
    return '';
  }

  const assetId = parts.slice(1, -1).join('-');
  const extension = parts[parts.length - 1];

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${extension}`;
}
