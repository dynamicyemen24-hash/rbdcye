// Homepage - rbdcye Campaign Home Page - Unified Design
import { motion } from "framer-motion";
import { Heart } from 'lucide-react';
import { useState } from "react";

import { Contact } from '@/app/components/Contact';
import { GeoScopeMap } from '@/app/components/GeoScopeMap';
import { Hero } from '@/app/components/Hero';
import { ImpactStats } from '@/app/components/ImpactStats';
import { News } from '@/app/components/News';
import { Partners } from '@/app/components/Partners';
import { Programs } from '@/app/components/Programs';
import { QuickDonation } from '@/app/components/QuickDonation';
import { ZakatCalculator } from '@/app/components/ZakatCalculator';
import { SuccessStories } from '@/app/components/SuccessStories';
import { useSEO } from '@/utils/seoAdvanced';

interface HomePageProps {
  setCurrentPage?: (page: string) => void;
}

export default function HomePage({ setCurrentPage = () => {} }: HomePageProps) {
  useSEO({
    title: 'رحماء بينهم - منصة إغاثة وتنمية',
    description: 'حملة رحماء بينهم الخيرية - تضامن إنساني وتنموي متكامل',
    type: 'website',
    url: 'https://rbdcye.org',
    keywords: ['إغاثة', 'تنمية', 'عمل خيري', 'مساعدات إنسانية', ' Yemen', 'اليمن'],
    image: 'https://rbdcye.org/og-image.png',
    author: {
      name: 'فريق رحماء بينهم',
      url: 'https://rbdcye.org/about'
    }
  });

  const [activeToolTab, setActiveToolTab] = useState<'donation' | 'zakat'>('donation');

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <Hero setCurrentPage={setCurrentPage} />

      {/* Live Impact Counters */}
      <ImpactStats />

      {/* Quick Donation & Zakat Calculator Section */}
      <section id="quick-donation" className="section-bg-gradient py-20">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <div className="section-header mb-12">
              <span className="badge badge--gold">
                <Heart className="w-4 h-4" />
                تبرع سريع وأثر مباشر
              </span>
              <h2>
                <span className="highlight">أثرك يبدأ من هنا</span>
              </h2>
              <p className="section-subtitle">
                اختر المشروع وحلّد تأثير تبرعك قبل الدفع، مع تبرع مباشر دون مغادرة الصفحة الرئيسية
              </p>
            </div>

            {/* Tabbed Interface */}
            <div className="card card--xl overflow-hidden">
              <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setActiveToolTab('donation')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                    activeToolTab === 'donation'
                      ? 'text-[var(--brand-gold)] border-b-2 border-[var(--brand-gold)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--brand-gold)]'
                  }`}
                >
                  تبرع سريع
                </button>
                <button
                  onClick={() => setActiveToolTab('zakat')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                    activeToolTab === 'zakat'
                      ? 'text-[var(--brand-gold)] border-b-2 border-[var(--brand-gold)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--brand-gold)]'
                  }`}
                >
                  حاسبة الزكاة
                </button>
              </div>
              <div className="p-6">
                {activeToolTab === 'donation' ? (
                  <QuickDonation embedded />
                ) : (
                  <ZakatCalculator />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GeoScope Map */}
      <GeoScopeMap setCurrentPage={setCurrentPage} />

      {/* Programs Section */}
      <section className="section-secondary">
        <div className="section-container">
          <Programs setCurrentPage={setCurrentPage} />
        </div>
      </section>

      {/* Success Stories */}
      <SuccessStories setCurrentPage={setCurrentPage} />

      {/* Partners */}
      <section className="section-secondary">
        <div className="section-container">
          <Partners setCurrentPage={setCurrentPage} />
        </div>
      </section>

      {/* News Section */}
      <section className="section bg-white">
        <div className="section-container">
          <News setCurrentPage={setCurrentPage} />
        </div>
      </section>

      {/* Contact Section */}
      <Contact setCurrentPage={setCurrentPage} />
    </div>
  );
}