import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Award,
  Heart,
  Users,
  Target,
  Calendar,
  Share2,
  Download,
  QrCode,
  Star,
  Trophy,
  Medal,
  Crown,
  Gem,
  Shield,
  Sparkles,
  Gift,
  BookOpen,
  Droplets,
  Apple,
  GraduationCap,
  HandHeart,
  Repeat,
  Clock,
  BadgeCheck,
  Flame,
  Zap,
  Link as LinkIcon,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowUpRight,
  FileText,
} from 'lucide-react';

/* ───────────────────── CSS VARIABLES ───────────────────── */
const V = {
  /* emerald palette */
  '--c-emerald-50': '#ecfdf5',
  '--c-emerald-100': '#d1fae5',
  '--c-emerald-200': '#a7f3d0',
  '--c-emerald-300': '#6ee7b7',
  '--c-emerald-400': '#34d399',
  '--c-emerald-500': '#10b981',
  '--c-emerald-600': '#059669',
  '--c-emerald-700': '#047857',
  '--c-emerald-800': '#065f46',
  '--c-emerald-900': '#064e3b',

  /* gold palette */
  '--c-gold-50': '#fffbeb',
  '--c-gold-100': '#fef3c7',
  '--c-gold-200': '#fde68a',
  '--c-gold-300': '#fcd34d',
  '--c-gold-400': '#fbbf24',
  '--c-gold-500': '#f59e0b',
  '--c-gold-600': '#d97706',
  '--c-gold-700': '#b45309',
  '--c-gold-800': '#92400e',
  '--c-gold-900': '#78350f',

  /* neutral */
  '--c-bg': '#0a0f1a',
  '--c-bg-card': '#111827',
  '--c-bg-card-hover': '#1a2332',
  '--c-surface': '#1e293b',
  '--c-surface-hover': '#273548',
  '--c-border': '#334155',
  '--c-border-light': '#475569',
  '--c-text': '#f1f5f9',
  '--c-text-muted': '#94a3b8',
  '--c-text-dim': '#64748b',

  /* semantic */
  '--c-primary': '#059669',
  '--c-primary-light': '#10b981',
  '--c-primary-glow': 'rgba(5, 150, 105, 0.3)',
  '--c-accent': '#f59e0b',
  '--c-accent-light': '#fbbf24',
  '--c-accent-glow': 'rgba(245, 158, 11, 0.35)',
  '--c-danger': '#ef4444',
  '--c-info': '#3b82f6',

  /* category colors */
  '--c-cat-kafalat': '#f472b6',
  '--c-cat-water': '#38bdf8',
  '--c-cat-food': '#fb923c',
  '--c-cat-education': '#a78bfa',
  '--c-cat-health': '#f87171',
  '--c-cat-shelter': '#34d399',

  /* gradients */
  '--grad-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #b45309 100%)',
  '--grad-emerald': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
  '--grad-hero': 'linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #0f172a 100%)',
  '--grad-passport': 'linear-gradient(145deg, #1a1510 0%, #2a2015 30%, #1a1510 60%, #2a2015 100%)',
  '--grad-card': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',

  /* shadows */
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.3)',
  '--shadow-md': '0 4px 12px rgba(0,0,0,0.4)',
  '--shadow-lg': '0 8px 32px rgba(0,0,0,0.5)',
  '--shadow-xl': '0 16px 48px rgba(0,0,0,0.6)',
  '--shadow-gold': '0 0 30px rgba(245, 158, 11, 0.15), 0 0 60px rgba(245, 158, 11, 0.05)',
  '--shadow-emerald': '0 0 30px rgba(5, 150, 105, 0.2), 0 0 60px rgba(5, 150, 105, 0.05)',
  '--shadow-emboss': 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',

  /* typography */
  '--font-display': "'Noto Kufi Arabic', 'Noto Sans Arabic', 'Cairo', sans-serif",
  '--font-body': "'Noto Sans Arabic', 'Cairo', 'IBM Plex Sans Arabic', sans-serif",
  '--font-mono': "'IBM Plex Mono Arabic', 'Noto Sans Mono', monospace",

  /* radius */
  '--radius-sm': '6px',
  '--radius-md': '10px',
  '--radius-lg': '16px',
  '--radius-xl': '24px',
  '--radius-2xl': '32px',
  '--radius-full': '9999px',

  /* transitions */
  '--ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  '--ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/* ───────────────────── MOCK DATA ───────────────────── */
