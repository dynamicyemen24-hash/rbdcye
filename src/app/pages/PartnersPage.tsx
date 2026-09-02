// Partners Page - صفحة الشركاء
import { motion } from "motion/react";
import {
  Handshake, Users, Target,
  Heart, BarChart3, TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import { SEED_PARTNERS, SEED_IMPACT } from "@/content/website";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentManager } from "@/shared/services/content-manager";
import { useSEO } from "@/utils/seoAdvanced";

interface Partner {
  id: string;
  name: string;
  logo: string;
  type: string;
  status: string;
  url: string;
  description?: string;
}

const PARTNER_TYPES = ["الكل", "شريك إستراتيجي", "جهة ممولة", "شريك تنفيذي", "شريك داعم"];

function normalizePartners(): Partner[] {
  return SEED_PARTNERS.map((p: any) => ({
    id: p.id,
    name: p.name,
    logo: p.logo,
    type: p.type,
    status: p.status,
    url: p.url,
    description: p.description,
  }));
}

export default function PartnersPage() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("الكل");
  const [partners, setPartners] = useState<Partner[]>(normalizePartners());

  useSEO({
    title: 'شركاؤنا - رحماء بينهم',
    description: 'شركاؤنا الاستراتيجيون والجهات الداعمة لـ رحماء بينهم',
  });

  useEffect(() => {
    let cancelled = false;
    contentManager.getImpact()
      .then(() => {
        if (!cancelled) {
          try { analyticsService.generateDonorReport(); } catch { /* non-critical */ }
          setPartners(normalizePartners());
        }
      })
      .catch(() => {
        if (!cancelled) setPartners(normalizePartners());
      });
    return () => { cancelled = true; };
  }, []);

  const filteredPartners = activeType === "الكل"
    ? partners
    : partners.filter(p => p.type === activeType);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* Unified Page Header */}
      <PageHeader
        icon={Handshake}
        badge="شركاؤنا الاستراتيجيون"
        title="شركاء النجاح"
        subtitle="نثمن تعاوننا مع المؤسسات والشركاء الذين يشاركونا رؤية بناء مجتمع مستدام"
      >
        <StatsGrid
          stats={[
            { label: 'شريك نشط', value: partners.length, icon: BarChart3, color: 'green' },
            { label: 'إجمالي الشركاء', value: SEED_IMPACT.partners, icon: Users, color: 'gold' },
            { label: 'مستفيد', value: SEED_IMPACT.beneficiaries.toLocaleString('ar-SA'), icon: TrendingUp, color: 'blue' },
            { label: 'مشروع', value: SEED_IMPACT.projects, icon: Target, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* Type Filter */}
      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {PARTNER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeType === type
                    ? "bg-[var(--brand-green)] text-white shadow-lg"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredPartners.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white rounded-3xl p-6 border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
              >
                <div className="mb-6">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-[var(--border)] group-hover:border-[var(--brand-green)]/30 transition-colors"
                  />
                </div>

                <h3 className="font-bold text-xl text-[var(--foreground)] mb-2 group-hover:text-[var(--brand-green)] transition-colors">
                  {partner.name}
                </h3>

                <span className="inline-block px-3 py-1 bg-[var(--brand-green)]/10 text-[var(--brand-green)] rounded-full text-xs font-medium mb-3">
                  {partner.type}
                </span>

                <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
                  {partner.description || 'شريك موثوق في تنفيذ المشاريع الإنسانية والتنموية'}
                </p>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-[var(--border)]">
                  <span className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-[var(--success-bg)]0' : 'bg-gray-400'}`} />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {partner.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-16">
              <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا يوجد شركاء مطابقين</h3>
              <p className="text-[var(--muted-foreground)]">جرب تغيير نوع الشريك</p>
            </div>
          )}
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">هل تريد أن تكون شريكنا؟</h2>
            <p className="text-white/80 text-lg mb-8">
              انضم إلى شبكة شركائنا وشاركنا رؤية بناء مجتمع مستدام
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                <Handshake className="w-5 h-5" />
                تواصل معنا
              </button>
              <button
                onClick={() => navigate('/donate')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-gold)] text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                <Heart className="w-5 h-5" fill="white" />
                تبرع الآن
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


