import { useState } from 'react';

import { cn } from './ui/utils';

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * مكون صورة يدعم Fallback عند حدوث خطأ في التحميل
 */
export function FallbackImage({
  src,
  alt,
  fallbackSrc = '/images/defaults/project-default.svg',
  className,
  containerClassName,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative", containerClassName)}>
      {isLoading && (
        <div className={cn("absolute inset-0 animate-pulse bg-gray-200 rounded", className)} />
      )}
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          isLoading ? "opacity-0" : "opacity-100",
          "transition-opacity duration-300 w-full h-full",
          className
        )}
      />
    </div>
  );
}