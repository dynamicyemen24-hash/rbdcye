// Success Stories Page - قصص النجاح (محسّنة بدمج SEED_SUCCESS_STORIES)
import { motion } from "framer-motion";
import {
  Star, Heart, Quote, Users, BookOpen, Droplets,
  ArrowLeft, Sparkles, Award, Calendar, MapPin,
  Play, ExternalLink, Filter,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { SEED_SUCCESS_STORIES } from "@/content/website";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentBridge } from "@/shared/services/content-bridge.service";
import { useSEO } from "@/utils/seoAdvanced";

interface Story {
  id: string;
  title: string;
  excerpt: string;
  fullStory: string;
  quote: string;
  name: string;
  role: string;
  program: string;
  category: string;
  year: string;
  location: string;
  rating: number;
  image: string;
  status: string;
}

const CATEGORIES = ["الكل", "تعليم", "تنمية مجتمعية", "تعليم", "تنمية"];

function normalizeStories(): Story[] {
  return SEED_SUCCESS_STORIES.map((s) => ({
    id: s.id,
    title: s.title,
    excerpt: s.excerpt,
    fullStory: s.excerpt,
    quote: s.quote,
    name: s.name,
    role: s.role,
    program: s.program,
    category: s.category,
    year: s.year,
    location: s.location,
    rating: s.rating,
    image: s.image,
    status: s.status,
  }));
}

export default function SuccessStoriesPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>(normalizeStories());

  useSEO({
    title: 'قصص النجاح - رحماء بينهم',
    description: 'قصص نجاح ملهمة للمستفيدين الذين غيرت حياتهم برامج المؤسسة',
  });

  useEffect(() => {
    let cancelled = false;
    contentBridge.getContent<any>('impact')
      .then(() => {
        if (!cancelled) {
          try { analyticsService.generateImpactReport(); } catch { /* non-critical */ }
          setStories(normalizeStories());
        }
      })
      .catch(() => {
        if (!cancelled) setStories(normalizeStories());
      });
    return () => { cancelled = true; };
  }, []);

  const filteredStories = useMemo(() => {
    if (activeCategory === "الكل") return stories;
    return stories.filter(s => s.category === activeCategory);
  }, [stories, activeCategory]);

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
              <Award className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">قصص نجاح حقيقية</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[var(--foreground)]">قصص </span>
              <span className="text-[var(--brand-green)]">النجاح</span>
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
              اقرأ قصص المستفيدين الذين غيرتهم برامجنا إلى الأفضل
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--brand-green)] text-white shadow-lg"
                    : "bg-gray-100 text-[var(--muted-foreground)] hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    {[...Array(story.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[var(--foreground)]">
                      {story.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-[var(--foreground)] leading-tight">
                      {story.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>

                  {/* Quote */}
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border-r-2 border-amber-400">
                    <Quote className="w-4 h-4 text-amber-400 mb-1" />
                    <p className="text-xs text-amber-800 italic leading-relaxed line-clamp-2">
                      {story.quote}
                    </p>
                  </div>

                  {/* Person Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--brand-green)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--foreground)]">{story.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{story.role}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {story.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {story.year}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors"
                    >
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا توجد قصص مطابقة</h3>
              <p className="text-[var(--muted-foreground)]">جرب تغيير الفئة</p>
            </div>
          )}
        </div>
      </section>

      {/* Story Modal */}
      {selectedStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedStory(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-64 object-cover rounded-t-3xl"
              />
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[var(--brand-green)]/10 text-[var(--brand-green)] rounded-full text-xs font-medium">
                  {selectedStory.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(selectedStory.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
                {selectedStory.title}
              </h2>

              <div className="mb-6 p-4 bg-amber-50 rounded-xl border-r-4 border-amber-400">
                <Quote className="w-6 h-6 text-amber-400 mb-2" />
                <p className="text-lg text-amber-800 italic leading-relaxed">
                  {selectedStory.quote}
                </p>
              </div>

              <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
                {selectedStory.fullStory}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[var(--brand-green)]" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--foreground)]">{selectedStory.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{selectedStory.role}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {selectedStory.program} • {selectedStory.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">هل تريد أن تكون جزءاً من قصة نجاح؟</h2>
            <p className="text-white/80 text-lg mb-8">
              ساهم في تغيير حياة أحد المحتاجين اليوم
            </p>
            <button
              onClick={() => navigate('/donate')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              <Heart className="w-5 h-5" fill="white" />
              ساهم الآن
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