const MOCK_DONOR = {
  name: 'أحمد بن محمد العتيبي',
  memberSince: '2021-03-15',
  totalDonations: 48750,
  peopleHelped: 342,
  projectsSupported: 12,
  yearsActive: 4,
  impactScore: 8450,
  level: 'ذهبي' as const,
  levelIndex: 1,
  referralCode: 'AHMED-RBDC-2024',
  shareUrl: 'https://rbdcye.org/passport/AHMED-RBDC-2024',
};

const LEVELS = [
  { name: 'فضي', min: 0, max: 2499, icon: Medal, color: '#94a3b8', gradient: 'linear-gradient(135deg, #94a3b8, #cbd5e1)' },
  { name: 'ذهبي', min: 2500, max: 6999, icon: Award, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { name: 'بلاتيني', min: 7000, max: 14999, icon: Crown, color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
  { name: 'ماسي', min: 15000, max: Infinity, icon: Gem, color: '#38bdf8', gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' },
];

const CATEGORIES = {
  كفالات: { color: 'var(--c-cat-kafalat)', icon: HandHeart },
  ماء: { color: 'var(--c-cat-water)', icon: Droplets },
  غذاء: { color: 'var(--c-cat-food)', icon: Apple },
  تعليم: { color: 'var(--c-cat-education)', icon: GraduationCap },
  صحة: { color: 'var(--c-cat-health)', icon: Shield },
  مأوى: { color: 'var(--c-cat-shelter)', icon: Users },
};

const MOCK_TIMELINE = [
  { id: 1, date: '2024-12-01', amount: 5000, project: 'ampaign مياه النظيفة — اليمن', category: 'ماء' as const, impact: 'توفير مياه نظيفة لـ 120 عائلة لمدة شهر كامل', description: 'حفر وتركيب three أبار مياه' },
  { id: 2, date: '2024-11-15', amount: 2500, project: ' projet تعليم الأيتام — غزة', category: 'تعليم' as const, impact: 'دعم تعليم 45 طفلاً يتيماً لمدة فصل دراسي', description: 'توفير الدروس الخصوصية والمواد التعليمية' },
  { id: 3, date: '2024-10-20', amount: 3000, project: 'kafala كفالة يتيم — الصومال', category: 'كفالات' as const, impact: 'كفالة 8 أيتام مع جميع احتياجاتهم الأساسية', description: 'كسوة وغذاء وتعليم وصحة' },
  { id: 4, date: '2024-09-05', amount: 1500, project: 'package حقيبة غذائية — لبنان', category: 'غذاء' as const, impact: 'تغذية 60 عائلة نازحة لمدة أسبوعين', description: 'توزيع 60 حقيبة غذائية متكاملة' },
  { id: 5, date: '2024-08-10', amount: 4000, project: 'clinic عيادة متنقلة — سوريا', category: 'صحة' as const, impact: 'علاج 200 مريض في المناطق النائية', description: '送 3 فرق طبية متنقلة' },
  { id: 6, date: '2024-07-22', amount: 2000, project: 'shelter مأوى مؤقت — تركيا', category: 'مأوى' as const, impact: 'إيواء 15 عائلة منEffect زلزال', description: 'توفير مأوى مؤقت واغطية شتوية' },
  { id: 7, date: '2024-06-01', amount: 3500, project: 'campaign مياه النظيفة — السودان', category: 'ماء' as const, impact: 'تركيب 5 خزانات مياه في القرى المنكوبة', description: '送 5 خزانات مياه 1000 لتر لكل منها' },
  { id: 8, date: '2024-05-10', amount: 1500, project: 'project تعليم البنات — أفغانستان', category: 'تعليم' as const, impact: 'تمكين 30 فتاة من إكمال تعليمهن', description: 'توفير مدرسات ومواد تعليمية' },
  { id: 9, date: '2024-03-15', amount: 8000, project: 'campaign رمضان المبارك — 5 دول', category: 'غذاء' as const, impact: 'إطعام 500 صائم خلال شهر رمضان', description: 'توزيع مئاتrij meals and food parcels' },
  { id: 10, date: '2024-01-20', amount: 2000, project: 'winter شتاء دافئ — فلسطين', category: 'مأوى' as const, impact: 'توفير بطانيات وسخانات لـ 40 عائلة', description: '送 40 طرد شتوي متكامل' },
];

const MOCK_BADGES = [
  { id: 1, name: 'أول خطوة', description: 'أول تبرع لك مع رُحمة', icon: Heart, color: '#ef4444', unlocked: true, date: '2021-03-15' },
  { id: 2, name: 'متبرع شهري', description: 'تبرعات شهرية متواصلة لمدة 3 أشهر', icon: Repeat, color: '#3b82f6', unlocked: true, date: '2021-06-15' },
  { id: 3, name: 'donor كرم كبير', description: 'تبرعات بقيمة أكثر من 10,000 ريال', icon: Gem, color: '#f59e0b', unlocked: true, date: '2022-08-20' },
  { id: 4, name: 'سامع صوت المحتاج', description: 'إحالة 5 متبرعين جدد', icon: Users, color: '#10b981', unlocked: true, date: '2023-01-10' },
  { id: 5, name: 'رفيق المشوار', description: 'سنة كاملة من التبرعات المستمرة', icon: Trophy, color: '#a78bfa', unlocked: true, date: '2022-03-15' },
  { id: 6, name: 'أثر لا ينطفئ', description: 'تبرعات لمدة سنتين متواصلتين', icon: Flame, color: '#f97316', unlocked: false, date: null },
  { id: 7, name: 'سفير الخير', description: 'إحالة 10 متبرعين جدد', icon: Sparkles, color: '#06b6d4', unlocked: false, date: null },
  { id: 8, name: 'ماسي אמיתי', description: 'الوصول للمستوى الماسي', icon: Crown, color: '#8b5cf6', unlocked: false, date: null },
];

/* ───────────────────── HELPERS ───────────────────── */
const fmt = (n: number) => n.toLocaleString('ar-SA');
const fmtDate = (d: string) => new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
/* ───────────────────── CUSTOM HOOK ───────────────────── */
export function useDonorAnimateCount(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);

  return { count, ref };
}

/* ───────────────────── SUB-COMPONENTS ───────────────────── */

/* ── Animated Circular Progress ── */
const CircularProgress: React.FC<{ score: number; max: number; color: string }> = ({ score, max, color }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / max, 1);
  const offset = circumference * (1 - progress);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setCount(score), 2500);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: 220, height: 220 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: `drop-shadow(0 0 12px ${color}40)` }}
        />
      </svg>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: 'var(--c-text)', lineHeight: 1 }}>
          {fmt(count)}
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--c-text-muted)', marginTop: 4 }}>
          نقطة أثر
        </span>
      </div>
    </div>
  );
};

