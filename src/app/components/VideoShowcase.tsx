// VideoShowcase - مشغل الفيديوهات الاحترافي المرتبط بالـ Sanity
// Professional Video Showcase with HLS/DASH, Chapters, Captions, SEO, Analytics
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft,
  Heart, Eye, Sparkles, ExternalLink,
  Loader2, X, Youtube, Video, Settings, Minimize2,
  Download, Share2, Clock, Layers, MessageSquare,
  SkipBack, SkipForward, Fullscreen, RotateCcw
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';

import { sanityClient } from '@/sanity/client';
import { sanityFetch } from '@/sanity/lib/client';

// استعلامات GROQ محسّنة
const VIDEOS_QUERY = `*[_type == "video" && defined(slug.current)] 
  | order(isFeatured desc, publishDate desc) [0...50] {
  _id, title, "slug": slug.current, description,
  thumbnail { asset->{ _id, url, metadata { lqip, dimensions } } },
  videoUrl, videoFile { asset->{ url } },
  duration, category, tags, isFeatured, isStoryVideo,
  views, likes, publishDate,
  chapters[] { time, title },
  seo { metaTitle, metaDescription, ogImage { asset->{ url } } }
}`;

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  youtubeChannelUrl, siteName, tagline,
  heroVideoUrl, heroPoster { asset->{ url } }, heroVideoMuted, heroVideoLoop
}`;

// واجهة الفيديو المحسّنة
interface VideoChapter {
  time: number;
  title: string;
}

interface VideoItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail: string;
  videoUrl?: string;
  videoFile?: { asset?: { url: string } };
  duration?: string;
  category?: string;
  tags?: string[];
  isFeatured?: boolean;
  isStoryVideo?: boolean;
  views?: number;
  likes?: number;
  publishDate?: string;
  chapters?: VideoChapter[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

interface VideoShowcaseProps {
  videos?: VideoItem[];
  setCurrentPage?: (page: string) => void;
  limit?: number;
  showFeatured?: boolean;
  theme?: 'light' | 'dark' | 'charity';
  showStoryButton?: boolean;
  autoPlay?: boolean;
  enableAnalytics?: boolean;
}

// مشغل الفيديو الاحترافي
const ProfessionalVideoPlayer = memo(({ 
  video, 
  onClose, 
  onYoutubeClick,
}: { 
  video: VideoItem | null;
  onClose: () => void;
  onYoutubeClick: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playerSize, setPlayerSize] = useState<'normal' | 'large'>('normal');
  const [showSpeed, setShowSpeed] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.load();
      setIsLoading(true);
      setIsPlaying(true);
      videoRef.current.play().catch(() => {});
    }
    setPlayerSize('normal');
  }, [video]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(prog);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
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

  const handleSizeToggle = () => setPlayerSize(playerSize === 'normal' ? 'large' : 'normal');

  const getPlayerSizeClasses = () => playerSize === 'large' ? 'max-w-6xl scale-105' : 'max-w-5xl';

  if (!video) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(var(--foreground-rgb),0.92)' }}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div 
        className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${getPlayerSizeClasses()}`}
        style={{ backgroundColor: '#0A1A0F' }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        role="presentation"
      >
        {/* رأس المشغل */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1 text-white">
              <h2 className="text-xl font-bold">{video.title}</h2>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span>{video.views?.toLocaleString()} مشاهدة</span>
                <span>•</span>
                <span>{video.publishDate ? new Date(video.publishDate).toLocaleDateString('ar-YE') : '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSizeToggle} className="p-2 rounded-full hover:bg-white/20" title="توسيع/تصغير">
                <Maximize2 className="w-6 h-6 text-white" />
              </button>
              <button onClick={onYoutubeClick} className="p-2 rounded-full hover:bg-white/20" title="قناة اليوتيوب">
                <Youtube className="w-6 h-6 text-red-500" />
              </button>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20" aria-label="إغلاق">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* مشغل الفيديو */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-16 h-16 animate-spin text-white" />
            </div>
          )}
          
          <video
            ref={videoRef}
            src={video.videoUrl}
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={() => setIsLoading(false)}
            className="w-full aspect-video"
            poster={video.thumbnail}
            playsInline
          >
            <track kind="captions" srcLang="ar" label="العربية" />
          </video>

          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90"
              >
                <button
                  className="w-full h-2 bg-white/20 rounded-full mb-3 relative overflow-hidden"
                  onClick={handleProgressClick}
                  aria-label="شريط التقدم"
                >
                  <div className="h-full rounded-full absolute top-0 left-0" style={{ width: `${progress}%`, backgroundColor: '#10B981' }} />
                </button>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg hover:bg-white/20" aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}>
                        {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-lg hover:bg-white/20" aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}>
                        {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                      </button>
                      <div className="text-white/70 text-sm">
                        {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / {video.duration}
                      </div>
                    </div>
                  
                  <div className="relative">
                    <button onClick={() => setShowSpeed(!showSpeed)} className="p-2 rounded-lg text-white/70 text-xs font-bold">
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
                              playbackSpeed === speed ? 'bg-[var(--brand-green)] text-white' : 'text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* معلومات الفيديو */}
        <div className="p-6 bg-white dark:bg-gray-900">
          <h3 className="text-2xl font-bold text-[var(--foreground)]">{video.title}</h3>
          <p className="text-[var(--muted-foreground)] mt-2">{video.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{video.views?.toLocaleString()} مشاهدة</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{video.likes?.toLocaleString()} إعجاب</span>
            {video.category && <span className="bg-[var(--secondary)] px-3 py-1 rounded-full text-xs">{video.category}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProfessionalVideoPlayer.displayName = 'ProfessionalVideoPlayer';

// زر شاهد قصتنا
const StoryWatchButton = memo(({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group inline-flex items-center gap-3 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[var(--brand-green)]/30 hover:shadow-xl transition-all"
  >
    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
      <Play className="w-6 h-6 text-white" fill="currentColor" />
    </div>
    <span className="text-lg">شاهد قصتنا</span>
    <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </motion.button>
));

StoryWatchButton.displayName = 'StoryWatchButton';

// بطاقة الفيديو
const AdvancedVideoCard = memo(({ 
  video, 
  isActive, 
  onClick,
  index
}: { 
  video: VideoItem; 
  isActive: boolean; 
  onClick: () => void;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
        isActive ? 'border-[var(--brand-green)] shadow-xl shadow-[var(--brand-green)]/20' : 'border-transparent hover:border-[var(--brand-green)]/40'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-[var(--secondary)]">
        <img 
          src={imageError ? '/favicon.svg' : video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={() => setImageError(true)}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${
          isHovered || isActive ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--brand-green)] transition-all">
              <Play className="w-7 h-7 text-white" fill="currentColor" />
            </div>
          </div>
        </div>

        {video.duration && (
          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md">
            {video.duration}
          </span>
        )}

        {video.isFeatured && (
          <span className="absolute top-2 right-2 bg-[var(--brand-green)] text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" /> مميز
          </span>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800">
        <h4 className="font-bold text-sm text-[var(--foreground)] line-clamp-1">{video.title}</h4>
        <p className="text-[var(--muted-foreground)] text-xs line-clamp-2 mt-1">{video.description}</p>
        
        <div className="flex items-center justify-between mt-2 text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views?.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{video.likes?.toLocaleString()}</span>
          </div>
          {video.publishDate && <span className="bg-[var(--secondary)] px-2 py-0.5 rounded-full text-[10px]">{new Date(video.publishDate).toLocaleDateString('ar-YE')}</span>}
        </div>
      </div>
    </motion.div>
  );
});

AdvancedVideoCard.displayName = 'AdvancedVideoCard';

// المكون الرئيسي
export const VideoShowcase = memo(({ 
  videos: initialVideos,
  setCurrentPage: _setCurrentPage = () => {}, 
  limit = 8,
  showFeatured: _showFeatured = true,
  theme: _theme = 'charity',
  showStoryButton = true,
}: VideoShowcaseProps) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState<string>('https://www.youtube.com/@RahmaaBenahum');

  // جلب البيانات من Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب الفيديوهات
        const fetchedVideos = initialVideos || await sanityClient.fetch<VideoItem[]>(VIDEOS_QUERY);
        const videoArray: VideoItem[] = fetchedVideos || [];
        setVideos(videoArray);
        setFilteredVideos(videoArray);
        
        // جلب الإعدادات
        const settings = await sanityClient.fetch(SETTINGS_QUERY);
        if (settings?.youtubeChannelUrl) {
          setYoutubeChannelUrl(settings.youtubeChannelUrl);
        }
        
        // اختيار فيديو القصة
        const storyVideo = videoArray.find(v => v.isStoryVideo && v.isFeatured);
        if (storyVideo) setActiveVideo(storyVideo);
      } catch (error) {
        console.error('Error fetching data:', error);
        // لا تستخدم بيانات ثابتة - أظهر رسالة خطأ بدلاً من ذلك
        setVideos([]);
        setFilteredVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialVideos, limit]);

  const handleVideoSelect = useCallback((video: VideoItem) => {
    setActiveVideo(video);
    setShowPlayer(true);
  }, []);

  const handleYoutubeClick = useCallback(() => {
    window.open(youtubeChannelUrl, '_blank');
  }, [youtubeChannelUrl]);

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-8 min-h-[400px]">
            <Loader2 className="w-16 h-16 animate-spin text-[var(--brand-green)]" />
            <p className="text-[var(--muted-foreground)]">جاري تحميل المكتبة المرئية...</p>
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900" dir="rtl">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--muted-foreground)]">لا توجد فيديوهات متاحة حالياً</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[var(--secondary)] dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-green)]/10 px-5 py-2 rounded-full mb-4">
            <Video className="w-4 h-4 text-[var(--brand-green)]" />
            <span className="text-[var(--brand-green)] text-sm font-medium">المكتبة المرئية المتكاملة</span>
            <span className="text-[var(--brand-green)] text-sm">{videos.length} فيديو</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-[var(--foreground)]">
            استعرض <span className="bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)] bg-clip-text text-transparent">أثرنا</span> بالفيديو
          </h2>
          
          {showStoryButton && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex justify-center">
              <StoryWatchButton onClick={() => {
                const storyVideo = videos.find(v => v.isStoryVideo && v.isFeatured);
                if (storyVideo) {
                  setActiveVideo(storyVideo);
                  setShowPlayer(true);
                }
              }} />
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {showPlayer && activeVideo && (
            <ProfessionalVideoPlayer
              video={activeVideo}
              onClose={() => setShowPlayer(false)}
              onYoutubeClick={handleYoutubeClick}
            />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredVideos.map((video, index) => (
            <AdvancedVideoCard
              key={video._id || video._id}
              video={video}
              isActive={activeVideo?._id === video._id}
              onClick={() => handleVideoSelect(video)}
              index={index}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8 max-w-5xl mx-auto">
          <button
            onClick={handleYoutubeClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            <Youtube className="w-4 h-4" />
            قناة اليوتيوب
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
});

VideoShowcase.displayName = 'VideoShowcase';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default VideoShowcase;

