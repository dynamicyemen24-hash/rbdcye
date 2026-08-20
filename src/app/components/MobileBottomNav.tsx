import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Heart, BookOpen, User, Grid } from "lucide-react";
import { motion } from "motion/react";

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "الرئيسية", path: "/", icon: Home },
    { id: "donate", label: "تبرع", path: "/donate", icon: Heart, highlight: true },
    { id: "programs", label: "المشاريع", path: "/programs", icon: BookOpen },
    { id: "all", label: "القائمة", path: "/projects", icon: Grid },
    { id: "profile", label: "حسابي", path: "/donor", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[var(--border)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2" dir="rtl">
      <nav aria-label="شريط التصفح السفلي" className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
                aria-label="الانتقال لصفحة التبرع السريع للمشاريع الإغاثية"
              >
                <motion.div 
                  whileTap={{ scale: 0.92 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[var(--brand-green)] to-[var(--brand-green-light)] text-white shadow-lg flex items-center justify-center border-4 border-[var(--background)]"
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <span className="text-[11px] font-bold text-[var(--brand-green)] mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors duration-200 ${
                active 
                  ? "text-[var(--brand-green)] font-bold" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
              aria-label={`الانتقال إلى صفحة ${item.label}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
                {active && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--brand-green)]" 
                  />
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