/* ── Passport Card ── */
const PassportCard: React.FC = () => {
  const level = LEVELS[MOCK_DONOR.levelIndex];
  const LevelIcon = level.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--grad-passport)',
        border: '2px solid var(--c-gold-600)',
        borderRadius: 'var(--radius-2xl)',
        padding: '40px',
        maxWidth: 600,
        width: '100%',
        boxShadow: 'var(--shadow-gold)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Embossed corner ornaments */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, position: 'relative' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            background: level.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 24px ${level.color}30`,
          }}
        >
          <LevelIcon size={32} color="#fff" />
        </div>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--c-gold-400)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {MOCK_DONOR.name}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--c-text-muted)',
              margin: '4px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Calendar size={14} />
            عضو منذ {fmtDate(MOCK_DONOR.memberSince)}
          </p>
        </div>
      </div>

      {/* Level badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: `${level.color}18`,
          border: `1px solid ${level.color}40`,
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          marginBottom: 24,
        }}
      >
        <Star size={14} color={level.color} fill={level.color} />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: level.color,
          }}
        >
          المستوى: {level.name}
        </span>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          position: 'relative',
        }}
      >
        {[
          { label: 'النقاط', value: fmt(MOCK_DONOR.impactScore), icon: Award },
          { label: 'المساعدة', value: `${fmt(MOCK_DONOR.peopleHelped)} شخص`, icon: Users },
          { label: 'المشاريع', value: `${MOCK_DONOR.projectsSupported} مشروع`, icon: Target },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '12px 8px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <s.icon size={18} color="var(--c-gold-400)" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--c-text)' }}>
              {s.value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--c-text-dim)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* QR placeholder */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 64,
          height: 64,
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--c-gold-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(245,158,11,0.05)',
        }}
      >
        <QrCode size={32} color="var(--c-gold-400)" />
      </div>
    </motion.div>
  );
};

