// Site Loader - موجه الموقع الاحترافي مع الرسائل الترحيبية ومؤشر التقدم الذكي
// Professional Site Loader with Welcome Messages and Smart Progress
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Shield, Zap, SkipForward } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface SiteLoaderProps {
  readonly onComplete: () => void;
}

// رسائل الترحيب المتقدمة
const WELCOME_MESSAGES = [
  { text: "مرحباً بك في رحماء بينهم", icon: Heart, color: "#10B981" },
  { text: "نحملك رحابة الخير والعطاء", icon: Sparkles, color: "#F59E0B" },
  { text: "حملة دعوية إنسانية تنموية منذ 2014", icon: Shield, color: "#3B82F6" },
  { text: "جاري التحضير لتجربة مميزة...", icon: Zap, color: "#8B5CF6" },
];

// Skip button component
const SkipButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium"
    aria-label="تخطي شاشة التحميل"
  >
    <SkipForward className="w-4 h-4" />
    تخطي
  </button>
);

export function SiteLoader({ onComplete }: SiteLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate deterministic progress increment based on remaining time to reach 100%
      // This avoids using Math.random() which SonarQube flags as potentially unsafe
      const remainingProgress = 100 - progress;
      const increment = Math.min(remainingProgress * 0.2 + 2, 18); // Dynamic increment (2-18%)
      const newProgress = Math.min(progress + increment, 100);
      setProgress(newProgress);

      // تغيير الرسالة كل 20%
      const nextStepThreshold = (currentStep + 1) * 20;
      if (newProgress >= nextStepThreshold && currentStep < WELCOME_MESSAGES.length - 1) {
        setCurrentStep(Math.min(currentStep + 1, WELCOME_MESSAGES.length - 1));
      }

      // إكمال التحميل
      if (newProgress >= 100) {
        clearInterval(timer);
        setIsComplete(true);
        setTimeout(onComplete, 600);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [progress, currentStep, onComplete]);

  const currentMessage = WELCOME_MESSAGES[currentStep];
  const Icon = currentMessage.icon;

  // دالة تحديد فئة النقطة بناءً على الحالة
  const getDotClassName = (index: number): string => {
    if (index === currentStep) {
      return "bg-[var(--brand-gold)] w-12 scale-125";
    }
    if (index < currentStep) {
      return "bg-emerald-400";
    }
    return "bg-white/20";
  };

  // دالة التخطي السريع
  const handleSkip = useCallback(() => {
    setIsComplete(true);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0a2e1f 0%, #0F4C3A 30%, #0d3b2a 60%, #0a2e1f 100%)",
            backgroundSize: "400% 400%",
          }}
        >
          {/* خلفية متحركة */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,215,0,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16,185,129,0.1) 0%, transparent 50%)
              `,
            }}
          />

          {/* زر التخطي */}
          <SkipButton onClick={handleSkip} />

          <div className="text-center max-w-lg mx-auto px-6 z-10" dir="rtl">
            {/* شعار المؤسسة مع فيديو تحفيزي */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="relative w-32 h-32 mx-auto mb-10"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Heart className="w-16 h-16 text-white animate-pulse" fill="white" />
              </div>

              {/* تأثير الضوء المتحرك */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--brand-gold)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-4 rounded-full border border-[var(--brand-gold)]/30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* الرسالة الحالية */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <Icon className="w-8 h-8" style={{ color: currentMessage.color }} />
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                  {currentMessage.text}
                </h2>
              </div>
            </motion.div>

            {/* شريط التقدم الذكي */}
            <div className="relative mb-8">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, var(--brand-gold), var(--brand-green), var(--brand-gold))",
                    boxShadow: "0 0 25px rgba(16, 185, 129, 0.6)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* توهج متحرك */}
                  <motion.div
                    className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "400%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>

              <div className="mt-4 flex items-center justify-between text-white/70 text-sm font-medium">
                <span>جاري التحميل...</span>
                <span className="tabular-nums">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* نقاط التحميل المحسنة */}
            <div className="flex justify-center gap-2 mb-8">
              {WELCOME_MESSAGES.map((message, index) => {
                const isActive = index === currentStep;
                return (
                  <motion.div
                    key={message.text}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${getDotClassName(index)}`}
                    animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                );
              })}
            </div>

            {/* رسالة ترحيبية إضافية */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/50 text-sm italic"
            >
              وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا - الآية الكربلائية
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
