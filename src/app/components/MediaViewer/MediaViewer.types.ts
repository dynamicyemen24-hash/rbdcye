/**
 * MediaViewer Types - أنواع البيانات الموحدة للمستعرض
 * Professional Media Viewer Data Models
 */

// أنواع الوسائط المدعومة
export type MediaItemType = 'image' | 'video' | 'document';
export type ImageFitMode = 'contain' | 'cover' | 'original' | 'width' | 'height';
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;
export type SidebarViewMode = 'expanded' | 'collapsed' | 'hidden';
export type ViewerSize = 'compact' | 'normal' | 'large' | 'fullscreen';

// واجهة الوسائط الأساسية
export interface MediaItem {
  _id: string;
  _type: 'media' | 'video';
  title: string;
  description?: string;
  type: MediaItemType;
  
  // للصور
  imageFile?: {
    asset: {
      _id: string;
      _ref: string;
      url?: string;
    };
    alt?: string;
  };
  
  // للفيديو
  videoFile?: {
    asset: {
      _id: string;
      _ref: string;
      url?: string;
    };
  };
  videoUrl?: string;
  thumbnail?: {
    asset: {
      _id: string;
      _ref: string;
      url?: string;
    };
  };
  duration?: string;
  
  // مشترك
  url?: string;
  altText?: string;
  category?: string;
  tags?: string[];
  albums?: string[];
  isFeatured?: boolean;
  isCover?: boolean;
  order?: number;
  status?: 'published' | 'draft' | 'archived';
  publishDate?: string;
  _createdAt?: string;
  _updatedAt?: string;
  
  // إحصائيات
  views?: number;
  likes?: number;
}

// خيارات المستعرض
export interface MediaViewerOptions {
  // الإعدادات العامة
  autoPlay?: boolean;
  loop?: boolean;
  showSidebar?: boolean;
  sidebarPosition?: 'left' | 'right';
  sidebarViewMode?: SidebarViewMode;
  
  // الإعدادات البصرية
  theme?: 'light' | 'dark' | 'charity';
  enableAnimations?: boolean;
  showThumbnails?: boolean;
  
  // الإعدادات التنقل
  enableKeyboardNav?: boolean;
  enableMouseWheel?: boolean;
  enableSwipe?: boolean;
  enableAutoLoop?: boolean;
  
  // الإعدادات الأداء
  lazyLoad?: boolean;
  preloadCount?: number;
  
  // أبعاد الإطار
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  initialSize?: ViewerSize;
}

// خيارات المشغل
export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  currentTime: number;
  playbackSpeed: PlaybackSpeed;
  isFullscreen: boolean;
  volume: number;
  isLoaded: boolean;
  isError: boolean;
}

// خيارات عارض الصور
export interface ImageViewerState {
  zoom: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  fitMode: ImageFitMode;
}

// أدوات التحكم
export interface ViewerControls {
  showControls: boolean;
  showInfo: boolean;
  showSidebar: boolean;
}

// أحداث التنقل
export interface NavigationState {
  currentIndex: number;
  totalItems: number;
  canPrevious: boolean;
  canNext: boolean;
}

