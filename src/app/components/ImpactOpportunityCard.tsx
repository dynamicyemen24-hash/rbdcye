import {
  MapPin, Users, Target, Calendar, TrendingUp,
  CheckCircle2, Clock, DollarSign, ArrowLeft, Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { memo } from 'react';

interface ImpactOpportunity {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  // ماذا؟ — ما المشروع؟
  description: string;
  // لماذا؟ — لماذا نحتاجه؟
  need: string;
  // لمن؟ — من المستفيد؟
  beneficiaries: string;
  beneficiaryCount: number;
  // أين؟ — أين ينفذ؟
  location: string;
  governorate: string;
  // ماذا حدث؟ — ما الأثر؟
  impactAchieved: string;
  // البيانات المالية
  totalBudget: number;
  collected: number;
  remaining: number;
  // المدة والمؤشرات
  duration: string;
  successIndicators: string[];
  // مراحل التنفيذ
  phases: { name: string; status: 'completed' | 'active' | 'pending' }[];
  // الأدلة
  evidenceCount: number;
  reportAvailable: boolean;
  // الحالة
  status: 'active' | 'completed' | 'urgent';
  urgencyLevel?: 'high' | 'medium' | 'low';
}

interface Props {
  opportunity: ImpactOpportunity;
  onDonate?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  compact?: boolean;
}

const STATUS_MAP = {
  active: { label: 'نشط', bg: 'bg-[var(--brand-green)]', text: 'text-white' },
  completed: { label: 'مكتمل', bg: 'bg-emerald-500', text: 'text-white' },
  urgent: { label: 'عاجل', bg: 'bg-red-500', text: 'text-white' },
} as const;

const URGENCY_MAP = {
  high: { label: 'حاجة عالية', color: 'text-red-500', border: 'border-red-500/30' },
  medium: { label: 'حاجة متوسطة', color: 'text-amber-500', border: 'border-amber-500/30' },
  low: { label: 'حاجة منخفضة', color: 'text-emerald-500', border: 'border-emerald-500/30' },
} as const;

const PHASE_ICONS = {
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  active: <Clock className="h-4 w-4 text-[var(--brand-green)]" />,
  pending: <div className="h-4 w-4 rounded-full border-2 border-[var(--muted-foreground)]/30" />,
} as const;

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ar-YE');
}

function getProgressPercent(collected: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((collected / total) * 100));
}

