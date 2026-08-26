/**
 * MediaSidebar - القائمة الجانبية الذكية للوسائط
 * Smart Media Sidebar with Virtual Scrolling
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, memo, useMemo } from 'react';

import { MediaItem, MediaItemType, SidebarViewMode } from './MediaViewer.types';

interface MediaSidebarProps {
  media: MediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  viewMode: SidebarViewMode;
  onViewModeChange: (mode: SidebarViewMode) => void;
  onSearch?: (term: string) => void;
  onFilterChange?: (type: MediaItemType | 'all', category?: string) => void;
}

// مكون عنصر الوسائط في القائمة
const MediaSidebarItem = memo(({
  item,
  index,
  isActive,
  onSelect,
}: {
  item: MediaItem;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}) => {
  const [imageError, setImageError] = useState(false);

  const getTypeIcon = () => {
    switch (item.type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      default:
        return '📎';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => onSelect(index)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-emerald-600/20 border border-emerald-500' 
          : 'hover:bg-white/5 border border-transparent'
      }`}
      aria-label={`عرض ${item.title}`}
    >
      {/* الصورة المصغرة أو أيقونة الفيديو */}
      <div className="relative flex-shrink-0">
        {item.type === 'image' ? (
          <img
            src={imageError ? '/favicon.svg' : item.url}
            alt={item.altText || item.title}
            className="w-12 h-12 rounded-md object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center">
            {item.thumbnail?.asset?.url ? (
              <img
                src={item.thumbnail.asset.url}
                alt={item.title}
                className="w-full h-full rounded-md object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-2xl">{getTypeIcon()}</span>
            )}
          </div>
        )}
        
        {/* مؤشر النوع */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-xs">
          {getTypeIcon()}
        </div>
      </div>

      {/* التفاصيل */}
      <div className="flex-1 text-right overflow-hidden">
        <h4 className={`font-medium text-sm truncate ${
          isActive ? 'text-white' : 'text-gray-300'
        }`}>
          {item.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          {item.type === 'video' && item.duration && (
            <span className="text-emerald-400">{item.duration}</span>
          )}
          <span>{formatDate(item._createdAt)}</span>
        </div>
        {item.category && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px]">
            {item.category}
          </span>
        )}
      </div>
    </motion.button>
  );
});

MediaSidebarItem.displayName = 'MediaSidebarItem';

// مكون القائمة الجانبية
export const MediaSidebar = memo(({
  media,
  activeIndex,
  onSelect,
  isOpen,
  onToggle,
  viewMode,
  onViewModeChange,
  onSearch,
  onFilterChange,
}: MediaSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<MediaItemType | 'all'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // معالجة البحث
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  // معالجة التصفية
  useEffect(() => {
    onFilterChange?.(selectedType);
  }, [selectedType, onFilterChange]);

  // إحصاءات الوسائط
  const stats = useMemo(() => {
    const images = media.filter(m => m.type === 'image').length;
    const videos = media.filter(m => m.type === 'video').length;
    return { images, videos, total: media.length };
  }, [media]);

  // فتح/إغلاق القائمة
  const toggleSidebar = () => {
    if (viewMode === 'expanded') {
      onViewModeChange('collapsed');
    } else if (viewMode === 'collapsed') {
      onViewModeChange('expanded');
    } else {
      onViewModeChange('expanded');
    }
  };

  return (
    <>
      {/* زر التحكم بالإطار */}
      <button
        onClick={toggleSidebar}
        className="fixed top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 text-white p-2 rounded-l-lg transition-all"
        style={{
          right: viewMode === 'expanded' ? 'calc(280px + 1rem)' : '1rem',
        }}
        aria-label={viewMode === 'expanded' ? 'طي القائمة' : 'توسيع القائمة'}
      >
        {viewMode === 'expanded' ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* القائمة الجانبية */}
      <AnimatePresence>
        {viewMode !== 'hidden' && (
          <motion.div
            ref={sidebarRef}
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: viewMode === 'expanded' ? 280 : 60, 
              opacity: 1 
            }}
            exit={{ width: 0, opacity: 0 }}
            className="fixed top-0 bottom-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-l border-white/10 overflow-hidden"
            style={{
              marginTop: '64px', // لتجنب تداخل مع Navbar
            }}
          >
            <div className="flex flex-col h-full">
              {/* رأس القائمة */}
              {viewMode === 'expanded' && (
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">الوسائط</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{stats.images} 🖼️</span>
                      <span>{stats.videos} 🎥</span>
                    </div>
                  </div>

                  {/* شريط البحث */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
<input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="بحث في الوسائط..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pr-10 pl-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>

                  {/* زر التصفية */}
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center justify-center gap-2 mt-3 py-2 bg-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/20 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>تصفية حسب النوع</span>
                  </button>

                  {/* قائمة التصفية */}
                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 flex gap-2"
                      >
                        {(['all', 'image', 'video'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`flex-1 py-1 rounded text-xs transition-colors ${
                              selectedType === type
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                          >
                            {type === 'all' ? 'الكل' : type === 'image' ? '🖼️ صور' : '🎥 فيديو'}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* قائمة الوسائط */}
              <div className="flex-1 overflow-y-auto p-2">
                {viewMode === 'expanded' ? (
                  // وضع موسع: إظهار تفاصيل كاملة
                  media.map((item, index) => (
                    <MediaSidebarItem
                      key={item._id}
                      item={item}
                      index={index}
                      isActive={activeIndex === index}
                      onSelect={onSelect}
                    />
                  ))
                ) : (
                  // وضع مطوي: إظهار أيقونات فقط
                  <div className="space-y-2">
                    {media.map((item, index) => (
                      <button
                        key={item._id}
                        onClick={() => onSelect(index)}
                        className={`w-full p-2 rounded-lg transition-all ${
                          activeIndex === index
                            ? 'bg-emerald-600/20 border border-emerald-500'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                        title={item.title}
                      >
                        <div className="w-12 h-12 mx-auto rounded-md overflow-hidden">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xl">
                              🎥
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

MediaSidebar.displayName = 'MediaSidebar';

export default MediaSidebar;