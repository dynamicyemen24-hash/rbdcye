// Advanced Page Progress Tracker with smooth animations
import { useSpring } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';

export type ProgressStage = 'loading' | 'ready' | 'interactive' | 'complete';

// Smart loading messages based on context
const LOADING_MESSAGES: Record<string, string[]> = {
  default: ['جاري تحميل المحتوى...', 'تجهيز البيانات...', 'تحسين التجربة...', 'محتوى جاهز ✓'],
  hero: ['تشغيل الفيديو...', 'تحميل الخلفية...', 'تجهيز العناصر...', 'أهلاً بك ✓'],
  programs: ['جلب المشاريع...', 'تحليل البيانات...', 'تحديث الإحصائيات...', 'البرامج جاهزة ✓'],
  news: ['تحميل الأخبار...', 'تحديث المصادر...', 'ترتيب المحتوى...', 'آخر الأخبار ✓'],
  donations: ['تجهيز بوابة الدفع...', 'تأمين الاتصال...', 'تحضير النماذج...', 'التبرع جاهز ✓'],
  admin: ['تحميل لوحة التحكم...', 'جلب البيانات...', 'تحديث الإحصائيات...', 'لوحة التحكم جاهزة ✓'],
  stories: ['جلب قصص النجاح...', 'تحليل التأثير...', 'ترتيب القصص...', 'قصص ملهمة ✓'],
  partners: ['جلب الشراكات...', 'تحديث البيانات...', 'جاهز للعرض...', 'الشركاء ✓'],
  media: ['تحميل الوسائط...', 'معالجة الصور...', 'تجهيز المعرض...', 'المكتبة جاهزة ✓'],
  contact: ['تجهيز نموذج التواصل...', 'تأمين الاتصال...', 'جاهز للإرسال...', 'تواصل معنا ✓'],
};

function getMessages(key: string): string[] {
  return LOADING_MESSAGES[key] || LOADING_MESSAGES.default;
}

export function usePageProgress(pageKey: string = 'default') {
  const [stage, setStage] = useState<ProgressStage>('loading');
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = getMessages(pageKey);

  // Smooth percentage spring
  const springPercentage = useSpring(0, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    const phases = [
      { target: 30, time: 600, label: 0 },
      { target: 60, time: 400, label: 1 },
      { target: 85, time: 500, label: 2 },
      { target: 100, time: 500, label: 3 },
    ];

    let currentPhase = 0;
    const timers: NodeJS.Timeout[] = [];

    const runPhase = () => {
      if (currentPhase >= phases.length) {
        setStage('ready');
        return;
      }

      const phase = phases[currentPhase];
      springPercentage.set(phase.target);
      setMessageIndex(phase.label);

      const timer = setTimeout(() => {
        currentPhase++;
        runPhase();
      }, phase.time);
      timers.push(timer);
    };

    runPhase();

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [pageKey, springPercentage]);

  const markInteractive = useCallback(() => {
    setStage('interactive');
    springPercentage.set(100);
    setMessageIndex(messages.length - 1);
    setTimeout(() => setStage('complete'), 500);
  }, [messages.length, springPercentage]);

  return {
    stage,
    percentage: springPercentage,
    message: messages[Math.min(messageIndex, messages.length - 1)],
    markInteractive,
    isComplete: stage === 'complete',
    isReady: stage === 'ready' || stage === 'interactive' || stage === 'complete',
  };
}

