// Partners Page - صفحة الشركاء (محسّنة بدمج SEED_PARTNERS)
import { motion } from "framer-motion";
import {
  Handshake, Award, Users, Star, Shield, Target,
  Globe, ArrowLeft, Heart, Briefcase, Building2,
  Mail, Phone, ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";
import { SEED_PARTNERS, SEED_IMPACT } from "@/content/website";
import { contentBridge } from "@/shared/services/content-bridge.service";
import { analyticsService } from "@/shared/services/analytics.service";

interface Partner {
  id: string;
  name: string;
  logo: string;
  type: string;
  status: string;
  url: string;
}

const PARTNER_TYPES = ["الكل", "شريك إستراتيجي", "جهة ممولة", "شريك تنفيذي", "شريك داعم"];

function normalizePartners(): Partner[] {
  return SEED_PARTNERS.map((p) => ({
    id: p.id,
    name: p.name,
    logo: p.logo,
    type: p.type,
    status: p.status,
    url: p.url,
  }));
}

export default function PartnersPage() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("الكل");
  const [partners, setPartners] = useState<Partner[]>(normalizePartners());

  useSEO({
    title: 'شركاؤنا - رحماء بينهم',
    description: 'شركاؤنا الاستراتيجيون والمؤسسات الداعمة لمؤسسة رحماء بينهم',
  });

  useEffect(() => {
    let cancelled = false;
    contentBridge.getContent<any>('impact')
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
              <Handshake className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">شركاؤنا الاستراتيجيون</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[var(--foreground)]">شركاؤ </span>
              <span className="text-[var(--brand-green)]">النجاح</span>
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
              نثمن تعاوننا مع المؤسسات والشركاء الذين يشاركونا رؤية بناء مجتمع مستدام
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-[var(--secondary)]">
              <div className="text-2xl font-bold text-[var(--brand-green)]">{partners.length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">شريك نشط</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--secondary)]">
              <div className="text-2xl font-bold text-[var(--brand-gold)]">{SEED_IMPACT.partners}</div>
              <div className="text-sm text-[var(--muted-foreground)]">إجمالي الشركاء</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--secondary)]">
              <div className="text-2xl font-bold text-blue-600">{SEED_IMPACT.beneficiaries.toLocaleString('ar-SA')}</div>
              <div className="text-sm text-[var(--muted-foreground)]">مستفيد</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--secondary)]">
              <div className="text-2xl font-bold text-purple-600">{SEED_IMPACT.projects}</div>
              <div className="text-sm text-[var(--muted-foreground)]">مشروع</div>
            </div>
          </div>
        </div>
      </section>

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
                    : "bg-gray-100 text-[var(--muted-foreground)] hover:bg-gray-200"
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
                    className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-gray-100 group-hover:border-[var(--brand-green)]/30 transition-colors"
                  />
                </div>

                <h3 className="font-bold text-xl text-[var(--foreground)] mb-2 group-hover:text-[var(--brand-green)] transition-colors">
                  {partner.name}
                </h3>

                <span className="inline-block px-3 py-1 bg-[var(--brand-green)]/10 text-[var(--brand-green)] rounded-full text-xs font-medium mb-3">
                  {partner.type}
                </span>

                <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
                  شريك موثوق في تنفيذ المشاريع الإنسانية والتنموية
                </p>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-[var(--border)]">
                  <span className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
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
