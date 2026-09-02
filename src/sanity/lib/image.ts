/**
 * Sanity Image URL Builder
 * معالجة وتحسين الصور من Sanity CDN
 */
import createImageUrlBuilder from "@sanity/image-url";

import { client } from "./client";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = createImageUrlBuilder(client);

/**
 * Generate optimized image URL with transformations
 * @param source - Sanity image source object
 * @param width - Desired width (default: 800)
 * @param height - Optional height
 * @param quality - Image quality 1-100 (default: 80)
 */
export function urlFor(
  source: SanityImageSource,
  width = 800,
  height?: number,
  quality = 80
): string {
  let img = builder.image(source).width(width).quality(quality).auto("format");

  if (height) {
    img = img.height(height).fit("crop");
  }

  return img.url();
}

/**
 * Generate blur placeholder URL (LQIP)
 */
export function urlForLqip(source: SanityImageSource): string | undefined {
  return builder.image(source).width(20).quality(20).blur(50).url();
}

/**
 * Get image dimensions from Sanity asset metadata
 */
export function getImageDimensions(
  source: SanityImageSource & {
    asset?: { metadata?: { dimensions?: { width: number; height: number } } };
  }
): { width: number; height: number } | null {
  const dimensions = source?.asset?.metadata?.dimensions;
  if (!dimensions) return null;
  return { width: dimensions.width, height: dimensions.height };
}
