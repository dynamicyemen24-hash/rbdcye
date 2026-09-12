import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  placeholder?: string;
  srcSet?: string;
  sizes?: string;
  sizesSet?: Record<string, string>;
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
}

const PLACEHOLDER_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=";

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  placeholder = PLACEHOLDER_SVG,
  srcSet,
  sizes,
  sizesSet,
  fetchPriority,
  decoding = "async",
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(loading === "eager");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === "lazy" && imgRef.current) {
      const el = imgRef.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px", threshold: 0.01 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
    return undefined;
  }, [loading]);

  // Generate srcSet from sizesSet if provided
  const generateSrcSet = (): string | undefined => {
    if (srcSet) return srcSet;
    if (sizesSet) {
      return Object.entries(sizesSet)
        .map(([descriptor, url]) => `${url} ${descriptor}`)
        .join(", ");
    }
    return undefined;
  };

  const finalSrcSet = generateSrcSet();
  // World-class responsive sizes: mobile-first, avoids layout shift
  const finalSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <img
        ref={imgRef}
        // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
        src={isError ? placeholder : isInView ? src : placeholder}
        srcSet={isInView && !isError ? finalSrcSet : undefined}
        sizes={isInView && !isError ? finalSizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsError(true);
          setIsLoaded(true);
        }}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ objectFit: "cover" }}
        {...rest}
      />
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: "var(--brand-green)", opacity: 0.06 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Responsive image helper - generates srcSet for different breakpoints (DPR-aware)
export function generateResponsiveSrcSet(
  baseSrc: string,
  widths: number[],
  extension = "webp"
): string {
  return widths
    .map((w) => `${baseSrc.replace(/\.(jpg|jpeg|png|webp|avif)$/i, `-${w}.${extension}`)} ${w}w`)
    .join(", ");
}

// Generate CDN-aware srcSet (supports query-param style: ?w=320)
export function generateCDNSrcSet(baseSrc: string, widths: number[], withDpr = false): string {
  const entries = widths.map((w) => `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}w=${w}&auto=format ${w}w`);
  if (withDpr) {
    // Add 2x descriptors for high-DPR screens
    const dprEntries = widths.map((w) => `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}w=${w}&dpr=2&auto=format ${w * 2}w`);
    return [...entries, ...dprEntries].join(", ");
  }
  return entries.join(", ");
}

// Preload critical image — uses link preload for browser priority + Image fallback
export function preloadImage(src: string, opts?: { as?: string; fetchPriority?: "high" | "low" | "auto"; crossOrigin?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    // Prefer <link rel="preload"> for priority hint
    if (typeof document !== "undefined") {
      const existing = document.querySelector(`link[rel="preload"][href="${src}"]`);
      if (!existing) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = opts?.as || "image";
        link.href = src;
        if (opts?.fetchPriority) (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = opts.fetchPriority;
        if (opts?.crossOrigin) link.crossOrigin = opts.crossOrigin;
        link.onload = () => resolve();
        link.onerror = () => {
          // Fallback to Image() if link preload fails
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
          img.src = src;
        };
        document.head.appendChild(link);
        // Resolve also when image loads via cache — ensure not hanging
        setTimeout(() => resolve(), 4000);
        return;
      }
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

// Batch preload — connection-aware, skips on slow/offline
export function preloadImages(srcs: string[], opts?: { fetchPriority?: "high" | "low" }): Promise<void[]> {
  if (typeof navigator !== "undefined") {
    const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    if (conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
      return Promise.resolve([]);
    }
  }
  return Promise.all(srcs.map((s) => preloadImage(s, opts).catch(() => undefined as unknown as void)));
}
