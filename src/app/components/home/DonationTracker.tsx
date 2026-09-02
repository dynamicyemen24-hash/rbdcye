// Donation Tracker - تتبع رحلة التبرع
import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Check, Clock, MapPin, Users, Package, Droplets, BookOpen } from "lucide-react";

interface DonationStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending";
  date?: string;
}

const DONATION_STEPS: DonationStep[] = [
  {
    id: 1,
    title: "تم استلام التبرع",
    description: "تم استلام تبرعك بنجاح وتسجيله في النظام",
    icon: <Heart className="w-5 h-5" />,
    status: "completed",
    date: "اليوم",
  },
  {
    id: 2,
    title: "جاري المعالجة",
    description: "يتم مراجعة التبرع وتحويله للبرنامج المناسب",
    icon: <Clock className="w-5 h-5" />,
    status: "current",
  },
  {
    id: 3,
    title: "وصل للمستفيد",
    description: "تم توصيل التبرع للfamily المستحقة",
    icon: <Users className="w-5 h-5" />,
    status: "pending",
  },
  {
    id: 4,
    title: "أثر حقيقي",
    description: "ستتلقى صورة أو قصة عن الأثر الذي أحدثه تبرعك",
    icon: <Check className="w-5 h-5" />,
    status: "pending",
  },
];

const IMPACT_CATEGORIES = [
  { icon: Package, label: "سلال غذائية", count: "آلاف", color: "#DC2626" },
  { icon: Droplets, label: "آبار مياه", count: "عشرات", color: "#2563EB" },
  { icon: BookOpen, label: "طلاب مكفولين", count: "آلاف", color: "#7C3AED" },
  { icon: Users, label: "أسر مستفيدة", count: "عشرات آلاف", color: "#059669" },
];

interface DonationTrackerProps {
  onDonate: () => void;
}

export function DonationTracker({ onDonate }: DonationTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <div className="space-y-6">
      {/* Donation Journey */}
      <div className="bg-white rounded-3xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          رحلة تبرعك
        </h3>

        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-0 bottom-0 right-6 w-0.5 bg-gray-100" />
          <div
            className="absolute top-0 right-6 w-0.5 bg-[var(--brand-green)] transition-all duration-500"
            style={{ height: "33%" }}
          />

          <div className="space-y-6">
            {DONATION_STEPS.map((step) => (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Step indicator */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    step.status === "completed"
                      ? "bg-[var(--brand-green)] text-white"
                      : step.status === "current"
                        ? "bg-[var(--brand-gold)] text-white animate-pulse"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-bold text-sm ${
                        step.status === "completed"
                          ? "text-[var(--brand-green)]"
                          : step.status === "current"
                            ? "text-[var(--brand-gold)]"
                            : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.date && <span className="text-xs text-gray-400">{step.date}</span>}
                  </div>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Categories */}
      <div className="bg-white rounded-3xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          إلى أين يذهب تبرعك
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {IMPACT_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(i)}
              className={`p-4 rounded-2xl text-right transition-all ${
                selectedCategory === i
                  ? "bg-[var(--brand-green-pale)] border-2 border-[var(--brand-green)]"
                  : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>
              <p className="font-bold text-sm text-[var(--foreground)]">{cat.label}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{cat.count} مستفيد</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDonate}
        className="w-full py-4 rounded-2xl bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 text-white font-bold text-lg shadow-lg shadow-[var(--brand-green)]/25 flex items-center justify-center gap-3"
      >
        <Heart className="w-5 h-5" fill="white" />
        ابدأ رحلة التبرع الآن
      </motion.button>
    </div>
  );
}
