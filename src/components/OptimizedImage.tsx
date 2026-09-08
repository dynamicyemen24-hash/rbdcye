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
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
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
        { rootMargin: "100px", threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
    return undefined;
  }, [loading]);

  // Generate srcSet from sizesSet if provided
  const generateSrcSet = (): string | undefined => {
    if (srcSet) return srcSet;
    if (sizesSet && width) {
      return Object.entries(sizesSet)
        .map(([breakpoint, url]) => `${url} ${breakpoint}`)
        .join(", ");
    }
    return undefined;
  };

  const finalSrcSet = generateSrcSet();
  const finalSizes = sizes || "(max-width: 768px) 100vw, 50vw";

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <img
        ref={imgRef}
        src={isInView ? src : placeholder}
        srcSet={finalSrcSet}
        sizes={finalSizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ objectFit: "cover" }}
        {...rest}
      />
      {!isLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
    </div>
  );
}

// Responsive image helper - generates srcSet for different breakpoints
export function generateResponsiveSrcSet(
  baseSrc: string,
  widths: number[],
  extension = "webp"
): string {
  return widths
    .map((w) => `${baseSrc.replace(/\.(jpg|jpeg|png|webp)$/, `-${w}.${extension}`)} ${w}w`)
    .join(", ");
}

// Preload critical image
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}
