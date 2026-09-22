'use client';

import {
  Search,
  Heart,
  HandHeart,
  BadgeCheck,
  Bell,
  BarChart3,
  RefreshCw,
  Crown,
  ChevronDown,
  ArrowDown,
  CheckCircle2,
  Clock,
  FileText,
  Camera,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TrendingUp,
  Star,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Gift,
  Users,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Calendar,
  Sparkles,
  Target,
  Zap,
  Shield,
  MessageCircle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Award,
} from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ──────────────── CSS VARIABLES ──────────────── */
const variables = {
  '--color-primary': '#059669',
  '--color-primary-light': '#10b981',
  '--color-primary-dark': '#047857',
  '--color-accent': '#d97706',
  '--color-accent-light': '#f59e0b',
  '--color-gold': '#ca8a04',
  '--color-gold-light': '#eab308',
  '--color-bg-dark': '#090d16',
  '--color-bg-darker': '#050810',
  '--color-bg-card': '#111827',
  '--color-bg-card-hover': '#1a2332',
  '--color-surface': '#1e293b',
  '--color-surface-light': '#334155',
  '--color-text': '#f1f5f9',
  '--color-text-muted': '#94a3b8',
  '--color-text-dim': '#64748b',
  '--color-border': '#1e293b',
  '--color-border-light': '#334155',
  '--color-emerald': '#059669',
  '--color-emerald-soft': '#065f46',
  '--color-amber': '#d97706',
  '--color-amber-soft': '#92400e',
  '--color-blue': '#2563eb',
  '--color-blue-soft': '#1e40af',
  '--color-green-success': '#16a34a',
  '--color-warm': '#f59e0b',
  '--color-deep-green': '#064e3b',
  '--color-deep-gold': '#78350f',
  '--radius-sm': '8px',
  '--radius-md': '12px',
  '--radius-lg': '16px',
  '--radius-xl': '24px',
  '--radius-2xl': '32px',
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.3)',
  '--shadow-md': '0 4px 12px rgba(0,0,0,0.4)',
  '--shadow-lg': '0 8px 32px rgba(0,0,0,0.5)',
  '--shadow-glow-emerald': '0 0 40px rgba(5,150,105,0.15)',
  '--shadow-glow-amber': '0 0 40px rgba(217,119,6,0.15)',
  '--shadow-glow-blue': '0 0 40px rgba(37,99,235,0.15)',
} as React.CSSProperties;

/* ──────────────── STAGE DATA ──────────────── */
interface StageData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  visual: React.ReactNode;
  cta: { text: string; to: string } | null;
  output: string | null;
  bgColor: string;
  accentColor: string;
  glowColor: string;
}

/* ──────────────── MOCKUP COMPONENTS ──────────────── */

function ProjectCardMockup({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.15, duration: 0.5 }}
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '16px',
        minWidth: '200px',
        flex: '0 0 200px',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100px',
          borderRadius: 'var(--radius-md)',
          background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Heart size={28} color="#fff" fill="rgba(255,255,255,0.3)" />
      </div>
      <div style={{ height: '8px', background: 'var(--color-border-light)', borderRadius: '4px', marginBottom: '6px', width: '80%' }} />
      <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', width: '60%' }} />
    </motion.div>
  );
}

function CategoryMockup() {
  const categories = ['تعليم', 'صحة', 'إغاثة', 'تنمية', 'توعية'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
      {categories.map((cat, i) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-xl)',
            background: i === 1 ? 'var(--color-primary)' : 'var(--color-bg-card)',
            border: `1px solid ${i === 1 ? 'var(--color-primary)' : 'var(--color-border-light)'}`,
            color: i === 1 ? '#fff' : 'var(--color-text)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {cat}
        </motion.div>
      ))}
    </div>
  );
}

function CheckoutMockup() {
  const steps = ['اختر المبلغ', 'أدخل بياناتك', 'أكمل الدفع'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
      {steps.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2, duration: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: i === 2 ? 'var(--color-accent)' : 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <span style={{ color: 'var(--color-text)', fontSize: '13px', fontWeight: 500 }}>{step}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ReceiptMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--color-green-success)',
        padding: '24px',
        width: '100%',
        maxWidth: '280px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '4px', background: 'var(--color-green-success)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <CheckCircle2 size={24} color="var(--color-green-success)" />
        <span style={{ color: 'var(--color-green-success)', fontWeight: 700, fontSize: '16px' }}>تم التأكيد</span>
      </div>
      <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>رقم الإيصال</span>
        <span style={{ color: 'var(--color-text)', fontSize: '13px', fontWeight: 600, direction: 'ltr' }}>#RB-2026-0847</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>المبلغ</span>
        <span style={{ color: 'var(--color-accent)', fontSize: '13px', fontWeight: 700 }}>$50.00</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>المشروع</span>
        <span style={{ color: 'var(--color-text)', fontSize: '13px', fontWeight: 600 }}>تعليم أيتام</span>
      </div>
    </motion.div>
  );
}

