import { Droplets, Heart, Utensils, Sparkles, LucideIcon } from "lucide-react";

export type TypographyFamily = 'serif-amiri' | 'serif-scheherazade' | 'sans-cairo' | 'sans-kufi' | 'sans-tajawal';

export interface FontOption {
  id: TypographyFamily;
  name: string;
  category: 'serif' | 'sans';
  fontFamily: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { 
    id: 'serif-amiri', 
    name: 'الخط الأميري (Serif)', 
    category: 'serif', 
    fontFamily: "'Amiri', serif",
    description: 'خط كلاسيكي قرآني عريق' 
  },
  { 
    id: 'serif-scheherazade', 
    name: 'خط النسخ (Serif)', 
    category: 'serif', 
    fontFamily: "'Scheherazade New', 'Amiri', serif",
    description: 'رسم نسخي تقليدي واضح' 
  },
  { 
    id: 'sans-cairo', 
    name: 'خط كايرو (Sans-Serif)', 
    category: 'sans', 
    fontFamily: "'Cairo', sans-serif",
    description: 'عصري هندسي عالي المقروئية' 
  },
  { 
    id: 'sans-tajawal', 
    name: 'خط تجوال (Sans-Serif)', 
    category: 'sans', 
    fontFamily: "'Tajawal', sans-serif",
    description: 'انسيابي خفيف وسلس' 
  },
  { 
    id: 'sans-kufi', 
    name: 'الكوفي الحديث (Sans-Serif)', 
    category: 'sans', 
    fontFamily: "'Noto Kufi Arabic', sans-serif",
    description: 'هيكلي بارز وثابت' 
  },
];

export interface IslamicText {
  type: 'ayah' | 'hadith';
  arabic: string;
  reference: string;
  meaning?: string;
}

export const ISLAMIC_TEXTS: IslamicText[] = [
  {
    type: 'ayah',
    arabic: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنۢبُلَةٍ مِّائَةُ حَبَّةٍ",
    reference: "سورة البقرة: ٢٦١",
  },
  {
    type: 'ayah',
    arabic: "إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ وَلَهُمْ أَجْرٌ كَرِيمٌ",
    reference: "سورة الحديد: ١٨",
  },
  {
    type: 'hadith',
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    reference: "صحيح مسلم",
  },
  {
    type: 'hadith',
    arabic: "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى",
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
  { id: 'water', label: 'مشاريع السقيا والآبار', icon: Droplets, page: 'projects' },
  { id: 'orphans', label: 'كفالة ورعاية الأيتام', icon: Heart, page: 'projects' },
  { id: 'food', label: 'الأمن الغذائي والإغاثة', icon: Utensils, page: 'projects' },
  { id: 'empowerment', label: 'التمكين الاقتصادي للأسر', icon: Sparkles, page: 'programs' },
];

export interface HeroMetrics {
  totalBeneficiaries?: number;
  activeProjects?: number;
  totalPartners?: number;
}