/* ── Impact Score Section ── */
const ImpactScoreSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'var(--c-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--c-border)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Sparkles size={22} color="var(--c-gold-400)" />
        نقاط الأثر
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress score={MOCK_DONOR.impactScore} max={15000} color="var(--c-gold-400)" />

        {/* Level cards */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LEVELS.map((lvl, i) => {
            const Icon = lvl.icon;
            const active = i === MOCK_DONOR.levelIndex;
            const passed = i <= MOCK_DONOR.levelIndex;

            return (
              <motion.div
                key={lvl.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1.5px solid ${active ? lvl.color : 'var(--c-border)'}`,
                  background: active ? `${lvl.color}10` : 'var(--c-surface)',
                  boxShadow: active ? `0 0 20px ${lvl.color}15` : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-full)',
                    background: passed ? lvl.gradient : 'var(--c-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 15,
                      fontWeight: 700,
                      color: passed ? lvl.color : 'var(--c-text-dim)',
                    }}
                  >
                    المستوى {lvl.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--c-text-dim)' }}>
                    {fmt(lvl.min)} — {lvl.max === Infinity ? '∞' : fmt(lvl.max)} نقطة
                  </div>
                </div>
                {passed && (
                  <Check size={18} color={lvl.color} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Lifetime Dashboard ── */
const LifetimeDashboard: React.FC = () => {
  const cards = [
    { label: 'إجمالي التبرعات', value: MOCK_DONOR.totalDonations, suffix: 'ريال', icon: Award, color: 'var(--c-gold-400)' },
    { label: 'عدد المستفيدين', value: MOCK_DONOR.peopleHelped, suffix: 'شخص', icon: Users, color: 'var(--c-emerald-400)' },
    { label: 'المشاريع المدعومة', value: MOCK_DONOR.projectsSupported, suffix: 'مشروع', icon: Target, color: 'var(--c-info)' },
    { label: 'سنوات النشاط', value: MOCK_DONOR.yearsActive, suffix: 'سنوات', icon: Calendar, color: 'var(--c-accent)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'var(--c-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--c-border)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Trophy size={22} color="var(--c-gold-400)" />
        لوحة الأثر الشامل
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: `0 8px 32px ${c.color}15` }}
            style={{
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              textAlign: 'center',
              cursor: 'default',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ width: '48', height: '48', borderRadius: 'var(--radius-full)', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <c.icon size={24} color={c.color} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--c-text)', lineHeight: 1.2 }}>
              {c.value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--c-text-muted)', marginTop: 4 }}>
              {c.suffix}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--c-text-dim)', marginTop: 6 }}>
              {c.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Share card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
          marginTop: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '14px 24px',
          background: 'var(--grad-emerald)',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-emerald)',
        }}
      >
        <QrCode size={20} color="#fff" />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff' }}>
          رمز QR الخاص بك
        </span>
      </motion.div>
    </motion.div>
  );
};

/* ── Timeline Section ── */
const TimelineSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('الكل');
  const categories = ['الكل', ...Object.keys(CATEGORIES)];

  const filtered = filter === 'الكل' ? MOCK_TIMELINE : MOCK_TIMELINE.filter(t => t.category === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'var(--c-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--c-border)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Clock size={22} color="var(--c-gold-400)" />
        خط زمني للأثر
      </h3>

      {/* Category filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {categories.map(cat => {
          const isActive = filter === cat;
          const catInfo = cat !== 'الكل' ? CATEGORIES[cat as keyof typeof CATEGORIES] : null;

          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${isActive ? (catInfo?.color || 'var(--c-gold-400)') : 'var(--c-border)'}`,
                background: isActive ? (catInfo ? `${catInfo.color}20` : 'rgba(245,158,11,0.15)') : 'transparent',
                color: isActive ? (catInfo?.color || 'var(--c-gold-400)') : 'var(--c-text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              {catInfo && <catInfo.icon size={14} />}
              {cat}
            </motion.button>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingRight: 32 }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            right: 11,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, var(--c-gold-600) 0%, var(--c-emerald-600) 50%, var(--c-border) 100%)',
            borderRadius: 1,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
          >
            {filtered.map((item, i) => {
              const cat = CATEGORIES[item.category];
              const CatIcon = cat.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    gap: 20,
                    paddingBottom: 28,
                    position: 'relative',
                  }}
                >
                  {/* Dot on timeline */}
                  <div
                    style={{
                      position: 'absolute',
                      right: -32,
                      top: 4,
                      width: 22,
                      height: 22,
                      borderRadius: 'var(--radius-full)',
                      background: cat.color,
                      border: '3px solid var(--c-bg-card)',
                      boxShadow: `0 0 12px ${cat.color}40`,
                      zIndex: 2,
                    }}
                  />

                  {/* Card */}
                  <motion.div
                    whileHover={{ x: -4, boxShadow: `0 4px 20px ${cat.color}10` }}
                    style={{
                      flex: 1,
                      background: 'var(--c-surface)',
                      border: '1px solid var(--c-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      transition: 'all 0.3s ease',
                      marginRight: 20,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--radius-sm)',
                            background: `${cat.color}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CatIcon size={16} color={cat.color} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: cat.color }}>
                          {item.category}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--c-text-dim)' }}>
                        {fmtDate(item.date)}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--c-text)',
                        margin: '0 0 6px',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.project}
                    </h4>

                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--c-text-muted)',
                        margin: '0 0 10px',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.impact}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 18,
                          fontWeight: 800,
                          color: 'var(--c-gold-400)',
                        }}
                      >
                        {fmt(item.amount)} ريال
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--c-text-dim)' }}>
                        {item.description}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ── Badges Section ── */
const BadgesSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'var(--c-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--c-border)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Shield size={22} color="var(--c-gold-400)" />
        شارات التميز
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--c-text-dim)', margin: '0 0 28px' }}>
        {MOCK_BADGES.filter(b => b.unlocked).length} من {MOCK_BADGES.length} شارات تم فتحها
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {MOCK_BADGES.map((badge, i) => {
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={badge.unlocked ? { y: -6, scale: 1.03 } : {}}
              style={{
                background: badge.unlocked ? 'var(--c-surface)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${badge.unlocked ? `${badge.color}40` : 'var(--c-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                textAlign: 'center',
                opacity: badge.unlocked ? 1 : 0.45,
                cursor: badge.unlocked ? 'default' : 'not-allowed',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              {badge.unlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${badge.color}12 0%, transparent 70%)`,
                  }}
                />
              )}

              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-full)',
                  background: badge.unlocked ? `${badge.color}18` : 'var(--c-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  position: 'relative',
                }}
              >
                <Icon size={28} color={badge.unlocked ? badge.color : 'var(--c-text-dim)'} />
                {!badge.unlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🔒</span>
                  </div>
                )}
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: badge.unlocked ? 'var(--c-text)' : 'var(--c-text-dim)',
                  margin: '0 0 6px',
                }}
              >
                {badge.name}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--c-text-dim)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {badge.description}
              </p>
              {badge.date && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--c-text-dim)', margin: '10px 0 0', opacity: 0.7 }}>
                  {fmtDate(badge.date)}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ── Certificate Section ── */
