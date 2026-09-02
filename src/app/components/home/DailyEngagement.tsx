// Daily Engagement Widget - الذكر اليومي والتذكير بالخير
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Share2, Copy, Check, Sparkles, Clock, Bell, X } from "lucide-react";

const DAILY_VERSES = [
  {
    text: "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
    ref: "المائدة: 32",
    action: "aktah.exe",
  },
  {
    text: "وَمَن تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ",
    ref: "البقرة: 158",
    action: "share",
  },
  { text: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", ref: "هود: 115", action: "donate" },
  {
    text: "وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ",
    ref: "المزمل: 20",
    action: "share",
  },
  {
    text: "مَّن جَاءَ بِالْحَسَنَةِ فَلَهُ عَشْرُ أَمْثَالِهَا",
    ref: "الأنعام: 160",
    action: "donate",
  },
  {
    text: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    ref: "الترمذي",
    action: "share",
  },
  {
    text: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
    ref: "البقرة: 222",
    action: "donate",
  },
];

const DAILY_ACTIONS = [
  { time: "06:00", label: "صبح بالخير", icon: "🌅", message: "ابدأ يومك بصدقة" },
  { time: "12:00", label: "暂停 و تذكر", icon: "☀️", message: "هل تبرعت اليوم؟" },
  { time: "18:00", label: "مساء الخير", icon: "🌙", message: ".randrange opportunity" },
];

interface DailyEngagementProps {
  onDonate: () => void;
}

export function DailyEngagement({ onDonate }: DailyEngagementProps) {
  const [verse, setVerse] = useState(DAILY_VERSES[0]);
  const [copied, setCopied] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDate() % DAILY_VERSES.length;
    setVerse(DAILY_VERSES[dayIndex]);

    // Check streak from localStorage
    const savedStreak = localStorage.getItem("rh_daily_streak");
    const lastVisit = localStorage.getItem("rh_last_visit");
    const todayStr = today.toDateString();

    if (lastVisit === todayStr) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1);
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1;
        setStreak(newStreak);
        localStorage.setItem("rh_daily_streak", String(newStreak));
        localStorage.setItem("rh_last_visit", todayStr);
      } else {
        setStreak(1);
        localStorage.setItem("rh_daily_streak", "1");
        localStorage.setItem("rh_last_visit", todayStr);
      }
    }

    // Show reminder at noon
    const hour = today.getHours();
    if (hour >= 12 && hour < 14) {
      setShowReminder(true);
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`${verse.text} - ${verse.ref}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [verse]);

  const handleShare = useCallback(async () => {
    const text = `${verse.text}\n\n${verse.ref}\n\n🕌 رحماء بينهم - rbdcye.org`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // Sharing can be cancelled by the user without requiring an error state.
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [verse]);

  return (
    <>
      {/* Daily Verse Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-dark)] p-6 md:p-8 text-white"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10 pattern-khatam-white pointer-events-none" />

        {/* Streak badge */}
        {streak > 1 && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--brand-gold)]/20 backdrop-blur-sm border border-[var(--brand-gold)]/30">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-[var(--brand-gold-light)]">{streak} أيام</span>
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--brand-gold-light)]" />
            <span className="text-sm font-bold text-white/80">ذكر اليوم</span>
          </div>

          {/* Verse */}
          <blockquote
            className="text-xl md:text-2xl font-bold leading-relaxed mb-3"
            style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
          >
            {verse.text}
          </blockquote>
          <cite className="text-sm text-white/60 not-italic">— {verse.ref}</cite>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDonate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-gold)] text-white font-bold text-sm shadow-lg shadow-[var(--brand-gold)]/25"
            >
              <Heart className="w-4 h-4" fill="white" />
              تبرع الآن
            </motion.button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              title="مشاركة الآية"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              title="نسخ الآية"
            >
              {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Noon Reminder */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
            dir="rtl"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-green-pale)] flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-[var(--brand-green)]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm mb-1">تذكير بالخير</h4>
                <p className="text-gray-600 text-xs mb-3">
                  هل تبرعت اليوم؟ كل ريال يصل إلى من يحتاجه
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onDonate();
                      setShowReminder(false);
                    }}
                    className="flex-1 py-2 rounded-lg bg-[var(--brand-green)] text-white text-xs font-bold"
                  >
                    تبرع الآن
                  </button>
                  <button
                    onClick={() => setShowReminder(false)}
                    className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold"
                  >
                    لاحقاً
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowReminder(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
