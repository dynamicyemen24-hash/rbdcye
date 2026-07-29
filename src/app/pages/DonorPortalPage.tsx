// Donor Portal Page - صفحة بوابة المتبرع (محسّنة بدمج DonorPortal المتكامل)
import { motion } from 'framer-motion';
import { Heart, Shield, BarChart3, History, Gift } from 'lucide-react';
import { useEffect } from 'react';

import DonorPortal from '@/app/components/DonorPortal';
import { analyticsService } from '@/shared/services/analytics.service';
import { contentBridge } from '@/shared/services/content-bridge.service';
import { useSEO } from '@/utils/seoAdvanced';

export default function DonorPortalPage() {
  useSEO({
    title: 'بوابة المتبرع - رحماء بينهم',
    description: 'متابعة تبرعاتك وأثر مبلغك بشكل فوري مع بيانات محدثة',
    type: 'website',
    url: 'https://rbdcye.org/donor',
  });

  useEffect(() => {
    let cancelled = false;

    // محاولة تحميل بيانات المتبرع من content-bridge (Sanity)
    contentBridge.getContent<any>('impact')
      .then(() => {
        if (!cancelled) {
          try { analyticsService.generateDonorReport(); } catch { /* non-critical */ }
        }
      })
      .catch(() => {
        if (!cancelled) {
          try { analyticsService.generateDonorReport(); } catch { /* non-critical */ }
        }
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--secondary)] pt-20" dir="rtl">
      {/* Page Header */}
      <section className="py-8 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">بوابة المتبرع</h1>
              <p className="text-[var(--muted-foreground)]">متابعة تبرعاتك وأثر مبلغك بشكل فوري</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donor Portal Component */}
      <DonorPortal />

      {/* Trust Badges */}
      <section className="py-8 bg-white border-t border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Shield className="w-4 h-4 text-[var(--brand-green)]" />
              <span>آمن وموثوق</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <BarChart3 className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>شفافية تامة</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <History className="w-4 h-4 text-blue-600" />
              <span>سجل تبرعات كامل</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Gift className="w-4 h-4 text-purple-600" />
              <span>أثر مباشر</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
