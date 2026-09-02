import React from "react";
import { motion } from "motion/react";
import {
  RefreshCw,
  Calendar,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export type DonationFrequency = "once" | "monthly" | "yearly";

interface RecurringDonationToggleProps {
  frequency: DonationFrequency;
  onChange: (freq: DonationFrequency) => void;
  amount?: number;
  currencySymbol?: string;
  className?: string;
}

export function RecurringDonationToggle({
  frequency,
  onChange,
  amount,
  currencySymbol = "ر.س",
  className = "",
}: RecurringDonationToggleProps) {
  const options = [
    {
      id: "once" as DonationFrequency,
      label: "مرة واحدة",
      subtitle: "تبرع فوري مخصص",
      badge: null,
      icon: HeartHandshake,
    },
    {
      id: "monthly" as DonationFrequency,
      label: "دوري شهري",
      subtitle: "أجر متجدد كل شهر",
      badge: "الأكثر أثراً",
      icon: Calendar,
    },
    {
      id: "yearly" as DonationFrequency,
      label: "دوري سنوي",
      subtitle: "كفالة واستدامة سنوية",
      badge: "استدامة شاملة",
      icon: Sparkles,
    },
  ];

  return (
    <div className={`w-full font-cairo dir-rtl ${className}`}>
      {/* Header Label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[var(--brand-green)] flex items-center justify-center font-bold">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-none">
              نوع ودورية التبرع
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              اختر بين العطاء الفوري أو الاستقطاع الدوري المستمر
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#8F6A1A] border border-amber-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
          <span>صدقة جارية مستدامة</span>
        </span>
      </div>

      {/* Toggle Segmented Control */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 relative">
        {options.map((opt) => {
          const isActive = frequency === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative py-3.5 px-2 sm:px-4 rounded-xl text-right transition-all duration-300 cursor-pointer flex flex-col items-center sm:items-start justify-center gap-1 border ${
                isActive
                  ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)] shadow-md"
                  : "bg-white/60 hover:bg-white text-slate-700 border-transparent hover:border-slate-200"
              }`}
            >
              {/* Top Badge */}
              {opt.badge && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full mb-0.5 ${
                    isActive
                      ? "bg-[var(--brand-gold)] text-slate-950"
                      : "bg-emerald-100 text-[var(--brand-green)]"
                  }`}
                >
                  {opt.badge}
                </span>
              )}

              <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--brand-gold)]" : "text-slate-500"}`}
                />
                <span>{opt.label}</span>
              </div>

              <span
                className={`text-[11px] font-medium hidden sm:block ${
                  isActive ? "text-emerald-100" : "text-slate-500"
                }`}
              >
                {opt.subtitle}
              </span>

              {isActive && (
                <CheckCircle2 className="w-4 h-4 text-[var(--brand-gold)] absolute top-2.5 left-2.5 hidden sm:block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Info Banner for Recurring Donations */}
      {frequency !== "once" && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-sm text-[var(--brand-green)] flex items-center gap-1.5">
              <span>
                {frequency === "monthly"
                  ? "الاشتراك الدوري الشهري (صدقة جارية)"
                  : "الاشتراك الدوري السنوي (كفالة مستدامة)"}
              </span>
              {amount && amount > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 text-[var(--brand-green)] font-black text-xs">
                  {amount.toLocaleString("ar-SA")} {currencySymbol} /{" "}
                  {frequency === "monthly" ? "شهرياً" : "سنوياً"}
                </span>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed">
              سيتم الاستقطاع الآمن والتلقائي عبر قناة الدفع المعتمدة كل{" "}
              {frequency === "monthly" ? "شهر" : "سنة"}. يمكنك التحكم الكامل أو إيقاف الاشتراك في أي
              وقت بنقرة واحدة من حساب المتبرع.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RecurringDonationToggle;
