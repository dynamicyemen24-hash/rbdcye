// Media Page - معرض الوسائط (محسّن بدمج SEED_MEDIA)
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Play, Grid3X3, List, Search, Camera, Video, FileImage, Eye,
  X, Calendar, MapPin,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { SEED_MEDIA } from "@/content/website";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentBridge } from "@/shared/services/content-bridge.service";
import { useSEO } from "@/utils/seoAdvanced";

interface MediaItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  date: string;
  size: string;
}

const MEDIA_TYPES = ["الكل", "image", "video"];
const TYPE_LABELS = { image: "صور", video: "فيديو" };

function normalizeMedia(): MediaItem[] {
  return SEED_MEDIA.map((m) => ({
    id: m.id,
    title: m.title,
    type: m.type as "image" | "video",
    url: m.url,
    date: m.date,
    size: m.size,
  }));
}

export default function MediaPage() {
  const [activeType, setActiveType] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(normalizeMedia());

  useSEO({
    title: 'معرض الوسائط - رحماء بينهم',
    description: 'معرض صور وفيديوهات من مشاريعنا الإنسانية والتنموية',
  });

  useEffect(() => {
    let cancelled = false;
    contentBridge.getContent<any>('impact')
      .then(() => {
        if (!cancelled) {
          try { analyticsService.generateImpactReport(); } catch { /* non-critical */ }
          setMediaItems(normalizeMedia());
        }
      })
      .catch(() => {
        if (!cancelled) setMediaItems(normalizeMedia());
      });
    return () => { cancelled = true; };
  }, []);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesType = activeType === "الكل" || item.type === activeType;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [mediaItems, activeType, searchQuery]);

  return (
    <div className="min-h-screen pt-20" dir="rtl">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-b from-[var(--brand-green)]/10 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full mb-6 shadow-lg border border-[var(--brand-green)]/20">
              <Camera className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">معرض الوسائط</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[var(--foreground)]">لحظات </span>
              <span className="text-[var(--brand-green)]">من عملنا</span>
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
              استكشف صور وفيديوهات من مشاريعنا الإنسانية والتنموية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {MEDIA_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeType === type
                      ? "bg-[var(--brand-green)] text-white shadow-lg"
                      : "bg-gray-100 text-[var(--muted-foreground)] hover:bg-gray-200"
                  }`}
                >
                  {type === "الكل" ? "الكل" : TYPE_LABELS[type as keyof typeof TYPE_LABELS]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث..."
                  className="w-48 pr-10 pl-4 py-2 border border-[var(--border)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
                />
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full text-sm transition-all ${
                    viewMode === "grid" ? "bg-[var(--brand-green)] text-white" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full text-sm transition-all ${
                    viewMode === "list" ? "bg-[var(--brand-green)] text-white" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className={`grid gap-6 max-w-7xl mx-auto ${
            viewMode === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-1 lg:grid-cols-2"
          }`}>
            {filteredMedia.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer ${
                  viewMode === "list" ? "flex items-center gap-4 p-4" : ""
                }`}
                onClick={() => setSelectedMedia(item)}
              >
                <div className={`relative overflow-hidden ${
                  viewMode === "list" ? "w-48 h-32 flex-shrink-0" : "h-48"
                }`}>
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    {item.type === "image" ? (
                      <Image className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Video className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      {TYPE_LABELS[item.type]}
                    </span>
                  </div>
                </div>

                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className="font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--brand-green)] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{item.size}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا توجد وسائط مطابقة</h3>
              <p className="text-[var(--muted-foreground)]">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </section>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-full object-contain rounded-2xl"
                >
                  <track kind="captions" srcLang="ar" label="العربية" />
                </video>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              )}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {selectedMedia.date} • {selectedMedia.size}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
