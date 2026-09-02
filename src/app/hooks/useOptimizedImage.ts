import { useState, useEffect, useCallback } from "react";

interface UseOptimizedImageOptions {
  src: string;
  alt?: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
}

interface UseOptimizedImageResult {
  src: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  imgRef: (node: HTMLImageElement | null) => void;
}

export function useOptimizedImage({
  src,
  alt: _alt = "",
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/svg%3E',
  threshold = 0.1,
  rootMargin = "50px",
}: UseOptimizedImageOptions): UseOptimizedImageResult {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
  }, []);

  const _handleError = useCallback(() => {
    setIsLoading(false);
    setIsError(true);
    setError(new Error(`Failed to load image: ${src}`));
  }, [src]);

  useEffect(() => {
    if (!src || !imgRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(imgRef);
    return () => observer.disconnect();
  }, [src, threshold, rootMargin, imgRef]);

  useEffect(() => {
    if (!imgRef) return;

    if (currentSrc !== placeholder) {
      setIsLoading(true);
      setIsError(false);
      setError(null);
    }
  }, [currentSrc, imgRef, placeholder]);

  useEffect(() => {
    if (!imgRef || currentSrc === placeholder) return;

    if (imgRef.complete && imgRef.naturalWidth > 0) {
      handleLoad();
    }
  }, [imgRef, currentSrc, placeholder, handleLoad]);

  return {
    src: currentSrc,
    isLoading,
    isError,
    error,
    imgRef: setImgRef,
  };
}

export function createOptimizedImageSrc(src: string, width: number, quality = 80): string {
  if (!src) return src;

  const separator = src.includes("?") ? "&" : "?";
  const params = new URLSearchParams();

  if (src.includes("unsplash.com")) {
    params.set("w", String(width));
    params.set("q", String(quality));
    params.set("auto", "format");
    params.set("fit", "crop");
    return `${src}${separator}${params.toString()}`;
  }

  if (src.includes("images.pexels.com")) {
    params.set("w", String(width));
    return `${src}${separator}${params.toString()}`;
  }

  return src;
}

export function createOptimizedImageSrcset(
  src: string,
  widths: number[] = [300, 600, 900, 1200],
  quality = 80
): string {
  if (!src) return "";

  const validUrls = widths
    .filter((w) => w > 0)
    .map((w) => `${createOptimizedImageSrc(src, w, quality)} ${w}w`);

  return validUrls.join(", ");
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}
