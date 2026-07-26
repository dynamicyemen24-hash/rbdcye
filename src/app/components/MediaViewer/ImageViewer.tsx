/* cspell:disable */
/**
 * ImageViewer - عارض صور متقدم مع تحكمات كاملة
 * يدعم: التكبير/التصغير، التدوير، القلب، الجر، اللمس، ملء الشاشة، وأوضاع العرض المختلفة
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  Share2,
  Info,
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ImageOff,
  Move,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';

// ===== الأنواع =====
export type ImageFitMode = 'original' | 'fitWidth' | 'fitHeight' | 'contain' | 'cover';

export interface MediaItem {
  url: string;
  title?: string;
  description?: string;
  altText?: string;
  category?: string;
  _createdAt?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface ImageViewerState {
  zoom: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  fitMode: ImageFitMode;
  panX: number;
  panY: number;
}

interface ImageViewerProps {
  media: MediaItem | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  theme?: 'light' | 'dark' | 'charity';
  enableFullscreen?: boolean;
  autoHideControls?: boolean;
}

// ===== أدوات مساعدة =====
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

// دالة مساعدة للحصول على تسمية وضع العرض (لتجنب التيرناري المتداخل)
const getFitModeLabel = (mode: ImageFitMode): string => {
  switch (mode) {
    case 'contain':
      return 'Fit';
    case 'cover':
      return 'Cover';
    case 'fitWidth':
      return 'عرض';
    case 'fitHeight':
      return 'ارتفاع';
    case 'original':
    default:
      return 'أصلي';
  }
};

// ===== المكون الرئيسي =====
export const ImageViewer = memo(
  ({
    media,
    onClose,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext,
    theme = 'charity',
    enableFullscreen = true,
    autoHideControls = true,
  }: ImageViewerProps) => {
    // ---- الحالة ----
    const [state, setState] = useState<ImageViewerState>({
      zoom: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      fitMode: 'contain',
      panX: 0,
      panY: 0,
    });

    const [showInfo, setShowInfo] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);

    // مراجع
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });

    // ---- تأثيرات جانبية ----
    // إخفاء الأزرار تلقائياً
    useEffect(() => {
      if (!autoHideControls) return;
      const resetTimer = () => {
        setControlsVisible(true);
        clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
      };
      const handleMouseMove = () => resetTimer();
      const handleKeyDown = () => resetTimer();

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keydown', handleKeyDown);
      resetTimer();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(controlsTimeout.current);
      };
    }, [autoHideControls]);

    // ---- دوال التحكم (مع useCallback) ----
    const handleZoomIn = useCallback(() => {
      setState((s) => ({ ...s, zoom: clamp(s.zoom + 0.1, 0.1, 10) }));
    }, []);

    const handleZoomOut = useCallback(() => {
      setState((s) => ({ ...s, zoom: clamp(s.zoom - 0.1, 0.1, 10) }));
    }, []);

    const handleRotate = useCallback(() => {
      setState((s) => ({ ...s, rotation: (s.rotation + 90) % 360 }));
    }, []);

    const handleFlipHorizontal = useCallback(() => {
      setState((s) => ({ ...s, flipHorizontal: !s.flipHorizontal }));
    }, []);

    const handleFlipVertical = useCallback(() => {
      setState((s) => ({ ...s, flipVertical: !s.flipVertical }));
    }, []);

    const handleFitMode = useCallback((mode: ImageFitMode) => {
      setState((s) => ({
        ...s,
        fitMode: mode,
        zoom: 1,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        panX: 0,
        panY: 0,
      }));
    }, []);

    const handleReset = useCallback(() => {
      setState({
        zoom: 1,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        fitMode: 'contain',
        panX: 0,
        panY: 0,
      });
    }, []);

    const handleDownload = useCallback(async () => {
      if (!media?.url) return;
      try {
        const response = await fetch(media.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = media.title || 'image';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch {
        window.open(media.url, '_blank');
      }
    }, [media]);

    const handleShare = useCallback(async () => {
      if (!media?.url) return;
      if (navigator.share) {
        try {
          await navigator.share({
            title: media.title,
            text: media.description,
            url: media.url,
          });
        } catch {
          /* user cancelled */
        }
      } else {
        await navigator.clipboard.writeText(media.url);
        alert('تم نسخ الرابط إلى الحافظة');
      }
    }, [media]);

    const toggleFullscreen = useCallback(() => {
      if (!containerRef.current) return;
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }, []);

    // ---- أحداث الفأرة واللمس للتحريك ----
    const onPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (state.zoom <= 1) return;
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        panStart.current = { x: state.panX, y: state.panY };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [state.zoom, state.panX, state.panY],
    );

    const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setState((s) => ({
        ...s,
        panX: s.panX + dx,
        panY: s.panY + dy,
      }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
      isDragging.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }, []);

    // دعم التكبير باللمس (Pinch)
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let initialPinchDist = 0;
      let initialZoom = 1;
      let _initialPanX = 0; // غير مستخدم لكن نحتفظ به لتجنب التحذير
      let _initialPanY = 0;
      let touchStart = { x: 0, y: 0 };
      let isPinching = false;

      const getDistance = (touches: TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
      };

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          isPinching = true;
          initialPinchDist = getDistance(e.touches);
          initialZoom = state.zoom;
          _initialPanX = state.panX;
          _initialPanY = state.panY;
          e.preventDefault();
        } else if (e.touches.length === 1 && state.zoom > 1) {
          isDragging.current = true;
          touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          panStart.current = { x: state.panX, y: state.panY };
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2 && isPinching) {
          const dist = getDistance(e.touches);
          const scale = dist / initialPinchDist;
          const newZoom = clamp(initialZoom * scale, 0.1, 10);
          setState((s) => ({ ...s, zoom: newZoom }));
          e.preventDefault();
        } else if (e.touches.length === 1 && isDragging.current) {
          const dx = e.touches[0].clientX - touchStart.x;
          const dy = e.touches[0].clientY - touchStart.y;
          setState((s) => ({
            ...s,
            panX: panStart.current.x + dx,
            panY: panStart.current.y + dy,
          }));
          e.preventDefault();
        }
      };

      const handleTouchEnd = () => {
        isPinching = false;
        isDragging.current = false;
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      container.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchEnd);
      };
    }, [state.zoom, state.panX, state.panY]);

    // ---- حساب أنماط الصورة ----
    const imageStyle = useMemo(() => {
      const { zoom, rotation, flipHorizontal, flipVertical, fitMode, panX, panY } = state;

      const containerWidth = containerRef.current?.clientWidth || window.innerWidth * 0.9;
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight * 0.9;

      const img = imageRef.current;
      const imgWidth = img?.naturalWidth || 800;
      const imgHeight = img?.naturalHeight || 600;

      // حساب المقياس حسب وضع العرض
      let finalScale: number;
      switch (fitMode) {
        case 'fitWidth':
          finalScale = containerWidth / imgWidth;
          break;
        case 'fitHeight':
          finalScale = containerHeight / imgHeight;
          break;
        case 'contain':
          finalScale = Math.min(containerWidth / imgWidth, containerHeight / imgHeight);
          break;
        case 'cover':
          finalScale = Math.max(containerWidth / imgWidth, containerHeight / imgHeight);
          break;
        default: // 'original'
          finalScale = zoom;
          break;
      }

      const scale = fitMode === 'original' ? zoom : finalScale;

      const transforms = [
        `translate(${panX}px, ${panY}px)`,
        `scale(${scale})`,
        `rotate(${rotation}deg)`,
        flipHorizontal ? 'scaleX(-1)' : '',
        flipVertical ? 'scaleY(-1)' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return {
        transform: transforms,
        transformOrigin: 'center',
        cursor: scale > 1 ? 'grab' : 'default',
        touchAction: 'none',
      };
    }, [state]);

    // ---- عرض معلومات الصورة ----
    const infoPanel = (
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4 text-white backdrop-blur-sm"
          >
            <h3 className="font-bold text-lg mb-2">{media?.title || 'بدون عنوان'}</h3>
            {media?.description && (
              <p className="text-sm text-white/80 mb-2">{media.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>التصنيف: {media?.category || 'غير محدد'}</span>
              <span>
                تاريخ الإضافة:{' '}
                {media?._createdAt
                  ? new Date(media._createdAt).toLocaleDateString('ar-YE')
                  : 'غير محدد'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );

    // ---- أزرار التحكم ----
    const Controls = useMemo(
      () => (
        <div
          className={`absolute top-4 right-4 z-20 flex items-center gap-2 transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* المجموعة الأولى: تكبير/تصغير، تدوير، قلب، إعادة ضبط */}
          <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title="تصغير"
              disabled={state.zoom <= 0.1}
            >
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-white text-xs px-2 min-w-[50px] text-center">
              {Math.round(state.zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title="تكبير"
              disabled={state.zoom >= 10}
            >
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button
              onClick={handleRotate}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title="تدوير"
            >
              <RotateCw className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleFlipHorizontal}
              className={`p-2 rounded transition-colors ${
                state.flipHorizontal ? 'bg-white/30' : 'hover:bg-white/20'
              }`}
              title="قلب أفقي"
            >
              <FlipHorizontal className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleFlipVertical}
              className={`p-2 rounded transition-colors ${
                state.flipVertical ? 'bg-white/30' : 'hover:bg-white/20'
              }`}
              title="قلب عمودي"
            >
              <FlipVertical className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title="إعادة تعيين"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="w-px h-8 bg-white/20" />

          {/* المجموعة الثانية: أوضاع العرض، تنزيل، مشاركة، ملء الشاشة */}
          <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1 backdrop-blur-sm">
            {(
              ['contain', 'cover', 'fitWidth', 'fitHeight', 'original'] as ImageFitMode[]
            ).map((mode) => (
              <button
                key={mode}
                onClick={() => handleFitMode(mode)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  state.fitMode === mode
                    ? 'bg-white/30 text-white'
                    : 'text-white/70 hover:bg-white/20'
                }`}
                title={mode}
              >
                {getFitModeLabel(mode)}
              </button>
            ))}
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button
              onClick={handleDownload}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title="تنزيل"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            {enableFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded hover:bg-white/20 transition-colors"
                title="ملء الشاشة"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
            )}
          </div>

          <div className="w-px h-8 bg-white/20" />

          {/* المجموعة الثالثة: التنقل والإغلاق */}
          <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1 backdrop-blur-sm">
            {onPrevious && (
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`p-2 rounded transition-colors ${
                  hasPrevious ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
                }`}
                title="السابق"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={`p-2 rounded transition-colors ${
                  hasNext ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
                }`}
                title="التالي"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-red-500 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      ),
      [
        controlsVisible,
        state.zoom,
        state.flipHorizontal,
        state.flipVertical,
        state.fitMode,
        isFullscreen,
        enableFullscreen,
        onPrevious,
        onNext,
        hasPrevious,
        hasNext,
        onClose,
        handleZoomIn,
        handleZoomOut,
        handleRotate,
        handleFlipHorizontal,
        handleFlipVertical,
        handleFitMode,
        handleReset,
        handleDownload,
        handleShare,
        toggleFullscreen,
      ],
    );

    // ---- زر المعلومات ----
    const InfoButton = useMemo(
      () => (
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`absolute top-4 left-4 p-2 rounded-lg bg-black/70 hover:bg-white/20 transition-colors backdrop-blur-sm z-20 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } transition-opacity duration-300`}
          title="المعلومات"
        >
          <Info className="w-5 h-5 text-white" />
        </button>
      ),
      [controlsVisible, showInfo],
    );

    // ---- حالة التحميل والخطأ ----
    if (!media) return null;

    // تطبيق السمة (theme) على الخلفية
    const bgClass =
      theme === 'light'
        ? 'bg-white/95'
        : theme === 'charity'
          ? 'bg-charity/95'
          : 'bg-black/95';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${bgClass} p-4`}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="عارض الصور"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label="حاوية الصورة"
        >
          {/* الأزرار */}
          {Controls}
          {InfoButton}

          {/* معلومات الصورة */}
          {infoPanel}

          {/* مؤشر التحميل */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* الصورة */}
          {imageError ? (
            <div className="flex flex-col items-center justify-center text-white/50">
              <ImageOff className="w-16 h-16 mb-2" />
              <span>تعذر تحميل الصورة</span>
            </div>
          ) : (
            <img
              ref={imageRef}
              src={media.url}
              alt={media.altText || media.title || 'صورة'}
              className="max-w-full max-h-full select-none"
              style={imageStyle}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              draggable={false}
            />
          )}

          {/* مساعدة التحريك عند التكبير */}
          {state.zoom > 1 && imageLoaded && !imageError && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none animate-pulse">
              <Move className="w-4 h-4 inline mr-1" /> اسحب للتنقل
            </div>
          )}
        </div>
      </motion.div>
    );
  },
);

ImageViewer.displayName = 'ImageViewer';
export default ImageViewer;
/* cspell:enable */