/* ════════════════ Impact Reports Section ════════════════ */
const ImpactReportsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "reports" | "certificates">("all");
  const reports = [
    { id: "r1", year: 2024, title: "تقرير أثر نصف العام الأول", status: "published" as const, file_url: "/reports/donor-2024-h1.pdf", items: 5 },
    { id: "r2", year: 2024, title: "تحديث مشروع: بئر الماء في الحديدة", status: "published" as const, file_url: "/reports/water-project-hodeidah.pdf", items: 3 },
    { id: "r3", year: 2024, title: "توقعات التكاليف الخاصة بك", status: "draft" as const, items: 0 },
  ];
  const tabs = [{ key: "all" as const, label: "الكل" }, { key: "reports" as const, label: "التقارير" }, { key: "certificates" as const, label: "الشهادات" }];

  return (
    <motion.div id="impact-reports" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--c-text)", margin: "0 0 28px", display: "flex", alignItems: "center", gap: 10 }}>
        <FileText size={22} color="var(--c-gold-400)" /> تقارير أثرك
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "var(--c-surface)", borderRadius: "var(--radius-xl)", padding: 4 }}>
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: "10px 16px", borderRadius: "calc(var(--radius-xl) - 4px)", border: "none", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: activeTab === t.key ? 700 : 500, color: activeTab === t.key ? "var(--c-text)" : "var(--c-text-muted)", background: activeTab === t.key ? "var(--grad-gold)" : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reports.filter((r) => { if (activeTab === "all") return true; if (activeTab === "reports" && !!r.file_url) return true; if (activeTab === "certificates" && !!r.file_url) return true; return false; }).map((r) => (
          <div key={r.id} style={{ background: "var(--c-bg-card)", border: "1px solid var(--c-border)", borderRadius: "var(--radius-xl)", padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>{r.title}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: "999px", background: r.status === "published" ? "var(--c-emerald-900)/30" : "var(--c-text-dim)/20", color: r.status === "published" ? "var(--c-emerald-400)" : "var(--c-text-dim)" }}>{r.status === "published" ? "منشور" : "مسودة"}</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--c-text-muted)" }}>{r.year} • {r.items} عناصر أثر</div>
            </div>
            {r.file_url ? (
              <a href={r.file_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--c-emerald-900)/20", color: "var(--c-emerald-400)", padding: "8px 14px", borderRadius: "var(--radius-lg)", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}><Download size={14} /> تحميل PDF</a>
            ) : (
              <span style={{ fontSize: 11, color: "var(--c-text-dim)", padding: "6px 12px" }}>غير متاح</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
const CertificateSection: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'var(--c-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--c-border)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Award size={22} color="var(--c-gold-400)" />
        شهادة أثرك
      </h3>

      {/* Certificate preview */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        style={{
          background: 'var(--grad-passport)',
          border: '2px solid var(--c-gold-600)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 36px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-gold)',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {/* Decorative corner */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderTop: '2px solid var(--c-gold-500)',
            borderRight: '2px solid var(--c-gold-500)',
            borderRadius: '0 var(--radius-sm) 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 40,
            height: 40,
            borderTop: '2px solid var(--c-gold-500)',
            borderLeft: '2px solid var(--c-gold-500)',
            borderRadius: 'var(--radius-sm) 0 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 40,
            height: 40,
            borderBottom: '2px solid var(--c-gold-500)',
            borderRight: '2px solid var(--c-gold-500)',
            borderRadius: '0 0 var(--radius-sm) 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            width: 40,
            height: 40,
            borderBottom: '2px solid var(--c-gold-500)',
            borderLeft: '2px solid var(--c-gold-500)',
            borderRadius: '0 0 0 var(--radius-sm)',
          }}
        />

        <Star size={40} color="var(--c-gold-400)" fill="var(--c-gold-400)" style={{ margin: '0 auto 16px' }} />

        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--c-gold-400)',
            margin: '0 0 8px',
            letterSpacing: 2,
          }}
        >
          شهادة أثر
        </h4>

        <div style={{ width: 60, height: 2, background: 'var(--grad-gold)', margin: '12px auto', borderRadius: 1 }} />

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--c-text-muted)', margin: '0 0 4px' }}>
          تشهد منظمة رُحمة بأن الأثر
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--c-text)',
            margin: '8px 0',
          }}
        >
          {MOCK_DONOR.name}
        </h2>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--c-text-muted)', margin: '0 0 20px' }}>
          قد أسهم بـ <span style={{ color: 'var(--c-gold-400)', fontWeight: 700 }}>{fmt(MOCK_DONOR.totalDonations)} ريال</span> في دعم{' '}
          <span style={{ color: 'var(--c-emerald-400)', fontWeight: 700 }}>{MOCK_DONOR.projectsSupported} مشروع</span> استفاد منها{' '}
          <span style={{ color: 'var(--c-info)', fontWeight: 700 }}>{fmt(MOCK_DONOR.peopleHelped)} شخص</span>
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 14px',
          }}
        >
          <Award size={14} color="var(--c-gold-400)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--c-gold-400)' }}>
            نقطة أثر: {fmt(MOCK_DONOR.impactScore)}
          </span>
        </div>

        <div style={{ width: 60, height: 2, background: 'var(--grad-gold)', margin: '20px auto 12px', borderRadius: 1 }} />

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--c-text-dim)' }}>
          صدرت في {fmtDate(new Date().toISOString())}
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            background: 'var(--grad-gold)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-gold)',
          }}
        >
          {downloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Download size={18} />
              </motion.div>
              جاري التحميل...
            </>
          ) : (
            <>
              <Download size={18} />
              تحميل الشهادة
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            background: 'transparent',
            border: '1.5px solid var(--c-gold-500)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--c-gold-400)',
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Share2 size={18} />
          مشاركة
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── Share Section ── */
const ShareSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_DONOR.shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'واتساب', color: '#25d366', icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )},
    { name: 'تويتر', color: '#1da1f2', icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
      </svg>
    )},
    { name: 'فيسبوك', color: '#1877f2', icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )},
    { name: 'نسخ الرابط', color: 'var(--c-gold-500)', icon: copied ? <Check size={20} color="#fff" /> : <Copy size={20} color="#fff" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7 }}
      style={{
        background: 'var(--c-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--c-border)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Share2 size={22} color="var(--c-gold-400)" />
        شارك أثرك
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--c-text-dim)', margin: '0 0 28px' }}>
        شارك أثرك مع أصدقائك وأحبابك وكن سبباً في إلهام الآخرين
      </p>

      {/* Referral link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 24,
        }}
      >
        <LinkIcon size={18} color="var(--c-text-dim)" style={{ flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--c-text-muted)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          dir="ltr"
        >
          {MOCK_DONOR.shareUrl}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: copied ? 'var(--c-emerald-600)' : 'var(--c-gold-600)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.3s ease',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </motion.button>
      </div>

      {/* Referral code */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px dashed var(--c-gold-500)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 28,
        }}
      >
        <Gift size={18} color="var(--c-gold-400)" />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--c-text-dim)', display: 'block' }}>
            كود الإحالة الخاص بك
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--c-gold-400)' }}>
            {MOCK_DONOR.referralCode}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--c-text-dim)' }}>
          شاركه واحصل على مكافآت
        </span>
      </div>

      {/* Share buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {shareLinks.map((link, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={link.name === 'نسخ الرابط' ? handleCopy : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              background: link.color,
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${typeof link.color === 'string' && link.color.startsWith('#') ? link.color + '30' : 'rgba(245,158,11,0.2)'}`,
            }}
          >
            {link.icon}
            {link.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

/* ───────────────────── MAIN PAGE ───────────────────── */
const DonorPassportPage: React.FC = () => {
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        ...V,
        minHeight: '100vh',
        background: 'var(--c-bg)',
        fontFamily: 'var(--font-body)',
        color: 'var(--c-text)',
        overflowX: 'hidden',
      }}
    >
      {/* Ambient background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(ellipse at 20% 0%, rgba(245,158,11,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(5,150,105,0.03) 0%, transparent 50%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-full)',
              background: 'var(--grad-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            <Award size={36} color="#fff" />
          </motion.div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 900,
              color: 'var(--c-gold-400)',
              margin: '0 0 10px',
              lineHeight: 1.3,
            }}
          >
            جواز أثرك — سجل خيرك الشخصي
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              color: 'var(--c-text-muted)',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            بطاقة أثرك الشخصية التي تُوثّق مسيرة خيرك وتُShow تأثيرك في حياة المحتاجين
          </p>
        </motion.div>

        {/* Passport Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <PassportCard />
        </div>

        {/* Impact Score */}
        <div style={{ marginBottom: 48 }}>
          <ImpactScoreSection />
        </div>

        {/* Lifetime Dashboard */}
        <div style={{ marginBottom: 48 }}>
          <LifetimeDashboard />
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: 48 }}>
          <TimelineSection />
        </div>

        {/* Badges */}
        <div style={{ marginBottom: 48 }}>
          <BadgesSection />
        </div>

                        {/* Impact Reports */}
        <div style={{ marginBottom: 48 }}>
          <ImpactReportsSection />
        </div>

        {/* Certificate */}
        <div style={{ marginBottom: 48 }}>
          <CertificateSection />
        </div>

        {/* Share */}
        <div style={{ marginBottom: 48 }}>
          <ShareSection />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            padding: '32px 0',
            borderTop: '1px solid var(--c-border)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--c-text-dim)', margin: 0 }}>
            © {new Date().getFullYear()} رُحمة بينهم — جميع الحقوق محفوظة
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--c-text-dim)', margin: '6px 0 0', opacity: 0.6 }}>
            جواز أثرك — بطاقة شكر وتقدير لكل متبرع
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DonorPassportPage;