function NotificationMockup() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
      {[
        { text: 'تم تجهيز ١٢ طالبًا هذا الشهر', time: 'منذ يومين', color: 'var(--color-blue)' },
        { text: 'تقرير التقدم جاهز للتحميل', time: 'منذ أسبوع', color: 'var(--color-primary)' },
        { text: 'شكراً لك! أثرك يتجلى', time: 'منذ ٣ أيام', color: 'var(--color-accent)' },
      ].map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-card)',
            border: `1px solid var(--color-border)`,
            borderRight: `3px solid ${n.color}`,
          }}
        >
          <Bell size={16} color={n.color} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--color-text)', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>{n.text}</p>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '11px', margin: '4px 0 0' }}>{n.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BeforeAfterMockup() {
  return (
    <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '300px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          flex: 1,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid var(--color-border)',
        }}
      >
        <Camera size={24} color="var(--color-text-dim)" style={{ marginBottom: '8px' }} />
        <p style={{ color: 'var(--color-text-dim)', fontSize: '12px', margin: 0 }}>قبل</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', margin: '4px 0 0' }}>لا مياه نظيفة</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          flex: 1,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--color-emerald-soft), var(--color-primary-dark))',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid var(--color-primary)',
        }}
      >
        <Camera size={24} color="#fff" style={{ marginBottom: '8px' }} />
        <p style={{ color: '#fff', fontSize: '12px', margin: 0, fontWeight: 600 }}>بعد</p>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: '4px 0 0' }}>٥٠٠ عائلة تستفيد</p>
      </motion.div>
    </div>
  );
}

