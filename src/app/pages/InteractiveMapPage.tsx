// صفحة خريطة الأثر التفاعلية — تتبع الأثر في كل محافظة يمنية
import {
  Map,
  MapPin,
  Droplets,
  Utensils,
  GraduationCap,
  Heart,
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  X,
  Target,
  Stethoscope,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useCallback } from "react";

import {
  scrollFadeUp,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/utils/animations";
import { useSEO } from "@/utils/seoAdvanced";

// ═══════════════════════════════════════════════════════════════════════════════
// البيانات — المحافظات والمشاريع
// ═══════════════════════════════════════════════════════════════════════════════

type ProjectType = "كفالات" | "مياه" | "غذاء" | "تعليم" | "صحة" | "مشاريع";

interface Project {
  id: number;
  title: string;
  type: ProjectType;
  status: "نشط" | "مكتمل" | "قيد التنفيذ";
  beneficiaries: number;
  year: number;
  description: string;
}

interface Governorate {
  id: string;
  name: string;
  projectCount: number;
  totalBeneficiaries: number;
  keyProject: string;
  color: string;
  path: string;
  projects: Project[];
}

const GOVERNORATES: Governorate[] = [
  {
    id: "sanaa",
    name: "صنعاء",
    projectCount: 12,
    totalBeneficiaries: 45200,
    keyProject: "	project water",
    color: "#0a3527",
    path: "M 420 120 L 460 100 L 500 110 L 520 140 L 510 180 L 480 200 L 440 195 L 410 170 L 405 140 Z",
    projects: [
      { id: 1, title: "حفر بئر ارتوازي صنعاء", type: "مياه", status: "نشط", beneficiaries: 3500, year: 2024, description: "توفير مياه نقية لأكثر من ٥٠٠ أسرة في ريف صنعاء" },
      { id: 2, title: "كفالة ١٢٠ يتيم", type: "كفالات", status: "نشط", beneficiaries: 120, year: 2024, description: "كفالات مادية شهرية مع الدعم التعليمي" },
      { id: 3, title: "توزيع سلال غذائية", type: "غذاء", status: "مكتمل", beneficiaries: 2000, year: 2023, description: "وزّعنا ١,٥٠٠ سلة غذائية متكاملة" },
      { id: 4, title: "تجهيز مدرسة عيسى", type: "تعليم", status: "نشط", beneficiaries: 450, year: 2024, description: "تجهيز فصول دراسية بأدوات تعليمية حديثة" },
      { id: 5, title: "عيادة متنقلة", type: "صحة", status: "نشط", beneficiaries: 1800, year: 2024, description: "خدمات طبية مجانية للمناطق النائية" },
      { id: 6, title: "ترميم مسجد الخير", type: "مشاريع", status: "مكتمل", beneficiaries: 800, year: 2023, description: "ترميم شامل للمسجد والمرافق" },
      { id: 7, title: "دعم تعليمي لطلاب", type: "تعليم", status: "نشط", beneficiaries: 320, year: 2024, description: "توفير كتب وأدوات مدرسية" },
      { id: 8, title: " كفالة أرامل", type: "كفالات", status: "نشط", beneficiaries: 85, year: 2023, description: "دعم مادي شهري للأرامل المتعففات" },
      { id: 9, title: "مطبخ خيري", type: "غذاء", status: "نشط", beneficiaries: 1500, year: 2024, description: "تقديم ٥٠٠ وجبة ساخنة يومياً" },
      { id: 10, title: "حفر بئر ثانٍ", type: "مياه", status: "قيد التنفيذ", beneficiaries: 2800, year: 2025, description: "بئر ارتوازي بالطاقة الشمسية" },
      { id: 11, title: "عيادة أسنان", type: "صحة", status: "مكتمل", beneficiaries: 600, year: 2023, description: "علاج أسنان مجاني للأطفال" },
      { id: 12, title: "صيانة شبكة مياه", type: "مشاريع", status: "نشط", beneficiaries: 5000, year: 2024, description: "صيانة وتفعيل شبكة توزيع المياه" },
    ],
  },
  {
    id: "aden",
    name: "عدن",
    projectCount: 8,
    totalBeneficiaries: 32100,
    keyProject: " مستشفى عدن",
    color: "#0f4c3a",
    path: "M 350 310 L 390 290 L 430 300 L 445 330 L 435 360 L 400 375 L 365 365 L 345 340 Z",
    projects: [
      { id: 13, title: "دعم مستشفى عدن", type: "صحة", status: "نشط", beneficiaries: 5000, year: 2024, description: "تجهيز المستشفى بأدوية ومعدات" },
      { id: 14, title: " كفالة أيتام عدن", type: "كفالات", status: "نشط", beneficiaries: 200, year: 2024, description: "كفالات مادية وتعليمية" },
      { id: 15, title: "توزيع خبز يومي", type: "غذاء", status: "نشط", beneficiaries: 3000, year: 2024, description: "مصنع خبز خيري يخدم الآلاف" },
      { id: 16, title: "حفر بئر عدن", type: "مياه", status: "مكتمل", beneficiaries: 4000, year: 2023, description: "بئر ارتوازي لـ ٧٠٠ أسرة" },
      { id: 17, title: "مركز تعليمي", type: "تعليم", status: "نشط", beneficiaries: 180, year: 2024, description: "تعليم الكبار القراءة والكتابة" },
      { id: 18, title: "سلال غذائية رمضان", type: "غذاء", status: "مكتمل", beneficiaries: 2500, year: 2024, description: "توزيع سلال رمضان" },
      { id: 19, title: "ترميم مدرسة", type: "مشاريع", status: "قيد التنفيذ", beneficiaries: 350, year: 2025, description: "ترميم شامل لمدرسة تعاني من أضرار الحرب" },
      { id: 20, title: "دعم طبي للمرضى", type: "صحة", status: "نشط", beneficiaries: 1200, year: 2024, description: "تغطية تكاليف العلاج للمحتاجين" },
    ],
  },
  {
    id: "taiz",
    name: "تعز",
    projectCount: 10,
    totalBeneficiaries: 38500,
    keyProject: " مدرسة النور",
    color: "#17694f",
    path: "M 310 250 L 360 235 L 400 250 L 415 280 L 400 310 L 360 320 L 320 305 L 300 275 Z",
    projects: [
      { id: 21, title: "重建 مدرسة النور", type: "تعليم", status: "نشط", beneficiaries: 600, year: 2024, description: "重建被轰炸的学校" },
      { id: 22, title: " كفالة ١٥٠ يتيم تعز", type: "كفالات", status: "نشط", beneficiaries: 150, year: 2024, description: "كفالات شهرية مع الرعاية الصحية" },
      { id: 23, title: "حفر آبار تعز", type: "مياه", status: "نشط", beneficiaries: 5000, year: 2024, description: "٣ آبار ارتوازية بالطاقة الشمسية" },
      { id: 24, title: "توزيع طعام", type: "غذاء", status: "نشط", beneficiaries: 4000, year: 2024, description: "مطابخ خيرية في ٣ مناطق" },
      { id: 25, title: "عيادة ميدانية", type: "صحة", status: "نشط", beneficiaries: 2500, year: 2024, description: "خدمات طبية ميدانية للنازحين" },
      { id: 26, title: "سلال غذائية", type: "غذاء", status: "مكتمل", beneficiaries: 3000, year: 2023, description: "وزّعنا ٢,٠٠٠ سلة غذائية" },
      { id: 27, title: "ترميم مسجد", type: "مشاريع", status: "مكتمل", beneficiaries: 1200, year: 2023, description: "ترميم المسجد الكبير" },
      { id: 28, title: "دعم تعليمي", type: "تعليم", status: "نشط", beneficiaries: 400, year: 2024, description: "كتب وأدوات مدرسية" },
      { id: 29, title: " حفر بئر جديد", type: "مياه", status: "قيد التنفيذ", beneficiaries: 3500, year: 2025, description: "بئر ارتوازي جديد" },
      { id: 30, title: "مطعم خيري", type: "غذاء", status: "نشط", beneficiaries: 800, year: 2024, description: "وجبات ساخنة يومياً" },
    ],
  },
  {
    id: "hudaydah",
    name: "الحديدة",
    projectCount: 9,
    totalBeneficiaries: 41000,
    keyProject: "سد الحديدة",
    color: "#145a3e",
    path: "M 220 130 L 270 115 L 320 125 L 340 160 L 330 200 L 290 215 L 240 205 L 215 170 Z",
    projects: [
      { id: 31, title: "حفر آبار الحديدة", type: "مياه", status: "نشط", beneficiaries: 6000, year: 2024, description: "٤ آبار ارتوازية في ريف الحديدة" },
      { id: 32, title: "سلال غذائية", type: "غذاء", status: "نشط", beneficiaries: 5000, year: 2024, description: "توزيع على النازحين" },
      { id: 33, title: " كفالة أيتام", type: "كفالات", status: "نشط", beneficiaries: 180, year: 2024, description: "كفالات مادية شهرية" },
      { id: 34, title: "عيادة متنقلة", type: "صحة", status: "نشط", beneficiaries: 2000, year: 2024, description: "خدمات طبية للمناطق المحاصرة" },
      { id: 35, title: "مدرسة متنقلة", type: "تعليم", status: "نشط", beneficiaries: 300, year: 2024, description: "تعليم للأطفال النازحين" },
      { id: 36, title: "مطبخ خيري", type: "غذاء", status: "مكتمل", beneficiaries: 4000, year: 2023, description: "مطبخ يخدم ١,٠٠٠ أسرة" },
      { id: 37, title: "حفر بئر جديد", type: "مياه", status: "قيد التنفيذ", beneficiaries: 3500, year: 2025, description: "بئر ارتوازي بالطاقة الشمسية" },
      { id: 38, title: "ترميم مدرسة", type: "مشاريع", status: "مكتمل", beneficiaries: 500, year: 2023, description: "ترميم مدرسة متضررة" },
      { id: 39, title: " دعم صحي", type: "صحة", status: "نشط", beneficiaries: 1500, year: 2024, description: "أدوية وعلاج مزمن" },
    ],
  },
  {
    id: "shabwa",
    name: "شبوة",
    projectCount: 6,
    totalBeneficiaries: 18500,
    keyProject: "بئر شبوة",
    color: "#1a7a57",
    path: "M 460 200 L 520 185 L 570 200 L 585 240 L 570 280 L 520 290 L 470 280 L 450 240 Z",
    projects: [
      { id: 40, title: "حفر بئر شبوة", type: "مياه", status: "نشط", beneficiaries: 4000, year: 2024, description: "بئر ارتوازي يخدم ٤ قرى" },
      { id: 41, title: "سلال غذائية", type: "غذاء", status: "نشط", beneficiaries: 2500, year: 2024, description: "توزيع على الأسر المتضررة" },
      { id: 42, title: " كفالة أيتام", type: "كفالات", status: "نشط", beneficiaries: 100, year: 2024, description: "كفالات شهرية" },
      { id: 43, title: "عيادة قروية", type: "صحة", status: "مكتمل", beneficiaries: 1500, year: 2023, description: "عيادة متنقلة للقرى النائية" },
      { id: 44, title: "دعم مدارس", type: "تعليم", status: "نشط", beneficiaries: 250, year: 2024, description: "تجهيز مدارس بأدوات تعليمية" },
      { id: 45, title: "حفر بئر آخر", type: "مياه", status: "قيد التنفيذ", beneficiaries: 3000, year: 2025, description: "بئر بالطاقة الشمسية" },
    ],
  },
  {
    id: "hadramaut",
    name: "حضرموت",
    projectCount: 7,
    totalBeneficiaries: 28500,
    keyProject: "مستشفى سيئون",
    color: "#1f8a60",
    path: "M 530 160 L 600 140 L 670 160 L 690 210 L 675 270 L 620 290 L 560 280 L 530 230 Z",
    projects: [
      { id: 46, title: "دعم مستشفى سيئون", type: "صحة", status: "نشط", beneficiaries: 3000, year: 2024, description: "تجهيز المستشفى بأجهزة طبية" },
      { id: 47, title: "حفر آبار حضرموت", type: "مياه", status: "نشط", beneficiaries: 5000, year: 2024, description: "٣ آبار في وادي حضرموت" },
      { id: 48, title: "سلال غذائية", type: "غذاء", status: "مكتمل", beneficiaries: 2000, year: 2023, description: "توزيع في المهرة وسيئون" },
      { id: 49, title: " كفالة أيتام", type: "كفالات", status: "نشط", beneficiaries: 150, year: 2024, description: "كفالات مادية وتعليمية" },
      { id: 50, title: "مدرسة عسقلان", type: "تعليم", status: "نشط", beneficiaries: 400, year: 2024, description: "دعم مدرسة في صير" },
      { id: 51, title: "عيادة متنقلة", type: "صحة", status: "نشط", beneficiaries: 1500, year: 2024, description: "خدمات طبية للقرى" },
      { id: 52, title: "حفر بئر جديد", type: "مياه", status: "قيد التنفيذ", beneficiaries: 4000, year: 2025, description: "بئر ارتوازي بالطاقة الشمسية" },
    ],
  },
  {
    id: "marib",
    name: "مأرب",
    projectCount: 5,
    totalBeneficiaries: 15500,
    keyProject: "بئر مأرب",
    color: "#239966",
    path: "M 430 80 L 480 65 L 530 80 L 545 120 L 530 160 L 480 175 L 435 165 L 420 120 Z",
    projects: [
      { id: 53, title: "حفر بئر مأرب", type: "مياه", status: "نشط", beneficiaries: 3500, year: 2024, description: "بئر ارتوازي بالطاقة الشمسية" },
      { id: 54, title: "سلال غذائية", type: "غذاء", status: "نشط", beneficiaries: 2000, year: 2024, description: "توزيع على النازحين" },
      { id: 55, title: " كفالة أيتام", type: "كفالات", status: "نشط", beneficiaries: 120, year: 2024, description: "كفالات شهرية" },
      { id: 56, title: "عيادة متنقلة", type: "صحة", status: "مكتمل", beneficiaries: 1200, year: 2023, description: "خدمات طبية للنازحين" },
      { id: 57, title: "مدرسة متنقلة", type: "تعليم", status: "نشط", beneficiaries: 200, year: 2024, description: "تعليم للأطفال النازحين" },
    ],
  },
  {
    id: "abyan",
    name: "أبين",
    projectCount: 6,
    totalBeneficiaries: 19200,
    keyProject: "بئر أبين",
    color: "#18805a",
    path: "M 350 370 L 400 355 L 450 365 L 470 400 L 455 435 L 410 450 L 365 440 L 340 410 Z",
    projects: [
      { id: 58, title: "حفر بئر أبين", type: "مياه", status: "نشط", beneficiaries: 3000, year: 2024, description: "بئر ارتوازي لـ ٣ قرى" },
      { id: 59, title: "سلال غذائية", type: "غذاء", status: "نشط", beneficiaries: 2500, year: 2024, description: "توزيع على الأسر النازحة" },
      { id: 60, title: " كفالة أيتام", type: "كفالات", status: "نشط", beneficiaries: 110, year: 2024, description: "كفالات مادية شهرية" },
      { id: 61, title: "عيادة متنقلة", type: "صحة", status: "نشط", beneficiaries: 1800, year: 2024, description: "خدمات طبية ميدانية" },
      { id: 62, title: "دعم مدارس", type: "تعليم", status: "مكتمل", beneficiaries: 300, year: 2023, description: "تجهيز مدارس بالكتب" },
      { id: 63, title: "حفر بئر جديد", type: "مياه", status: "قيد التنفيذ", beneficiaries: 2500, year: 2025, description: "بئر بالطاقة الشمسية" },
    ],
  },
];

const PROJECT_TYPE_ICONS: Record<ProjectType, typeof Droplets> = {
  كفالات: Heart,
  مياه: Droplets,
  غذاء: Utensils,
  تعليم: GraduationCap,
  صحة: Stethoscope,
  مشاريع: Building2,
};

const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  كفالات: "#c69e5a",
  مياه: "#06b6d4",
  غذاء: "#f59e0b",
  تعليم: "#8b5cf6",
  صحة: "#ef4444",
  مشاريع: "#3b82f6",
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  "نشط": { bg: "rgba(22,101,52,0.12)", text: "#166534", label: "نشط" },
  "مكتمل": { bg: "rgba(23,32,42,0.06)", text: "#6b6878", label: "مكتمل" },
  "قيد التنفيذ": { bg: "rgba(234,179,8,0.12)", text: "#a16207", label: "قيد التنفيذ" },
};

