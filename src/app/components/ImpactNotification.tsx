// ImpactNotification - Smart notification system for donors
import { X, Gift, Heart, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface ImpactNotificationProps {
  readonly setCurrentPage?: (page: string) => void;
}

// Sample impact updates - in production this would come from database
const IMPACT_UPDATES = [
  {
    id: 1,
    title: "تحديث أثر التبرع",
    message: "بفضل تبرعك لمشروع الآبار، تم اليوم ضخ المياه في قرية صعدة الجافة",
    icon: Gift,
    time: "قبل 2 ساعة",
    project: "حفر الآبار",
    beneficiaries: "+342 مستفيد",
  },
  {
    id: 2,
    title: "قصة نجاح جديدة",
    message: "عائلة في تعز تحققت نتيجة مشروع الكسوة الشتوية",
    icon: Heart,
    time: "أمس",
    project: "الكسوة",
    beneficiaries: "+15 أسرة",
  },
  {
    id: 3,
    title: "إنجاز جديد",
    message: "تم إكمال بناء مسجد في حجة بفضل كفالتكم",
    icon: Users,
    time: "قبل 3 أيام",
    project: "بناء المساجد",
    beneficiaries: "+500 مستفيد",
  },
];

export function ImpactNotification({ setCurrentPage = () => {} }: ImpactNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Show notification after 5 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    // Auto-rotate notifications
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMPACT_UPDATES.length);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const currentUpdate = IMPACT_UPDATES[currentIndex];
  const Icon = currentUpdate.icon;

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 max-w-sm">
      <div className="bg-white rounded-xl shadow-lg border border-[var(--border)] p-4 animate-slideIn">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-green-pale)] flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-[var(--brand-green)]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-[var(--foreground)] text-sm">
                {currentUpdate.title}
              </h4>
              <button
                onClick={() => setVisible(false)}
                className="p-1 rounded-full hover:bg-[var(--muted)] transition-colors"
              >
                <X className="w-3 h-3 text-[var(--muted-foreground)]" />
              </button>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-2">
              {currentUpdate.message}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--brand-green)] font-medium">
                {currentUpdate.project}
              </span>
              <span className="text-[var(--muted-foreground)]">
                {currentUpdate.time}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentPage("transparency");
            setVisible(false);
          }}
          className="w-full mt-3 py-1.5 text-xs text-center text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)] rounded-lg transition-colors"
        >
          عرض جميع الإنجازات
        </button>
      </div>
    </div>
  );
}

// Toast hook for notifications
export function useImpactNotification() {
  const [notification, setNotification] = useState<{
    id: string;
    title: string;
    message: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  const showNotification = (title: string, message: string, type: "success" | "info" | "warning" = "info") => {
    setNotification({
      id: Date.now().toString(),
      title,
      message,
      type,
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return { notification, showNotification };
}

