// IntroVideoPlayer - مشغل الفيديو التعريفي المدمج في الصفحة الرئيسية
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  ChevronLeft, X, Grid3X3
} from 'lucide-react';
import { useState, useRef, useEffect, memo } from 'react';

interface IntroVideoPlayerProps {
  videoSrc?: string;
  poster?: string;
  title?: string;
  onGalleryClick?: () => void;
}

interface InlineVideoPlayerProps {
  videoSrc: string;
  poster?: string;
  title?: string;
  onGalleryClick?: () => void;
  initialPlay?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// مشغل الفيديو المدمج
const InlineVideoPlayer = memo(({ 
  videoSrc, 
  poster, 
  title,
  onGalleryClick,
}: InlineVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  // مراقبة حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(prog);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = x * videoRef.current.duration;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleSizeToggle = () => {
    setIsLarge(!isLarge);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // fullscreen not supported
    }
  };

  const getContainerClasses = () => {
    let classes = "relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300";
    
    if (isFullscreen) {
      classes = "fixed inset-4 z-50 rounded-lg";
    } else if (isLarge) {
      classes += " max-w-6xl scale-105 z-40";
    } else {
      classes += " max-w-5xl";
    }
    
    return classes;
  };

  return (
    <div 
      ref={containerRef}
      className={getContainerClasses()}
      style={{ backgroundColor: '#0A1A0F' }}
      onMouseMove={handleMouseMove}
    >
      {/* شريط العنوان */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex-1 text-white">
            <h3 className="text-lg font-bold">{title || 'الفيديو التعريفي'}</h3>
            <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
              <span>فيديو تعريفي</span>
              <span>•</span>
              <span>رحماء بينهم</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* زر توسيع/تصغير */}
            <button 
              onClick={handleSizeToggle} 
              className="p-2 rounded-full hover:bg-white/20 transition-colors" 
              title={isLarge ? "تصغير" : "تكبير"}
            >
              {isLarge ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
            
            {/* زر المعرض */}
            {onGalleryClick && (
              <button 
                onClick={onGalleryClick} 
                className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                title="المعرض"
              >
                <Grid3X3 className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* مشغل الفيديو */}
      <div className="relative">
        {/* حالة التحميل */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-white/70 text-sm">جاري تحميل الفيديو...</span>
            </div>
          </div>
        )}

        {/* حالة عدم الاتصال */}
        {isOffline && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 p-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <VolumeX className="w-10 h-10 text-amber-400" />
            </div>
            <h4 className="text-white text-lg font-bold mb-2">لا يوجد اتصال بالإنترنت</h4>
            <p className="text-white/70 text-sm text-center mb-4">يتطلب تشغيل الفيديو اتصالاً بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.</p>
            <button
              onClick={() => {
                setIsOffline(false);
                setIsLoading(true);
                setHasError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* حالة الخطأ - فشل تحميل الفيديو */}
        {hasError && !isOffline && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 p-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <X className="w-10 h-10 text-red-400" />
            </div>
            <h4 className="text-white text-lg font-bold mb-2">تعذر تحميل الفيديو</h4>
            <p className="text-white/70 text-sm text-center mb-4">
              {retryCount >= 2 
                ? 'تعذر تحميل الفيديو بعد عدة محاولات. قد يكون الفيديو غير متاح حالياً.'
                : 'حدث خطأ أثناء تحميل الفيديو. يرجى المحاولة مرة أخرى.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  setRetryCount(prev => prev + 1);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={videoSrc}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className={`w-full aspect-video transition-all ${isFullscreen ? 'h-full object-cover' : ''}`}
          poster={poster}
          playsInline
        >
          <track kind="captions" srcLang="ar" label="العربية" />
        </video>

        {/* عرض الصورة الثابتة كبديل عند الخطأ */}
        {hasError && poster && !isOffline && (
          <div className="absolute inset-0 z-[5]">
            <img 
              src={poster} 
              alt={title || 'فيديو تعريفي'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90"
            >
              <button
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3 flex items-center justify-start"
                onClick={handleProgressClick}
                aria-label="شريط تقدم الفيديو"
              >
                <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: '#10B981' }} />
              </button>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)} 
                    className="p-2 rounded-lg hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="p-2 rounded-lg hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <div className="text-white/70 text-sm">
                    {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / {videoRef.current?.duration ? formatTime(videoRef.current.duration) : '0:00'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* سرعة التشغيل */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowSpeed(!showSpeed)} 
                      className="p-2 rounded-lg text-white/70 text-xs font-bold"
                    >
                      {playbackSpeed}x
                    </button>
                    {showSpeed && (
                      <div className="absolute bottom-full left-0 mb-1 bg-black/90 rounded-lg p-1 min-w-[80px]">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              if (videoRef.current) videoRef.current.playbackRate = speed;
                              setPlaybackSpeed(speed);
                              setShowSpeed(false);
                            }}
                            className={`block w-full text-center py-1 text-xs rounded ${
                              playbackSpeed === speed ? 'bg-[#10B981] text-white' : 'text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* زر ملء الشاشة */}
                  <button 
                    onClick={handleFullscreen} 
                    className="p-2 rounded-lg hover:bg-white/20"
                    title={isFullscreen ? "إغلاق ملء الشاشة" : "ملء الشاشة"}
                  >
                    {isFullscreen ? (
                      <X className="w-5 h-5 text-white" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* معلومات الفيديو */}
      {!isFullscreen && videoRef.current?.duration && (
        <div className="p-6 bg-white dark:bg-gray-900">
          <p className="text-[var(--muted-foreground)] text-center">
            {title || 'فيديو تعريفي لـ رحماء بينهم - إغاثة وتنمية'}
          </p>
        </div>
      )}
    </div>
  );
});

InlineVideoPlayer.displayName = 'InlineVideoPlayer';

// زر عرض الفيديو التعريفي
const StoryWatchButton = memo(({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#10B981]/30 hover:shadow-xl transition-all"
  >
    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
      <Play className="w-6 h-6 text-white" fill="currentColor" />
    </div>
    <span className="text-lg">شاهد قصتنا</span>
    <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </motion.button>
));

StoryWatchButton.displayName = 'StoryWatchButton';

// المكون الرئيسي
export const IntroVideoPlayer = memo(({ 
  videoSrc = '/videos/hero-background.mp4',
  poster = '/favicon.svg',
  title = 'الفيديو التعريفي',
  onGalleryClick,
}: IntroVideoPlayerProps) => {
  const [showPlayer, setShowPlayer] = useState(false);
  
  return (
    <div className="w-full">
      <AnimatePresence>
        {!showPlayer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <StoryWatchButton onClick={() => setShowPlayer(true)} />
          </motion.div>
        ) : (
          <InlineVideoPlayer
            videoSrc={videoSrc}
            poster={poster}
            title={title}
            onGalleryClick={onGalleryClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

IntroVideoPlayer.displayName = 'IntroVideoPlayer';

export default IntroVideoPlayer;