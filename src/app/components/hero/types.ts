import { Droplets, Heart, Utensils, Sparkles, LucideIcon } from "lucide-react";

export type TypographyFamily = "sans-cairo" | "serif-traditional" | "sans-system";

export interface FontOption {
  id: TypographyFamily;
  name: string;
  category: "serif" | "sans";
  fontFamily: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "sans-cairo",
    name: "خط كايرو (Sans-Serif)",
    category: "sans",
    fontFamily: "'Cairo', sans-serif",
    description: "عصري هندسي عالي المقروئية",
  },
  {
    id: "serif-traditional",
    name: "النسخ التقليدي (Serif)",
    category: "serif",
    fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Sakkal Majalla', serif",
    description: "رسم نسخي قرآني تقليدي",
  },
  {
    id: "sans-system",
    name: "خط النظام (Sans-Serif)",
    category: "sans",
    fontFamily: "system-ui, 'Segoe UI', Tahoma, sans-serif",
    description: "خفيف سريع من نظام الجهاز",
  },
];

export interface IslamicText {
  type: "ayah" | "hadith";
  arabic: string;
  reference: string;
  meaning?: string;
}

export const ISLAMIC_TEXTS: IslamicText[] = [
  {
    type: "ayah",
    arabic:
      "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنۢبُلَةٍ مِّائَةُ حَبَّةٍ",
    reference: "سورة البقرة: ٢٦١",
  },
  {
    type: "ayah",
    arabic:
      "إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ وَلَهُمْ أَجْرٌ كَرِيمٌ",
    reference: "سورة الحديد: ١٨",
  },
  {
    type: "hadith",
    arabic:
      "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    reference: "صحيح مسلم",
  },
  {
    type: "hadith",
    arabic:
      "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى",
    reference: "صحيح البخاري",
  },
];

export interface QuickSector {
  id: string;
  label: string;
  icon: LucideIcon;
  page: string;
}

export const QUICK_SECTORS: QuickSector[] = [
  { id: "water", label: "مشاريع السقيا والآبار", icon: Droplets, page: "projects" },
  { id: "orphans", label: "كفالة ورعاية الأيتام", icon: Heart, page: "projects" },
  { id: "food", label: "الأمن الغذائي والإغاثة", icon: Utensils, page: "projects" },
  { id: "empowerment", label: "التمكين الاقتصادي للأسر", icon: Sparkles, page: "programs" },
];

export interface HeroMetrics {
  totalBeneficiaries?: number;
  activeProjects?: number;
  totalPartners?: number;
}
