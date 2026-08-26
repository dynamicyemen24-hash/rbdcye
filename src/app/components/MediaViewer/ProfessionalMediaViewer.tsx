/**
 * ProfessionalMediaViewer - المستعرض الموحد للوسائط
 * Unified Professional Media Viewer (Images + Videos)
 * 
 * Features:
 * - Integrated frame (not fullscreen modal)
 * - Resizable viewer with drag
 * - Smart sidebar with media list
 * - Type-specific controls (Image/Video)
 * - Multiple navigation methods
 * - Lazy loading & performance optimizations
 * - Dark/Light mode support
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, Minimize2,
  ChevronLeft, Settings, Eye, X
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, memo } from 'react';

import { mediaViewerService } from './MediaViewer.service';
import { MediaItem, MediaViewerOptions, PlaybackSpeed, SidebarViewMode } from './MediaViewer.types';

// استخدام framer-motion للتحكم في الإطار
interface ResizableFrameProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onResize: (width: number, height: number) => void;
}

// مكون الإطار القابل للتمديد
const ResizableFrame = memo(({ 
  children, 
  width, 
  height, 
  onResize 
}: ResizableFrameProps) => {
  const [_isResizing, setIsResizing] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      onResize(Math.max(400, newWidth), Math.max(300, newHeight));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, height, onResize]);

  return (
    <div
      ref={frameRef}
      className="relative bg-black/95 rounded-xl overflow-hidden shadow-2xl"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {children}

      {/* مقبض تغيير الحجم */}
      <div
        className="absolute bottom-0 left-0 w-6 h-6 cursor-nwse-resize opacity-70 hover:opacity-100 transition-opacity select-none"
        onMouseDown={handleMouseDown}
        onKeyDown={(e) => {
          const step = 10;
          let delta = 0;
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') delta = step;
          else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') delta = -step;
          if (delta !== 0) {
            e.preventDefault();
            onResize(Math.max(400, width + delta), Math.max(300, height + delta));
          }
        }}
        role="slider"
        tabIndex={0}
        aria-label="تغيير حجم الإطار"
        aria-valuenow={width}
        aria-valuemin={400}
        aria-valuemax={2000}
      >
        <div className="w-full h-full border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
      </div>
    </div>
  );
});

ResizableFrame.displayName = 'ResizableFrame';