export const ImpactOpportunityCard = memo(function ImpactOpportunityCard({
  opportunity,
  onDonate,
  onViewDetails,
  compact = false,
}: Props) {
  const statusInfo = STATUS_MAP[opportunity.status];
  const progress = getProgressPercent(opportunity.collected, opportunity.totalBudget);

  const handleDonate = () => onDonate?.(opportunity.id);
  const handleViewDetails = () => onViewDetails?.(opportunity.id);

  if (compact) {
    return (
      <motion.div
        dir="rtl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-green)]/5 via-transparent to-[var(--brand-gold)]/5 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{opportunity.categoryIcon}</span>
              <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                {opportunity.category}
              </span>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
          </div>

          <h3 className="line-clamp-2 text-base font-bold text-[var(--foreground)]">
            {opportunity.title}
          </h3>

          <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {opportunity.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {opportunity.governorate}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {opportunity.beneficiaryCount.toLocaleString('ar-YE')} مستفيد
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">التقدم</span>
              <span className="font-bold text-[var(--brand-green)]">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-l from-[var(--brand-green)] to-emerald-400"
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
              <span>{formatCurrency(opportunity.collected)} ر.ي</span>
              <span className="font-bold text-[var(--brand-gold)]">{formatCurrency(opportunity.remaining)} ر.ي متبقي</span>
            </div>
          </div>

          <button
            onClick={handleDonate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[var(--brand-gold)] to-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <Heart className="h-4 w-4" />
            تبرع الآن
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-green)]/5 via-transparent to-[var(--brand-gold)]/5 opacity-0 transition-opacity group-hover:opacity-100" />

      {/* ═══════════════════════════════════════════════════════════════
          الرأس — الفئة + الشارة + الموقع
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-[var(--border)] bg-[var(--muted)]/50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{opportunity.categoryIcon}</span>
            <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
              {opportunity.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {opportunity.urgencyLevel && (
              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${URGENCY_MAP[opportunity.urgencyLevel].color} ${URGENCY_MAP[opportunity.urgencyLevel].border}`}>
                {URGENCY_MAP[opportunity.urgencyLevel].label}
              </span>
            )}
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
          <MapPin className="h-3 w-3" />
          {opportunity.location} — {opportunity.governorate}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          العنوان + الوصف
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative px-5 pt-4 pb-3">
        <h2 className="text-xl font-extrabold leading-tight text-[var(--foreground)]">
          {opportunity.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {opportunity.description}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          الأسئلة الاستراتيجية الخمسة
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative mx-5 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          الأسئلة الاستراتيجية
        </h4>
        <div className="space-y-3">
          {/* ماذا؟ */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-green)]/10">
              <Target className="h-4 w-4 text-[var(--brand-green)]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--brand-green)]">ماذا؟</span>
              <p className="text-sm text-[var(--foreground)]">{opportunity.description}</p>
            </div>
          </div>

          {/* لماذا؟ */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-500">لماذا؟</span>
              <p className="text-sm text-[var(--foreground)]">{opportunity.need}</p>
            </div>
          </div>

          {/* لمن؟ */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-500">لمن؟</span>
              <p className="text-sm text-[var(--foreground)]">
                {opportunity.beneficiaries}
                <span className="mr-2 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-500">
                  {opportunity.beneficiaryCount.toLocaleString('ar-YE')} مستفيد
                </span>
              </p>
            </div>
          </div>

          {/* أين؟ */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
              <MapPin className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-500">أين؟</span>
              <p className="text-sm text-[var(--foreground)]">
                {opportunity.location}، {opportunity.governorate}
              </p>
            </div>
          </div>

          {/* ماذا حدث؟ */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-500">ماذا حدث؟</span>
              <p className="text-sm text-[var(--foreground)]">{opportunity.impactAchieved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          الشفافية المالية
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative px-5 pt-4 pb-3">
        <div className="mb-2 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[var(--brand-gold)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            الشفافية المالية
          </h4>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">الميزانية الإجمالية</span>
            <span className="font-bold text-[var(--foreground)]">{formatCurrency(opportunity.totalBudget)} ر.ي</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[var(--muted)]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-l from-[var(--brand-green)] via-emerald-400 to-emerald-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" />
              المحصل: {formatCurrency(opportunity.collected)} ر.ي ({progress}%)
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--brand-gold)]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" />
              المتبقي: {formatCurrency(opportunity.remaining)} ر.ي
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          مراحل التنفيذ
      ═══════════════════════════════════════════════════════════════ */}
      {opportunity.phases.length > 0 && (
        <div className="relative px-5 pt-3 pb-3">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            مراحل التنفيذ
          </h4>
          <div className="flex items-center gap-1">
            {opportunity.phases.map((phase, i) => (
              <div key={phase.name} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  {PHASE_ICONS[phase.status]}
                  <span className={`text-xs ${
                    // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
                    phase.status === 'completed'
                      ? 'text-emerald-500'
                      : phase.status === 'active'
                      ? 'font-bold text-[var(--brand-green)]'
                      : 'text-[var(--muted-foreground)]/50'
                  }`}>
                    {phase.name}
                  </span>
                </div>
                {i < opportunity.phases.length - 1 && (
                  <div className={`mx-1.5 h-px w-4 ${
                    phase.status === 'completed' ? 'bg-emerald-500' : 'bg-[var(--muted-foreground)]/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          مؤشرات النجاح
      ═══════════════════════════════════════════════════════════════ */}
      {opportunity.successIndicators.length > 0 && (
        <div className="relative px-5 pt-2 pb-3">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            مؤشرات النجاح
          </h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.successIndicators.map((indicator) => (
              <span
                key={indicator}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-1 text-xs text-[var(--foreground)]"
              >
                <CheckCircle2 className="h-3 w-3 text-[var(--brand-green)]" />
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          أزرار الإجراء
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex items-center gap-3 px-5 pt-2 pb-4">
        <button
          onClick={handleDonate}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[var(--brand-gold)] to-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.98]"
        >
          <Heart className="h-4 w-4" />
          تبرع الآن
        </button>
        <button
          onClick={handleViewDetails}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--foreground)] transition-all hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] active:scale-[0.98]"
        >
          عرض التفاصيل
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          التذييل — المدة + الأدلة + التقرير
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--muted)]/30 px-5 py-3">
        <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {opportunity.duration}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {opportunity.evidenceCount.toLocaleString('ar-YE')} دليل
          </span>
        </div>
        {opportunity.reportAvailable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-green)]/10 px-2.5 py-1 text-xs font-bold text-[var(--brand-green)]">
            تقرير متوفر
          </span>
        )}
      </div>
    </motion.div>
  );
});
