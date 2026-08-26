import imageUrlBuilder from '@sanity/image-url';
import { client } from '../sanity/lib/client';

const builder = imageUrlBuilder(client);

export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
    .auto('format')
    .fit('max')
    .quality(80);
}

export function getOptimizedImageUrl(
  source: Parameters<typeof builder.image>[0],
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
) {
  const { width, height, quality = 80, format = 'webp' } = options;

  let image = urlForImage(source);

  if (width) image = image.width(width);
  if (height) image = image.height(height);

  return image
    .quality(quality)
    .format(format)
    .url();
}

export const responsiveSizes = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 },
};

export function getResponsiveImageProps(
  source: Parameters<typeof builder.image>[0],
  alt: string,
  sizes?: string
) {
  return {
    src: getOptimizedImageUrl(source, responsiveSizes.medium),
    srcSet: [
      `${getOptimizedImageUrl(source, responsiveSizes.small)} 300w`,
      `${getOptimizedImageUrl(source, responsiveSizes.medium)} 600w`,
      `${getOptimizedImageUrl(source, responsiveSizes.large)} 1200w`,
    ].join(', '),
    sizes: sizes || '(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px',
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}
