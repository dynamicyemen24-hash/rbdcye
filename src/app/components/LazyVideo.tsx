import { useState, useRef, useEffect } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

/**
 * ???? ????? ?????? ?????? ????? ??? ???????
 */
export function LazyVideo({ 
  src, 
  poster = '/images/defaults/about-hero.svg',
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ?????? ???? ??????? ?? viewport
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // ????? ??????? ??? ??????
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                videoElement.load();
              });
            } else {
              videoElement.load();
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        poster={poster}
        preload="metadata"
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay && isInView ? autoPlay : false}
        onLoadStart={() => {}}
        onLoadedData={handleLoad}
        onError={handleError}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        {/* ?? ???? ??? ??? ??????? ??? ???? */}
        <img 
          src={poster} 
          alt="????? ?????? ????????" 
          className="w-full h-full object-cover"
        />
        {/* Track for accessibility */}
        <track kind="captions" src="" label="Arabic" />
      </video>
    </div>
  );
}