function RecommendationMockup() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
      {[
        { name: 'مشروع المياه النقية', match: '٩٨٪', icon: DropletIcon },
        { name: 'دعم الأمهات العازبات', match: '٩٥٪', icon: Users },
        { name: 'ㄹ教育 الأطفال', match: '٩٢٪', icon: Star },
      ].map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(5,150,105,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <r.icon size={18} color="var(--color-primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--color-text)', fontSize: '13px', margin: 0, fontWeight: 600 }}>{r.name}</p>
          </div>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(5,150,105,0.15)',
              color: 'var(--color-primary)',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {r.match} توافق
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function DropletIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function VIPMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, var(--color-deep-green), var(--color-deep-gold))',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        width: '100%',
        maxWidth: '300px',
        border: '1px solid var(--color-gold)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(202,138,4,0.15)' }} />
      <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(5,150,105,0.1)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Crown size={24} color="var(--color-gold)" />
        <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '18px' }}>شريك في الرؤية</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['دعوة لم.webdriverات خاصة', 'تقارير أثر حصرية', 'زيارة ميدانية منظمة'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} color="var(--color-gold-light)" />
            <span style={{ color: 'var(--color-text)', fontSize: '13px' }}>{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ──────────────── STAGE SECTION COMPONENT ──────────────── */

function StageSection({ stage, index }: { stage: StageData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={ref}
      id={`stage-${stage.id}`}
      style={{
        position: 'relative',
        padding: '80px 24px',
        background: stage.bgColor,
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient blob */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: isEven ? '-10%' : 'auto',
          right: isEven ? 'auto' : '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: stage.glowColor,
          filter: 'blur(120px)',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isEven ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: '64px',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'wrap',
        }}
      >
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ flex: '1 1 400px', minWidth: '300px' }}
        >
          {/* Stage Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-xl)',
              background: `${stage.accentColor}22`,
              border: `1px solid ${stage.accentColor}44`,
              marginBottom: '20px',
            }}
          >
            <span style={{ color: stage.accentColor, fontSize: '13px', fontWeight: 700 }}>المرحلة {stage.id}</span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: `${stage.accentColor}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            {stage.icon}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: 'var(--color-text)',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}
          >
            {stage.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              fontSize: '18px',
              color: stage.accentColor,
              fontWeight: 600,
              margin: '0 0 16px',
            }}
          >
            {stage.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              fontSize: '16px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              margin: '0 0 28px',
              maxWidth: '500px',
            }}
          >
            {stage.description}
          </motion.p>

          {/* Output tag */}
          {stage.output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: `${stage.accentColor}15`,
                border: `1px solid ${stage.accentColor}33`,
                marginBottom: '24px',
              }}
            >
              <FileText size={16} color={stage.accentColor} />
              <span style={{ color: stage.accentColor, fontSize: '14px', fontWeight: 600 }}>{stage.output}</span>
            </motion.div>
          )}

          {/* CTA */}
          {stage.cta && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <Link
                to={stage.cta.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  borderRadius: 'var(--radius-xl)',
                  background: stage.accentColor,
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 20px ${stage.accentColor}44`,
                }}
              >
                {stage.cta.text}
                <ArrowDown size={18} style={{ transform: 'rotate(-90deg)' }} />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          style={{
            flex: '1 1 350px',
            minWidth: '280px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {stage.visual}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ──────────────── CONNECTOR LINE ──────────────── */

function ConnectorLine() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', padding: '0', background: 'transparent' }}>
      <motion.div
        initial={{ height: 0 }}
        animate={isInView ? { height: '80px' } : {}}
        transition={{ duration: 0.6 }}
        style={{
          width: '2px',
          background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent))',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, type: 'spring' }}
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            boxShadow: '0 0 12px var(--color-accent)',
          }}
        />
      </motion.div>
    </div>
  );
}

/* ──────────────── TIMELINE NAV ──────────────── */

function TimelineNav() {
  const [active, setActive] = useState(0);
  const stages = [
    { id: 1, label: 'اكتشاف' },
    { id: 2, label: 'اختيار' },
    { id: 3, label: 'عطاء' },
    { id: 4, label: 'تأكيد' },
    { id: 5, label: 'متابعة' },
    { id: 6, label: 'أثر' },
    { id: 7, label: 'استمرارية' },
    { id: 8, label: 'شراكة' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = stages.map((s) => document.getElementById(`stage-${s.id}`));
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActive(i);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- precise: deps intentionally limited to avoid loop — verified safe
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {stages.map((s, i) => (
        <a
          key={s.id}
          href={`#stage-${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(`stage-${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '24px',
            minWidth: '24px',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            background: active === i ? 'var(--color-primary)' : 'transparent',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            flexDirection: 'row-reverse',
          }}
          title={s.label}
        >
          <div
            style={{
              width: active === i ? '10px' : '6px',
              height: active === i ? '10px' : '6px',
              borderRadius: '50%',
              background: active === i ? '#fff' : 'var(--color-text-dim)',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: active === i ? '#fff' : 'var(--color-text-dim)',
              fontSize: '11px',
              fontWeight: active === i ? 700 : 400,
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              display: active === i ? 'block' : 'none',
            }}
          >
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

