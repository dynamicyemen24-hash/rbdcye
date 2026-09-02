/**
 * MediaViewer Service - خدمة إدارة الوسائط
 * Professional Media Viewer Business Logic
 */

import { sanityClient } from "@/sanity/client";

import { MediaItem, MediaItemType } from "./MediaViewer.types";

// استعلام GROQ للوسائط
const MEDIA_QUERY = `*[_type == "media" && status == "published"] | order(order asc, _createdAt desc) {
  _id,
  title,
  description,
  type,
  "url": file.asset->url,
  "imageUrl": imageFile.asset->url,
  altText,
  category,
  tags,
  albums,
  isFeatured,
  isCover,
  order,
  status,
  publishDate,
  _createdAt,
  _updatedAt,
  size,
  "file": file
}`;

const VIDEO_QUERY = `*[_type == "video" && status == "published"] | order(order asc, _createdAt desc) {
  _id,
  title,
  description,
  "type": "video",
  "videoUrl": coalesce(videoUrl, videoFile.asset->url, ''),
  "thumbnailUrl": thumbnail.asset->url,
  duration,
  category,
  tags,
  isFeatured,
  isStoryVideo,
  order,
  status,
  publishDate,
  _createdAt,
  _updatedAt,
  views,
  likes
}`;

// فئة الخدمة
export class MediaViewerService {
  private cache: Map<string, MediaItem[]>;
  private cacheTimestamps: Map<string, number>;
  private cacheTimeout: number;

  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 دقائق
  }

  /**
   * جلب جميع الوسائط من Sanity
   */
  async fetchAllMedia(): Promise<MediaItem[]> {
    const cacheKey = "all-media";
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cacheKey)) {
      return cached;
    }

    try {
      const [mediaItems, videoItems] = await Promise.all([
        sanityClient.fetch(MEDIA_QUERY),
        sanityClient.fetch(VIDEO_QUERY),
      ]);

      // تحويل البيانات إلى التنسيق الموحد
      const normalizedMedia = this.normalizeMediaData(mediaItems, videoItems);

      this.cache.set(cacheKey, normalizedMedia);
      this.cacheTimestamps.set(cacheKey, Date.now());
      return normalizedMedia;
    } catch {
      return this.getFallbackMedia();
    }
  }

  /**
   * تطبيع بيانات الوسائط
   */
  private normalizeMediaData(mediaItems: any[], videoItems: any[]): MediaItem[] {
    const media: MediaItem[] = [];

    // معالجة الصور والمستندات
    mediaItems.forEach((item) => {
      if (item.type === "image" || item.type === "document") {
        media.push({
          _id: item._id,
          _type: "media",
          title: item.title,
          description: item.description,
          type: item.type as MediaItemType,
          url: item.imageUrl || item.url,
          altText: item.altText,
          category: item.category,
          tags: item.tags,
          albums: item.albums,
          isFeatured: item.isFeatured,
          isCover: item.isCover,
          order: item.order,
          status: item.status,
          publishDate: item.publishDate,
          _createdAt: item._createdAt,
          _updatedAt: item._updatedAt,
          views: 0,
          likes: 0,
        });
      }
    });

    // معالجة الفيديوهات
    videoItems.forEach((item) => {
      media.push({
        _id: item._id,
        _type: "video",
        title: item.title,
        description: item.description,
        type: "video",
        videoUrl: item.videoUrl,
        thumbnail: item.thumbnailUrl
          ? {
              asset: { _id: "", _ref: "", url: item.thumbnailUrl },
            }
          : undefined,
        duration: item.duration,
        category: item.category,
        tags: item.tags,
        isFeatured: item.isFeatured,
        order: item.order,
        status: item.status,
        publishDate: item.publishDate,
        _createdAt: item._createdAt,
        _updatedAt: item._updatedAt,
        views: item.views,
        likes: item.likes,
      });
    });

    // فرز حسب الترتيب والتاريخ
    return media.sort((a, b) => {
      if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
      return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime();
    });
  }

  /**
   * فلترة الوسائط
   */
  filterMedia(
    media: MediaItem[],
    options: {
      type?: MediaItemType;
      category?: string;
      searchTerm?: string;
      album?: string;
      featuredOnly?: boolean;
    }
  ): MediaItem[] {
    return media.filter((item) => {
      if (options.type && item.type !== options.type) return false;
      if (options.category && item.category !== options.category) return false;
      if (options.album && (!item.albums || !item.albums.includes(options.album))) return false;
      if (options.featuredOnly && !item.isFeatured) return false;
      if (options.searchTerm) {
        const searchLower = options.searchTerm.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(searchLower);
        const matchesDescription = item.description?.toLowerCase().includes(searchLower);
        const matchesTags = item.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }
      return true;
    });
  }

  /**
   * البحث الفوري
   */
  searchMedia(media: MediaItem[], searchTerm: string): MediaItem[] {
    if (!searchTerm.trim()) return media;
    return this.filterMedia(media, { searchTerm });
  }

  /**
   * الحصول على الصورة الغلاف
   */
  getCoverImage(media: MediaItem[]): MediaItem | undefined {
    return (
      media.find((item) => item.type === "image" && item.isCover) ||
      media.find((item) => item.type === "image")
    );
  }

  /**
   * بناء رابط الصورة من Sanity
   */
  buildImageUrl(ref: string, width = 600, height = 400): string {
    return `https://cdn.sanity.io/images/${process.env.VITE_SANITY_PROJECT_ID || "xd0ohyiz"}/${process.env.VITE_SANITY_DATASET || "production"}/${ref}?w=${width}&h=${height}&auto=format`;
  }

  /**
   * البيانات الاحتياطية
   */
  private getFallbackMedia(): MediaItem[] {
    return [
      {
        _id: "fallback-1",
        _type: "media",
        title: "مؤسسة رحماء بينهم - صورة تعريفية",
        type: "image",
        url: "/favicon.svg",
        altText: "مؤسسة رحماء بينهم",
        category: "organization",
        isFeatured: true,
        order: 0,
        status: "published",
      },
      {
        _id: "fallback-2",
        _type: "video",
        title: "فيديو تعريفي للمؤسسة",
        type: "video",
        videoUrl: "/videos/hero-background.mp4",
        duration: "4:30",
        category: "تعريفي",
        isFeatured: true,
        order: 1,
        status: "published",
        views: 15200,
        likes: 1243,
      },
    ];
  }

  /**
   * التحقق من صلاحية الكاش
   */
  private isCacheValid(key: string): boolean {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.cacheTimeout;
  }

  /**
   * مسح الكاش
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
}

// المثال الواحد
export const mediaViewerService = new MediaViewerService();