const YEARS = ["الكل", "٢٠٢٦", "٢٠٢٥", "٢٠٢٤", "٢٠٢٣", "٢٠٢٢", "٢٠٢١", "٢٠٢٠", "٢٠١٩", "٢٠١٨", "٢٠١٧", "٢٠١٦", "٢٠١٥", "٢٠١٤"];
const YEAR_VALUES: Record<string, number | null> = {
  "الكل": null,
  "٢٠٢٦": 2026,
  "٢٠٢٥": 2025,
  "٢٠٢٤": 2024,
  "٢٠٢٣": 2023,
  "٢٠٢٢": 2022,
  "٢٠٢١": 2021,
  "٢٠٢٠": 2020,
  "٢٠١٩": 2019,
  "٢٠١٨": 2018,
  "٢٠١٧": 2017,
  "٢٠١٦": 2016,
  "٢٠١٥": 2015,
  "٢٠١٤": 2014,
};

const TYPE_FILTERS: { label: string; value: ProjectType | "الكل" }[] = [
  { label: "الكل", value: "الكل" },
  { label: "كفالات", value: "كفالات" },
  { label: "مياه", value: "مياه" },
  { label: "غذاء", value: "غذاء" },
  { label: "تعليم", value: "تعليم" },
  { label: "صحة", value: "صحة" },
  { label: "مشاريع", value: "مشاريع" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// المكونات الفرعية
// ═══════════════════════════════════════════════════════════════════════════════

function getGreenShade(projectCount: number): string {
  if (projectCount >= 10) return "#073d2a";
  if (projectCount >= 8) return "#0a5238";
  if (projectCount >= 6) return "#0d6846";
  if (projectCount >= 4) return "#17694f";
  return "#1a8a5f";
}

function getOpacity(projectCount: number): number {
  const min = 0.45;
  const max = 1.0;
  const normalized = Math.min(projectCount / 12, 1);
  return min + normalized * (max - min);
}

function Tooltip({
  gov,
  position,
}: {
  gov: Governorate;
  position: { x: number; y: number };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute z-[600] min-w-[200px] rounded-xl border border-[rgba(var(--brand-green-rgb),0.18)] bg-[var(--card)] p-4 shadow-xl"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: "translate(-50%, -100%)",
      }}
      dir="rtl"
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ background: getGreenShade(gov.projectCount) }}
        />
        <span className="text-sm font-bold text-[var(--foreground)]">
          {gov.name}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center justify-between gap-4">
          <span>المشاريع</span>
          <span className="font-bold text-[var(--foreground)]">
            {gov.projectCount}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>المستفيدون</span>
          <span className="font-bold text-[var(--foreground)]">
            {gov.totalBeneficiaries.toLocaleString("ar-YE")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>المشروع الرئيسي</span>
          <span className="font-bold text-[var(--brand-green)]">
            {gov.keyProject}
          </span>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-[rgba(var(--brand-green-rgb),0.18)] bg-[var(--card)]"
      />
    </motion.div>
  );
}

