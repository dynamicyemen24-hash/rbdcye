/**
 * Sanity Integration - Export all modules
 */

// Re-export client and utilities from lib directory
export { client, sanityFetch, getServerClient } from './lib/client';
export { urlFor, urlForLqip, getImageDimensions, urlFor as buildImageUrl } from './lib/image';
export * from './queries/index';
export { sanityService } from '../shared/services/sanity.service';
export { schemaTypes } from './schema';

// Build utilities (alias for compatibility)
export const buildFileUrl = (source: { asset?: { url?: string } }) => source?.asset?.url || '';

