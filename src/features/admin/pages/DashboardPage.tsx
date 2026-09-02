// Admin Dashboard Page - Real-time Statistics
// Professional Dashboard with Live Data

import { motion } from 'motion/react';
import { Heart, MessageSquare, TrendingUp, Users, Video, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

import AdminStats from '@/features/admin/components/AdminStats';
import { VideoManager } from '@/features/admin/components/VideoManager';
import { useAuth } from '@/features/auth';
import { sanityClient } from '@/sanity/client';

interface HeroVideoInfo {
  hasVideo: boolean;
  hasPoster: boolean;
  muted: boolean;
  loop: boolean;
  source: 'sanity_file' | 'external_url' | 'local_fallback';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [heroInfo, setHeroInfo] = useState<HeroVideoInfo>({
    hasVideo: false,
    hasPoster: false,
    muted: true,
    loop: true,
    source: 'local_fallback',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero video settings from Sanity
        try {
          const settings: any = await sanityClient.fetch(`
            *[_type == "siteSettings"][0] {
              "heroVideo": heroVideo.asset->url,
              "heroVideoUrl": heroVideoUrl,
              "heroPoster": heroPoster.asset->url,
              heroVideoMuted,
              heroVideoLoop
            }
          `);
          if (settings) {
            const source: HeroVideoInfo['source'] = 
              settings.heroVideo ? 'sanity_file' :
              settings.heroVideoUrl ? 'external_url' : 'local_fallback';
            setHeroInfo({
              hasVideo: !!(settings.heroVideo || settings.heroVideoUrl),
              hasPoster: !!settings.heroPoster,
              muted: settings.heroVideoMuted !== false,
              loop: settings.heroVideoLoop !== false,
              source,
            });
          }
        } catch {
          // Sanity unavailable, keep defaults
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">مرحباً، {user?.email?.split('@')[0] || 'المشرف'}</h1>
        <p className="text-gray-600">إليك إحصائيات الموقع اليوم</p>
      </div>

      {/* AdminStats - بطاقات الإحصائيات المتكاملة مع قاعدة البيانات */}
      <AdminStats />

      {/* مدير الفيديو المتكامل - VideoManager */}
      <VideoManager />

      {/* Hero Video Status Card - بطاقة حالة فيديو الهيرو */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">فيديو الهيرو (الخلفية)</h3>
              <p className="text-lg font-bold text-gray-800">
                {heroInfo.hasVideo ? '🟢 نشط' : '🟡 الفيديو الافتراضي'}
              </p>
            </div>
          </div>
          <a
            href="https://xd0ohyiz.sanity.studio/desk/siteSettings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            إدارة في Sanity
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${heroInfo.hasVideo ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-gray-600">
              {heroInfo.source === 'sanity_file' ? 'ملف مرفوع في Sanity' :
               heroInfo.source === 'external_url' ? 'رابط خارجي' : 'ملف محلي (افتراضي)'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${heroInfo.hasPoster ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-gray-600">
              {heroInfo.hasPoster ? 'صورة خلفية (Poster) متوفرة' : 'صورة خلفية افتراضية'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            {heroInfo.muted ? (
              <VolumeX className="w-3 h-3 text-gray-500" />
            ) : (
              <Volume2 className="w-3 h-3 text-gray-500" />
            )}
            <span className="text-xs text-gray-600">
              {heroInfo.muted ? 'صوت مكتوم' : 'صوت نشط'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600">
              تكرار: {heroInfo.loop ? 'نعم' : 'لا'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">النشاط الأخير</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">تم استلام رسالة جديدة</p>
              <p className="text-sm text-gray-600">من محمد أحمد - قبل 5 دقائق</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">تم استلام تبرع</p>
              <p className="text-sm text-gray-600">مبلغ 100$ - قبل 15 دقيقة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