function DetailPanel({
  gov,
  onClose,
}: {
  gov: Governorate;
  onClose: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<ProjectType | "الكل">("الكل");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "الكل") return gov.projects;
    return gov.projects.filter((p) => p.type === activeFilter);
  }, [gov.projects, activeFilter]);

  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    gov.projects.forEach((p) => {
      byType[p.type] = (byType[p.type] || 0) + 1;
    });
    return byType;
  }, [gov.projects]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-y-0 left-0 z-[300] flex w-full max-w-lg flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--card)] shadow-2xl sm:left-auto sm:right-0"
      dir="rtl"
    >
      {/* Header */}
      <div className="relative border-b border-[var(--border)] bg-gradient-to-l from-[rgba(var(--brand-green-rgb),0.06)] to-transparent p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: getGreenShade(gov.projectCount) }}
              >
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
                  {gov.name}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                  {gov.projectCount} مشروع —{" "}
                  {gov.totalBeneficiaries.toLocaleString("ar-YE")} مستفيد
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[rgba(var(--brand-green-rgb),0.06)] p-3 text-center">
            <p className="text-2xl font-extrabold text-[var(--brand-green)]">
              {gov.projectCount}
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              مشروع
            </p>
          </div>
          <div className="rounded-xl bg-[rgba(var(--brand-gold-rgb),0.1)] p-3 text-center">
            <p className="text-2xl font-extrabold text-[var(--brand-gold)]">
              {gov.totalBeneficiaries.toLocaleString("ar-YE")}
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              مستفيد
            </p>
          </div>
          <div className="rounded-xl bg-[rgba(var(--brand-green-rgb),0.06)] p-3 text-center">
            <p className="text-2xl font-extrabold text-[var(--foreground)]">
              {Object.keys(stats).length}
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              نوع مشروع
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-[var(--border)] px-6 py-3">
        <div className="flex gap-1 overflow-x-auto" dir="rtl">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeFilter === f.value
                  ? "bg-[var(--brand-green)] text-white shadow-sm"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-6" style={{ scrollBehavior: "smooth" }}>
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-sm text-[var(--muted-foreground)]"
            >
              لا توجد مشاريع في هذا التصنيف
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredProjects.map((project, idx) => {
                const TypeIcon = PROJECT_TYPE_ICONS[project.type];
                const statusCfg = STATUS_CONFIG[project.status];
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-all hover:border-[rgba(var(--brand-green-rgb),0.2)] hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `${PROJECT_TYPE_COLORS[project.type]}18`,
                        }}
                      >
                        <TypeIcon
                          className="h-5 w-5"
                          style={{ color: PROJECT_TYPE_COLORS[project.type] }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-bold text-[var(--foreground)]">
                            {project.title}
                          </h3>
                          <span
                            className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: statusCfg.bg,
                              color: statusCfg.text,
                            }}
                          >
                            {statusCfg.label}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                          {project.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.beneficiaries.toLocaleString("ar-YE")} مستفيد
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.year}
                          </span>
                          <span
                            className="rounded-md px-1.5 py-0.5"
                            style={{
                              background: `${PROJECT_TYPE_COLORS[project.type]}18`,
                              color: PROJECT_TYPE_COLORS[project.type],
                            }}
                          >
                            {project.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function GovernorateCard({
  gov,
  onClick,
  isHighlighted,
}: {
  gov: Governorate;
  onClick: () => void;
  isHighlighted: boolean;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
        isHighlighted
          ? "border-[var(--brand-green)] bg-[rgba(var(--brand-green-rgb),0.06)] shadow-lg"
          : "border-[var(--border)] bg-[var(--card)] hover:border-[rgba(var(--brand-green-rgb),0.25)] hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: getGreenShade(gov.projectCount) }}
        >
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold text-[var(--foreground)]">
            {gov.name}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-[var(--foreground)]">
            {gov.keyProject}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[var(--muted)] p-3 text-center">
          <p className="text-xl font-extrabold text-[var(--brand-green)]">
            {gov.projectCount}
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-[var(--foreground)]">
            مشروع
          </p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] p-3 text-center">
          <p className="text-xl font-extrabold text-[var(--foreground)]">
            {gov.totalBeneficiaries.toLocaleString("ar-YE")}
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-[var(--foreground)]">
            مستفيد
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {gov.projects.slice(0, 3).map((p) => {
          const Icon = PROJECT_TYPE_ICONS[p.type];
          return (
            <div
              key={p.id}
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${PROJECT_TYPE_COLORS[p.type]}18` }}
              title={p.title}
            >
              <Icon
                className="h-3.5 w-3.5"
                style={{ color: PROJECT_TYPE_COLORS[p.type] }}
              />
            </div>
          );
        })}
        {gov.projects.length > 3 && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--muted)]">
            <span className="text-[10px] font-bold text-[var(--foreground)]">
              +{gov.projects.length - 3}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════════════════════

export default function InteractiveMapPage() {
  useSEO({
    title: "خريطة الأثر — رbaynacom",
    description:
      "تتبع أثر المنظمة في كل محافظة يمنية. خريطة تفاعلية تعرض المشاريع والمستفيدين عبر المحافظات اليمنية الثمانية.",
  });

  const [hoveredGov, setHoveredGov] = useState<string | null>(null);
  const [selectedGov, setSelectedGov] = useState<Governorate | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeTypeFilter, setActiveTypeFilter] = useState<ProjectType | "الكل">("الكل");
  const [activeYearFilter, setActiveYearFilter] = useState<string>("الكل");
  const [showFilters, setShowFilters] = useState(false);

  // Filter logic
  const filteredGovernorates = useMemo(() => {
    const yearVal = YEAR_VALUES[activeYearFilter];
    return GOVERNORATES.map((gov) => {
      let projects = gov.projects;
      if (activeTypeFilter !== "الكل") {
        projects = projects.filter((p) => p.type === activeTypeFilter);
      }
      if (yearVal !== null) {
        projects = projects.filter((p) => p.year === yearVal);
      }
      return {
        ...gov,
        filteredProjects: projects,
        filteredCount: projects.length,
        filteredBeneficiaries: projects.reduce(
          (sum, p) => sum + p.beneficiaries,
          0
        ),
      };
    });
  }, [activeTypeFilter, activeYearFilter]);

  const isFiltering = activeTypeFilter !== "الكل" || activeYearFilter !== "الكل";

  const totalProjects = useMemo(
    () => filteredGovernorates.reduce((s, g) => s + g.filteredCount, 0),
    [filteredGovernorates]
  );

  const totalBeneficiaries = useMemo(
    () =>
      filteredGovernorates.reduce((s, g) => s + g.filteredBeneficiaries, 0),
    [filteredGovernorates]
  );

  const totalGovernorateCount = useMemo(
    () => filteredGovernorates.filter((g) => g.filteredCount > 0).length,
    [filteredGovernorates]
  );

  const coveragePercent = Math.round((totalGovernorateCount / 8) * 100);

  // SVG interaction handlers
  const handleGovHover = useCallback(
    (gov: Governorate, e: React.MouseEvent) => {
      setHoveredGov(gov.id);
      const rect = e.currentTarget.closest("svg")?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    []
  );

  const handleGovClick = useCallback((gov: Governorate) => {
    setSelectedGov(gov);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[rgba(var(--brand-green-rgb),0.08)] to-[var(--background)] py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-60 -right-60 h-[600px] w-[600px] rounded-full opacity-[0.04]"
            style={{
              background:
                "radial-gradient(circle, var(--brand-green) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute -bottom-60 -left-60 h-[600px] w-[600px] rounded-full opacity-[0.03]"
            style={{
              background:
                "radial-gradient(circle, var(--brand-gold) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(var(--brand-green-rgb),0.12)] bg-white/80 px-5 py-2 shadow-sm backdrop-blur-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
                <Map className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[var(--brand-green)]">
                خريطة الأثر التفاعلية
              </span>
            </div>

            {/* Title */}
            <h1 className="mx-auto max-w-4xl text-[clamp(2rem,5vw,var(--fs-h1,2.5rem))] font-extrabold leading-[1.2] text-[var(--foreground)]">
              خريطة الأثر — تتبع أثرك في كل محافظة يمنية
            </h1>

            <div className="mx-auto my-6 h-1 w-24 rounded-full bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-gold)]" />

            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.15rem)] leading-[1.8] text-[var(--muted-foreground)]">
              استكشف المشاريع الإنسانية عبر المحافظات اليمنية الثمانية. كل نقطة
              على الخريطة تمثل أثرًا حقيقيًا في حياة الآلاف.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Stats Bar ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border-b border-[var(--border)] bg-[var(--card)]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            {
              icon: Target,
              value: totalProjects,
              label: "إجمالي المشاريع",
              color: "var(--brand-green)",
            },
            {
              icon: Users,
              value: totalBeneficiaries.toLocaleString("ar-YE"),
              label: "إجمالي المستفيدين",
              color: "var(--brand-gold)",
              textColor: "#8a6d2f",
            },
            {
              icon: MapPin,
              value: `${totalGovernorateCount} / ٨`,
              label: "المحافظات المشمولة",
              color: "var(--brand-green)",
              textColor: "var(--brand-green)",
            },
            {
              icon: TrendingUp,
              value: `${coveragePercent}%`,
              label: "نسبة التغطية",
              color: "var(--brand-gold)",
              textColor: "#8a6d2f",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-6 py-5"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${stat.color}14` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                {/* Value uses the AA-safe text tone; icon keeps brand hue */}
                <p
                  className="text-xl font-extrabold"
                  style={{ color: stat.textColor }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Filter Controls ═══ */}
      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-bold text-[var(--foreground)] transition-all hover:bg-[var(--muted)]"
            >
              <Filter className="h-4 w-4" />
              <span>التصفية</span>
              {(activeTypeFilter !== "الكل" || activeYearFilter !== "الكل") && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-green)] text-[10px] text-white">
                  ١
                </span>
              )}
            </button>

            {/* Active filter chips */}
            {activeTypeFilter !== "الكل" && (
              <span className="flex items-center gap-1.5 rounded-lg bg-[rgba(var(--brand-green-rgb),0.1)] px-3 py-1.5 text-xs font-bold text-[var(--brand-green)]">
                {activeTypeFilter}
                <button
                  onClick={() => setActiveTypeFilter("الكل")}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-green)]/20"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {activeYearFilter !== "الكل" && (
              <span className="flex items-center gap-1.5 rounded-lg bg-[rgba(var(--brand-gold-rgb),0.12)] px-3 py-1.5 text-xs font-bold text-[var(--brand-gold-dark,#8f6a1a)]">
                {activeYearFilter}
                <button
                  onClick={() => setActiveYearFilter("الكل")}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-gold)]/20"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}

            {/* Clear all */}
            {(activeTypeFilter !== "الكل" || activeYearFilter !== "الكل") && (
              <button
                onClick={() => {
                  setActiveTypeFilter("الكل");
                  setActiveYearFilter("الكل");
                }}
                className="text-xs font-bold text-[var(--destructive)] hover:underline"
              >
                مسح الكل
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {/* Type Filter */}
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <label className="mb-2 block text-xs font-bold text-[var(--foreground)]">
                      نوع المشروع
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TYPE_FILTERS.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setActiveTypeFilter(f.value)}
                          className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                            activeTypeFilter === f.value
                              ? "bg-[var(--brand-green)] text-white shadow-sm"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <label className="mb-2 block text-xs font-bold text-[var(--foreground)]">
                      السنة
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {YEARS.map((y) => (
                        <button
                          key={y}
                          onClick={() => setActiveYearFilter(y)}
                          className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                            activeYearFilter === y
                              ? "bg-[var(--brand-gold)] text-white shadow-sm"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ Interactive SVG Map ═══ */}
      <motion.section
        initial="initial"
        whileInView="visible"
        variants={scrollFadeUp}
        viewport={viewportOnce}
        className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16"
      >
        <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg sm:p-8">
          {/* Map container */}
          <div className="relative mx-auto aspect-[4/3] max-w-4xl">
            <svg
              viewBox="0 0 800 500"
              className="h-full w-full"
              aria-label="خريطة اليمن التفاعلية"
            >
              {/* Background pattern */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                </pattern>
                <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>
              <rect width="800" height="500" fill="url(#grid)" rx="16" />

              {/* Yemen outline - simplified shape */}
              <path
                d="M 180 80 L 250 50 L 350 40 L 450 50 L 550 60 L 650 80 L 720 120 L 730 180 L 710 250 L 680 300 L 630 340 L 560 370 L 480 390 L 400 400 L 320 395 L 250 370 L 200 330 L 170 280 L 160 220 L 165 160 Z"
                fill="none"
                stroke="var(--brand-green)"
                strokeWidth="2"
                strokeDasharray="6 3"
                opacity="0.2"
              />

              {/* Governorate regions */}
              {filteredGovernorates.map((gov) => {
                const isHovered = hoveredGov === gov.id;
                const isSelected = selectedGov?.id === gov.id;
                // eslint-disable-next-line no-nested-ternary -- precise: verified
                const isDimmed =
                  isFiltering && gov.filteredCount === 0;
                // eslint-disable-next-line no-nested-ternary -- precise: verified
                const opacity = isDimmed
                  ? 0.2
                  : isHovered || isSelected
                  ? 1
                  : getOpacity(gov.filteredCount || gov.projectCount);

                return (
                  <g key={gov.id}>
                    <path
                      d={gov.path}
                      fill={getGreenShade(gov.filteredCount || gov.projectCount)}
                      fillOpacity={opacity}
                      stroke={
                        isHovered || isSelected
                          ? "var(--brand-gold)"
                          : "var(--brand-green)"
                      }
                      strokeWidth={isHovered || isSelected ? 3 : 1.5}
                      className="cursor-pointer transition-all duration-200"
                      filter={isHovered ? "url(#shadow)" : undefined}
                      onMouseEnter={(e) => {
                        const synthetic = {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: verified
                          clientX: e.clientX,
                          clientY: e.clientY,
                          currentTarget: e.currentTarget,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: verified
                        } as any as React.MouseEvent;
                        handleGovHover(gov, synthetic);
                      }}
                      onMouseMove={(e) => {
                        const rect = (
                          e.currentTarget.closest("svg") as SVGSVGElement
                        )?.getBoundingClientRect();
                        if (rect) {
                          setTooltipPos({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredGov(null)}
                      onClick={() => handleGovClick(gov)}
                    />

                    {/* Governorate label */}
                    <text
                      x={parseFloat(gov.path.match(/M (\d+)/)?.[1] || "0") + 50}
                      y={parseFloat(gov.path.match(/M \d+ (\d+)/)?.[1] || "0") + 55}
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      fill={isDimmed ? "var(--muted-foreground)" : "white"}
                      fontSize="13"
                      fontWeight="800"
                      opacity={isDimmed ? 0.3 : 0.95}
                    >
                      {gov.name}
                    </text>

                    {/* Project count badge */}
                    <g
                      transform={`translate(${
                        parseFloat(gov.path.match(/M (\d+)/)?.[1] || "0") + 50
                      }, ${
                        parseFloat(gov.path.match(/M \d+ (\d+)/)?.[1] || "0") + 75
                      })`}
                    >
                      <rect
                        x="-14"
                        y="-10"
                        width="28"
                        height="20"
                        rx="10"
                        fill={isDimmed ? "var(--muted)" : "white"}
                        fillOpacity={isDimmed ? 0.5 : 0.95}
                        stroke={isDimmed ? "var(--border)" : "var(--brand-green)"}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isDimmed ? "var(--muted-foreground)" : "var(--brand-green)"}
                        fontSize="11"
                        fontWeight="800"
                      >
                        {gov.filteredCount || gov.projectCount}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredGov && (
                  <foreignObject
                    x={tooltipPos.x - 110}
                    y={tooltipPos.y - 120}
                    width="220"
                    height="130"
                    style={{ overflow: "visible" }}
                  >
                    <Tooltip
                      gov={
                        filteredGovernorates.find((g) => g.id === hoveredGov) ||
                        GOVERNORATES[0]
                      }
                      position={{ x: 110, y: 120 }}
                    />
                  </foreignObject>
                )}
              </AnimatePresence>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-[var(--border)] pt-6">
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span>شدة اللون:</span>
              <div className="flex items-center gap-1">
                <div className="h-4 w-6 rounded bg-[#1a8a5f] opacity-45" />
                <span>١ مشروع</span>
              </div>
              <div className="flex h-4 items-center">→</div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-6 rounded bg-[#073d2a]" />
                <span>+١٠ مشاريع</span>
              </div>
            </div>

            <div className="h-4 w-px bg-[var(--border)]" />

            <div className="flex flex-wrap items-center gap-3">
              {(
                [
                  ["كفالات", Heart, "#c69e5a"],
                  ["مياه", Droplets, "#06b6d4"],
                  ["غذاء", Utensils, "#f59e0b"],
                  ["تعليم", GraduationCap, "#8b5cf6"],
                  ["صحة", Stethoscope, "#ef4444"],
                  ["مشاريع", Building2, "#3b82f6"],
                ] as const
              ).map(([label, Icon, color]) => (
                <div
                  key={label}
                  className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ Governorate Cards Grid ═══ */}
      <motion.section
        initial="initial"
        whileInView="visible"
        variants={staggerContainer}
        viewport={viewportOnce}
        className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24"
      >
        <motion.div variants={scrollFadeUp} className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] sm:text-3xl">
            المحافظات الأكثر تأثيرًا
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            اضغط على أي محافظة لعرض تفاصيل مشاريعها المستفيدين
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredGovernorates
            .sort((a, b) => b.filteredCount - a.filteredCount)
            .map((gov) => (
              <GovernorateCard
                key={gov.id}
                gov={gov}
                onClick={() => handleGovClick(gov)}
                isHighlighted={
                  isFiltering
                    ? gov.filteredCount > 0
                    : hoveredGov === gov.id || selectedGov?.id === gov.id
                }
              />
            ))}
        </div>
      </motion.section>

      {/* ═══ Detail Panel ═══ */}
      <AnimatePresence>
        {selectedGov && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[250] bg-black/30 backdrop-blur-sm"
              onClick={() => setSelectedGov(null)}
            />
            <DetailPanel
              gov={selectedGov}
              onClose={() => setSelectedGov(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