// المكون الرئيسي
export const ProfessionalMediaViewer = memo(({
  options = {},
}: { options?: Partial<MediaViewerOptions> } = {}) => {
  // الخيارات الافتراضية
  const {
    autoPlay: _autoPlay = false,
    showSidebar = true,
    sidebarViewMode = 'expanded',
    theme: _theme = 'charity',
    enableKeyboardNav = true,
    enableMouseWheel = true,
    enableSwipe = true,
  } = options;

  // الحالات
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarViewMode>(sidebarViewMode);
  
  // أبعاد الإطار
  const [frameWidth, setFrameWidth] = useState(700);
  const [frameHeight, setFrameHeight] = useState(450);

  // حالات المشغل
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [volume, setVolume] = useState(1);

  // البحث والتصفية
  const [searchTerm] = useState('');
  const [selectedType] = useState<'all' | 'image' | 'video'>('all');

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  // جلب البيانات من Sanity
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const data = await mediaViewerService.fetchAllMedia();
        setMedia(data);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // الوسائط المصفاة
  const filteredMedia = media.filter(item => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = item.title?.toLowerCase().includes(term);
      const matchesDescription = item.description?.toLowerCase().includes(term);
      if (!matchesTitle && !matchesDescription) return false;
    }
    return true;
  });

  // العنصر النشط
  const activeMedia = filteredMedia[activeIndex];
  const activeMediaType = activeMedia?.type;

  // التنقل
  const handleNext = useCallback(() => {
    if (activeIndex < filteredMedia.length - 1) {
      setActiveIndex(activeIndex + 1);
      setProgress(0);
    } else {
      // الانتقال لأول عنصر (حسب الإعدادات)
      setActiveIndex(0);
    }
  }, [activeIndex, filteredMedia.length]);

  const handlePrevious = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setProgress(0);
    } else {
      // الانتقال لآخر عنصر
      setActiveIndex(filteredMedia.length - 1);
    }
  }, [activeIndex, filteredMedia.length]);

  // التحكم بالمشغل
  useEffect(() => {
    if (videoRef.current && activeMediaType === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isPlaying, isMuted, volume, activeMediaType]);

  // معالجة الأسهم
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showViewer) return;

      switch (e.key) {
        case 'ArrowLeft':
          handleNext();
          break;
        case 'ArrowRight':
          handlePrevious();
          break;
        case ' ':
          if (activeMediaType === 'video') {
            setIsPlaying(!isPlaying);
          }
          break;
        case 'm':
        case 'M':
          if (activeMediaType === 'video') {
            setIsMuted(!isMuted);
          }
          break;
        case 'f':
        case 'F':
          // ملء الإطار
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, showViewer, handleNext, handlePrevious, activeMediaType, isPlaying, isMuted]);

  // معالجة عجلة الماوس
  useEffect(() => {
    if (!enableMouseWheel) return;

    const handleWheel = (e: WheelEvent) => {
      if (!showViewer) return;
      
      e.preventDefault();
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [enableMouseWheel, showViewer, handleNext, handlePrevious]);

  // إخفاء أدوات التحكم تلقائياً
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  // معالجة اللمس (Swipe)
  useEffect(() => {
    if (!enableSwipe || !showViewer) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrevious();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enableSwipe, showViewer, handleNext, handlePrevious]);

  // تنسيق الوقت
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Picture in Picture
  const handlePiP = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.requestPictureInPicture();
      } catch (error) {
        console.error('PiP failed:', error);
      }
    }
  };

  // تحميل الفيديو عند الطلب
  const [videoLoaded, setVideoLoaded] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">جاري تحميل الوسائط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-[var(--background)]" dir="rtl">
      {/* رأس الصفحة */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            المكتبة المرئية{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              المتكاملة
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            استعرض أبرز لحظاتنا وأعمالنا بالصور والفيديوهات
          </p>
        </motion.div>
      </div>

      {/* زر البدء */}
      {!showViewer && (
        <div className="max-w-6xl mx-auto px-4 mb-8 flex justify-center">
          <button
            onClick={() => setShowViewer(true)}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
          >
            <Eye className="w-6 h-6" />
            <span>عرض المكتبة</span>
            <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* المشغل المدمج */}
      <AnimatePresence>
        {showViewer && activeMedia && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center px-4 pb-20"
            onMouseMove={handleMouseMove}
          >
            <ResizableFrame
              width={frameWidth}
              height={frameHeight}
              onResize={(w, h) => {
                setFrameWidth(w);
                setFrameHeight(h);
              }}
            >
              <div className="relative h-full flex flex-col">
                {/* رأس المشغل */}
                <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-white">
                      <h3 className="font-bold">{activeMedia.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/70 mt-1">
                        <span>
                          {activeIndex + 1} / {filteredMedia.length}
                        </span>
                        {activeMedia.category && (
                          <span className="bg-white/20 px-2 py-0.5 rounded-full">
                            {activeMedia.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFrameWidth(700)}
                        className="p-1.5 rounded-full hover:bg-white/20"
                        title="الحجم الطبيعي"
                      >
                        <Minimize2 className="w-4 h-4 text-white" />
                      </button>
                      
                      <button
                        onClick={() => setSidebarMode(prev => 
                          prev === 'expanded' ? 'collapsed' : 'expanded'
                        )}
                        className="p-1.5 rounded-full hover:bg-white/20"
                        title="إظهار/إخفاء القائمة"
                      >
                        <Settings className="w-4 h-4 text-white" />
                      </button>
                      
                      <button
                        onClick={() => setShowViewer(false)}
                        className="p-1.5 rounded-full hover:bg-red-500"
                        title="إغلاق"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* محتوى الوسائط */}
                <div className="flex-1 flex items-center justify-center p-16">
                  {activeMediaType === 'image' ? (
                    // عارض الصور
                    <img
                      src={activeMedia.url || '/favicon.svg'}
                      alt={activeMedia.altText || activeMedia.title}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: 'calc(100% - 80px)' }}
                    />
                  ) : (
                    // مشغل الفيديو
                    <div className="relative w-full">
                      {!videoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                      
                      <video
                        ref={videoRef}
                        src={activeMedia.videoUrl || activeMedia.url}
                        className="w-full aspect-video"
                        muted={isMuted}
                        onTimeUpdate={() => {
                          if (videoRef.current) {
                            const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                            setProgress(prog);
                          }
                        }}
                        onLoadedData={() => setVideoLoaded(true)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        <track kind="captions" srcLang="ar" label="العربية" />
                      </video>
                    </div>
                  )}
                </div>

                {/* أدوات التحكم */}
                <AnimatePresence>
                  {showControls && activeMediaType === 'video' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent"
                    >
                   {/* شريط التقدم */}
<div className="relative w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group">
  <div
    className="absolute inset-0 flex items-center"
    onClick={(e) => {
      if (videoRef.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        // حساب النسبة المئوية مع تقييد بين 0 و 1
        const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        videoRef.current.currentTime = percent * videoRef.current.duration;
      }
    }}
    onKeyDown={(e) => {
      // التنقل بواسطة مفاتيح الأسهم (يسار/يمين) بزيادة 5 ثوانٍ
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const step = e.key === 'ArrowRight' ? 5 : -5;
        if (videoRef.current) {
          const newTime = Math.min(
            Math.max(videoRef.current.currentTime + step, 0),
            videoRef.current.duration
          );
          videoRef.current.currentTime = newTime;
        }
      }
    }}
    role="slider"
    aria-label="شريط تقدم الفيديو"
    aria-valuenow={progress} // progress هي قيمة百分比 (0-100)
    aria-valuemin={0}
    aria-valuemax={100}
    tabIndex={0}
  >
    {/* شريط التقدم المملوء */}
    <div
      className="h-full bg-white rounded-full transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
    />
    {/* مؤشر (thumb) يظهر عند التمرير */}
    <div
      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      style={{ left: `calc(${progress}% - 8px)` }}
    />
  </div>
</div>

                      {/* أزرار التحكم */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-1.5 rounded hover:bg-white/20"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-1.5 rounded hover:bg-white/20"
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white" />
                            )}
                          </button>

                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={e => setVolume(parseFloat(e.target.value))}
                            className="w-20"
                          />
                          
                          <span className="text-xs text-white/70">
                            {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / {activeMedia.duration || '0:00'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePiP}
                            className="p-1.5 rounded hover:bg-white/20 text-xs"
                            title="Picture in Picture"
                          >
                            PiP
                          </button>
                          
                          <button
                            onClick={() => setPlaybackSpeed(s => {
                              const speeds: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
                              const currentIndex = speeds.indexOf(s);
                              const nextIndex = (currentIndex + 1) % speeds.length;
                              return speeds[nextIndex];
                            })}
                            className="p-1.5 rounded hover:bg-white/20 text-xs"
                            title="سرعة التشغيل"
                          >
                            {playbackSpeed}x
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ResizableFrame>
          </motion.div>
        )}
      </AnimatePresence>

      {/* القائمة الجانبية */}
      {showSidebar && (
        <div className="fixed top-16 bottom-0 right-0 z-30">
          {/* تنفيذ مبسط للقائمة الجانبية */}
          <div 
            className="h-full bg-black/80 backdrop-blur-sm overflow-y-auto"
            style={{
              width: sidebarMode === 'expanded' ? '280px' : sidebarMode === 'collapsed' ? '60px' : '0px',
              marginTop: '64px',
            }}
          >
            {sidebarMode === 'expanded' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">الوسائط</h3>
                  <span className="text-xs text-gray-400">
                    {media.filter(m => m.type === 'image').length} 🖼️
                  </span>
                </div>
                {filteredMedia.map((item, index) => (
                  <button
                    key={item._id}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full mb-2 p-2 rounded-lg transition-all text-right ${
                      activeIndex === index
                        ? 'bg-emerald-600/30 border border-emerald-500'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    aria-label={`عرض ${item.title}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {item.type === 'image' ? '🖼️' : '🎥'}
                      </span>
                      <span className="text-sm text-white truncate">
                        {item.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ProfessionalMediaViewer.displayName = 'ProfessionalMediaViewer';

export default ProfessionalMediaViewer;