/* ──────────────── HERO SECTION ──────────────── */

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        background: 'var(--color-bg-dark)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          y,
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '15%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          y,
        }}
      />

      {/* Stage count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 20px',
          borderRadius: 'var(--radius-xl)',
          background: '#ffffff',
          border: '1px solid rgba(5,150,105,0.25)',
          marginBottom: '32px',
          zIndex: 1,
        }}
      >
        <Sparkles size={16} color="#047857" />
        <span style={{ color: '#065f46', fontSize: '14px', fontWeight: 700 }}>٨ مراحل متكاملة</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          color: 'var(--color-text)',
          margin: '0 0 24px',
          lineHeight: 1.1,
          zIndex: 1,
          maxWidth: '900px',
        }}
      >
        رحلة المتبرع
        <br />
        <span
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          من العطاء إلى الأثر المستدام
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--color-text-muted)',
          maxWidth: '700px',
          lineHeight: 1.8,
          margin: '0 0 48px',
          zIndex: 1,
        }}
      >
        اكتشف كيف يتحول عطاؤك إلى أثر حقيقي. من لحظة الاكتشاف إلى الشراكة الدائمة،
        كل خطوة مصممة لضمان وصول أثرك إلى من يحتاجه.
      </motion.p>

      {/* Stage pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          maxWidth: '800px',
          zIndex: 1,
          marginBottom: '48px',
        }}
      >
        {[
          { icon: Search, label: 'اكتشاف', color: 'var(--color-primary)' },
          { icon: Target, label: 'اختيار', color: 'var(--color-primary)' },
          { icon: HandHeart, label: 'عطاء', color: 'var(--color-accent)' },
          { icon: BadgeCheck, label: 'تأكيد', color: 'var(--color-green-success)' },
          { icon: Bell, label: 'متابعة', color: 'var(--color-blue)' },
          { icon: BarChart3, label: 'أثر', color: 'var(--color-primary)' },
          { icon: RefreshCw, label: 'استمرارية', color: 'var(--color-amber)' },
          { icon: Crown, label: 'شراكة', color: 'var(--color-gold)' },
        ].map((s, i) => (
          <motion.a
            key={s.label}
            href={`#stage-${i + 1}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.05, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -2 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`stage-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.3s',
            }}
          >
            <s.icon size={14} color={s.color} />
            {s.label}
          </motion.a>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ zIndex: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ color: 'var(--color-text-dim)', fontSize: '12px' }}>اسحب للأسفل</span>
          <ChevronDown size={20} color="var(--color-text-dim)" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

/* ──────────────── FOOTER CTA ──────────────── */

function FooterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      style={{
        padding: '100px 24px',
        background: 'linear-gradient(135deg, var(--color-deep-green), var(--color-bg-dark))',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(5,150,105,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
          }}
        >
          <Heart size={32} color="var(--color-primary)" fill="var(--color-primary)" />
        </motion.div>

        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            color: 'var(--color-text)',
            margin: '0 0 16px',
            lineHeight: 1.2,
          }}
        >
          ابدأ رحلتك الآن
        </h2>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--color-text-muted)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}
        >
          كل رحلة عظيمة تبدأ بخطوة واحدة. اجعل خطوتك الأولى اليوم، وشاهد كيف يتحول عطاؤك إلى أثر يبقى.
        </p>

        <Link
          to="/smart-advisor"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 40px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(5,150,105,0.4)',
            transition: 'all 0.3s ease',
          }}
        >
          <Zap size={20} />
          ابدأ رحلتك الآن
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: Shield, text: 'آمن ١٠٠٪' },
            { icon: Clock, text: 'تبرع في ٣٠ ثانية' },
            { icon: MessageCircle, text: 'دعم فوري' },
          ].map((item) => (
            <div
              key={item.text}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <item.icon size={16} color="var(--color-text-dim)" />
              <span style={{ color: 'var(--color-text-dim)', fontSize: '14px' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ──────────────── MAIN PAGE ──────────────── */

const stages: StageData[] = [
  {
    id: 1,
    title: 'الاكتشاف',
    subtitle: 'افهم القضية قبل أن تتبرع',
    description:
      'قبل أن تقرر، نريدك أن تعرف. تصفح مشاريعنا، اقرأ قصص المستفيدين، وافهم أين يمكن أن يصل أثرك. المعرفة أساس كل تبرع حكيم.',
    icon: <Search size={28} color="var(--color-primary)" />,
    visual: (
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '8px 0', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <ProjectCardMockup delay={0} />
        <ProjectCardMockup delay={1} />
        <ProjectCardMockup delay={2} />
      </div>
    ),
    cta: { text: 'استكشف المشاريع', to: '/projects' },
    output: null,
    bgColor: 'linear-gradient(180deg, var(--color-bg-dark) 0%, #0a1628 100%)',
    accentColor: 'var(--color-primary)',
    glowColor: 'rgba(5,150,105,0.15)',
  },
  {
    id: 2,
    title: 'الاختيار',
    subtitle: 'اختر أثرك',
    description:
      'ليس كل مشروع يناسبك. اختر المجال الذي يلمس قلبك: تعليم، صحة، إغاثة، أو تنمية. نرشدك لاختيار يحقق أقصى أثر.',
    icon: <Target size={28} color="var(--color-primary)" />,
    visual: <CategoryMockup />,
    cta: { text: 'ابدأ الاختيار', to: '/smart-advisor' },
    output: null,
    bgColor: 'linear-gradient(180deg, #0a1628 0%, #0c1a2e 100%)',
    accentColor: 'var(--color-primary)',
    glowColor: 'rgba(5,150,105,0.1)',
  },
  {
    id: 3,
    title: 'العطاء',
    subtitle: 'تبرع في ٣ خطوات',
    description:
      'عملية بسيطة وسريعة وآمنة. اختر المبلغ، أدخل بياناتك، وأكمل الدفع. لا تعقيد، لا انتظار. تبرعك في طريقه.',
    icon: <HandHeart size={28} color="var(--color-accent)" />,
    visual: <CheckoutMockup />,
    cta: { text: 'تبرع الآن', to: '/donate' },
    output: null,
    bgColor: 'linear-gradient(180deg, #0c1a2e 0%, #1a1408 100%)',
    accentColor: 'var(--color-accent)',
    glowColor: 'rgba(217,119,6,0.12)',
  },
  {
    id: 4,
    title: 'التأكيد',
    subtitle: 'إثباتك جاهز',
    description:
      'لحظة التأكيد هي لحظة الالتزام. تتلقى إيصالًا رسميًا ورقمًا مرجعيًا يربطك بمشروعك إلى الأبد.',
    icon: <BadgeCheck size={28} color="var(--color-green-success)" />,
    visual: <ReceiptMockup />,
    cta: null,
    output: 'إيصال + رقم مرجعي',
    bgColor: 'linear-gradient(180deg, #1a1408 0%, #071a12 100%)',
    accentColor: 'var(--color-green-success)',
    glowColor: 'rgba(22,163,74,0.12)',
  },
  {
    id: 5,
    title: 'المتابعة',
    subtitle: 'نربطك بمشروعك',
    description:
      'لا ننساك بعد التبرع. تتلقى تحديثات شهرية عن تقدم المشروع، صور من الموقع، وأخبار المستفيدين مباشرة.',
    icon: <Bell size={28} color="var(--color-blue)" />,
    visual: <NotificationMockup />,
    cta: null,
    output: 'تحديثات شهرية',
    bgColor: 'linear-gradient(180deg, #071a12 0%, #0a1535 100%)',
    accentColor: 'var(--color-blue)',
    glowColor: 'rgba(37,99,235,0.1)',
  },
  {
    id: 6,
    title: 'الأثر',
    subtitle: 'شاهد نتائجك',
    description:
      'ال picture أقوى من الألف كلمة. شاهد صورًا قبل وبعد، إحصائيات حقيقية، وتقارير مفصلة عن أثرك الملموس.',
    icon: <BarChart3 size={28} color="var(--color-primary)" />,
    visual: <BeforeAfterMockup />,
    cta: null,
    output: 'صور + إحصائيات + تقارير',
    bgColor: 'linear-gradient(180deg, #0a1535 0%, #071a12 100%)',
    accentColor: 'var(--color-primary)',
    glowColor: 'rgba(5,150,105,0.1)',
  },
  {
    id: 7,
    title: 'الاستمرارية',
    subtitle: 'فرص جديدة في أفقك',
    description:
      'بناءً على اهتماماتك وتاريخك، نوصي لك بمشاريع جديدة تتناسب مع قيمك. عطاؤك يستمر، وأثرك يتضاعف.',
    icon: <RefreshCw size={28} color="var(--color-amber)" />,
    visual: <RecommendationMockup />,
    cta: null,
    output: 'توصيات مخصصة',
    bgColor: 'linear-gradient(180deg, #071a12 0%, #1a1408 100%)',
    accentColor: 'var(--color-amber)',
    glowColor: 'rgba(217,119,6,0.1)',
  },
  {
    id: 8,
    title: 'الشراكة',
    subtitle: 'ارتقِ بعطائك',
    description:
      'لمن يتخطى التبرع العادي. انضم لبرنامج الشركاء واحصل على وصول حصصي، زيارات ميدانية، ودور في صنع القرار.',
    icon: <Crown size={28} color="var(--color-gold)" />,
    visual: <VIPMockup />,
    cta: null,
    output: 'شريك في الرؤية',
    bgColor: 'linear-gradient(180deg, #1a1408 0%, #0c1a15 100%)',
    accentColor: 'var(--color-gold)',
    glowColor: 'rgba(202,138,4,0.1)',
  },
];

export default function DonorJourneyPage() {
  return (
    <div dir="rtl" style={{ ...variables, fontFamily: "'Noto Kufi Arabic', 'Noto Sans Arabic', 'Cairo', sans-serif" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--color-bg-dark);
          color: var(--color-text);
          font-family: 'Noto Kufi Arabic', 'Noto Sans Arabic', 'Cairo', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--color-bg-darker); }
        ::-webkit-scrollbar-thumb { background: var(--color-surface-light); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }
        a { transition: all 0.3s ease; }
        a:hover { opacity: 0.9; }
        @media (max-width: 768px) {
          .timeline-nav { display: none !important; }
        }
        @media (max-width: 900px) {
          section > div > div {
            flex-direction: column !important;
            text-align: center !important;
          }
          section > div > div > div:first-child {
            align-items: center !important;
          }
        }
      `}</style>

      {/* Fixed Timeline Nav */}
      <div className="timeline-nav" style={{ display: 'block' }}>
        <TimelineNav />
      </div>

      {/* Hero */}
      <HeroSection />

      {/* Stage Sections */}
      {stages.map((stage, index) => (
        <div key={stage.id}>
          <ConnectorLine />
          <StageSection stage={stage} index={index} />
        </div>
      ))}

      {/* Final Connector */}
      <ConnectorLine />

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
