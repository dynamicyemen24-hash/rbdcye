/**
 * Optimized Sanity Image Component
 * مكون صورة متكامل مع Sanity CDN مع دعم LQIP والتنسيق التلقائي
 */
import { useState } from "react";

import { urlFor, getImageDimensions } from "../lib/image";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface SanityImageProps {
  value: SanityImageSource & {
    alt?: string;
    asset?: {
      metadata?: {
        lqip?: string;
        dimensions?: { width: number; height: number };
      };
    };
  };
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

export function SanityImage({
  value,
  width = 800,
  height,
  className = "",
  priority = false,
  loading = "lazy",
}: SanityImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!value?.asset) return null;

  const dimensions = getImageDimensions(value);
  const imgHeight = height || Math.round(width / (dimensions?.width && dimensions?.height
    ? dimensions.width / dimensions.height
    : 1.5));

  const src = urlFor(value, width, imgHeight);
  const lqipBlur = value?.asset?.metadata?.lqip;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: "100%",
        aspectRatio: `${width} / ${imgHeight}`,
        background: lqipBlur || "#0F4C3A",
      }}
    >
      {/* LQIP Placeholder */}
      {lqipBlur && !loaded && (
        <img
          src={lqipBlur}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main Image */}
      {!error ? (
        <img
          src={src}
          alt={value.alt || ""}
          width={width}
          height={imgHeight}
          loading={priority ? "eager" : loading}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ aspectRatio: `${width} / ${imgHeight}` }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
          <span className="text-sm">⚠️</span>
        </div>
      )}
    </div>
  );
}

/**
 * Next-gen responsive picture element with WebP/AVIF support
 */
export function SanityPicture({
  value,
  widths = [400, 800, 1200],
  className = "",
  alt = "",
}: {
  value: SanityImageSource;
  widths?: number[];
  className?: string;
  alt?: string;
}) {
  if (!value) return null;

  const srcSet = widths
    .map((w) => `${urlFor(value, w)} ${w}w`)
    .join(", ");

  return (
    <picture>
      {widths.map((w) => (
        <source
          key={w}
          srcSet={urlFor(value, w)}
          media={`(max-width: ${w}px)`}
        />
      ))}
      <img
        src={urlFor(value, widths[widths.length - 1])}
        srcSet={srcSet}
        sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}

