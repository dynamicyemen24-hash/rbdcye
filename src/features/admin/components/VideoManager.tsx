// VideoManager - نظام إدارة الفيديو المتكامل من لوحة التحكم
import { motion } from 'motion/react';
import {
  Video, Play, Pause, Volume2, VolumeX, RefreshCw,
  CheckCircle, AlertCircle, ExternalLink, Settings,
  Image, FileVideo, Globe, Youtube, Upload,
  Eye, Heart, Edit3, Trash2, ChevronDown, ChevronUp,
  Loader2
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { sanityClient } from '@/sanity/client';

interface VideoItem {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  category?: string;
  duration?: string;
  isFeatured?: boolean;
  isStoryVideo?: boolean;
  status?: string;
  views?: number;
  likes?: number;
  tags?: string[];
}

interface VideoStats {
  total: number;
  featured: number;
  story: number;
  published: number;
  drafts: number;
}

export const VideoManager = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [stats, setStats] = useState<VideoStats>({ total: 0, featured: 0, story: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sanityClient.fetch(`
        *[_type == "video"] | order(_createdAt desc) {
          _id,
          title,
          description,
          videoUrl,
          category,
          duration,
          isFeatured,
          isStoryVideo,
          status,
          views,
          likes,
          tags
        }
      `);
      setVideos(data || []);
      
      const v = data || [];
      setStats({
        total: v.length,
        featured: v.filter((x: VideoItem) => x.isFeatured).length,
        story: v.filter((x: VideoItem) => x.isStoryVideo).length,
        published: v.filter((x: VideoItem) => x.status === 'published').length,
        drafts: v.filter((x: VideoItem) => x.status === 'draft' || !x.status).length,
      });
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('فشل تحميل بيانات الفيديو من Sanity');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const toggleFeatured = async (video: VideoItem) => {
    try {
      await sanityClient.patch(video._id).set({ isFeatured: !video.isFeatured }).commit();
      fetchVideos();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const toggleStatus = async (video: VideoItem) => {
    const newStatus = video.status === 'published' ? 'draft' : 'published';
    try {
      await sanityClient.patch(video._id).set({ status: newStatus }).commit();
      fetchVideos();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const statCards = [
    { label: 'إجمالي الفيديوهات', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-100', icon: Video },
    { label: 'منشور', value: stats.published, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
    { label: 'مميز', value: stats.featured, color: 'text-amber-600', bg: 'bg-amber-100', icon: Eye },
    { label: 'قصة رحماء بينهم', value: stats.story, color: 'text-purple-600', icon: Heart },
  ];

  const openSanityStudio = () => {
    window.open('https://xd0ohyiz.sanity.studio/desk/video', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">مدير الفيديو المتكامل</h2>
            <p className="text-sm text-gray-500">إدارة كاملة لجميع فيديوهات الموقع</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchVideos}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <button
            onClick={openSanityStudio}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Sanity Studio
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${card.bg} rounded-xl p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
            </div>
            <p className={`text-xs ${card.color} opacity-80`}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-gray-500 text-sm">جاري تحميل بيانات الفيديو...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchVideos}
            className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <Video className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">لا توجد فيديوهات بعد</h3>
          <p className="text-gray-500 text-sm text-center max-w-md">
            لم يتم إضافة أي فيديو إلى Sanity بعد. يمكنك إضافة فيديوهات جديدة من Sanity Studio.
          </p>
          <button
            onClick={openSanityStudio}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 inline ml-1" />
            إضافة فيديو في Sanity
          </button>
        </div>
      )}

      {/* Video List */}
      {!loading && !error && videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors"
            >
              {/* Video Card Header */}
              <div
                role="button"
                tabIndex={0}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === video._id ? null : video._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedId(expandedId === video._id ? null : video._id);
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm truncate">{video.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        video.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {video.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                      {video.category && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {video.category}
                        </span>
                      )}
                      {video.duration && (
                        <span className="text-[10px] text-gray-400">{video.duration}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Badges */}
                  {video.isFeatured && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold hidden sm:block">
                      ⭐ مميز
                    </span>
                  )}
                  {video.isStoryVideo && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold hidden sm:block">
                      📖 قصة
                    </span>
                  )}
                  {/* Views */}
                  <div className="flex items-center gap-1 text-gray-400 text-xs ml-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{video.views?.toLocaleString() || 0}</span>
                  </div>
                  {/* Expand */}
                  {expandedId === video._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === video._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-gray-100 p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left - Info */}
                    <div className="space-y-3">
                      {video.description && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">الوصف</p>
                          <p className="text-sm text-gray-700">{video.description}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {video.tags?.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-white text-gray-600 rounded-lg text-[10px] border border-gray-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {video.views?.toLocaleString() || 0} مشاهدة</span>
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {video.likes?.toLocaleString() || 0} إعجاب</span>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-wrap items-start gap-2 justify-end">
                      <button
                        onClick={() => toggleFeatured(video)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                          video.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                        }`}
                      >
                        {video.isFeatured ? '⭐ إلغاء التميز' : '⭐ تعيين مميز'}
                      </button>
                      <button
                        onClick={() => toggleStatus(video)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                          video.status === 'published'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {video.status === 'published' ? '📥 إلغاء النشر' : '📤 نشر'}
                      </button>
                      <a
                        href={`https://xd0ohyiz.sanity.studio/desk/video;${video._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        تعديل في Sanity
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default VideoManager;