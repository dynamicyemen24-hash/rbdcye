// i18n Service - Multi-language support for the platform

// Supported languages
export const LANGUAGES = {
  ar: { name: 'العربية', dir: 'rtl' as const, flag: '🇸🇦' },
  en: { name: 'English', dir: 'ltr' as const, flag: '🇬🇧' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

// Translation keys
export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'من نحن',
    programs: 'برامجنا',
    projects: 'مشاريعنا',
    donate: 'تبرع',
    contact: 'تواصل معنا',
    
    // Hero
    hero_title: 'رحماء بينهم... أثرٌ يدوم مستقبلٌ يُبنى',
    hero_subtitle: 'مؤسسة رحماء بينهم منظمة إنسانية تنموية رائدة في اليمن',
    donate_now: 'تبرع الآن',
    quick_donate: 'تبرع سريع',
    watch_story: 'شاهد قصتنا',
    
    // Stats
    beneficiaries: 'مستفيد مباشر',
    projects_completed: 'مشروع منجز',
    partners: 'شريك استراتيجي',
    
    // Donation
    donation_amount: 'مبلغ التبرع',
    quick_impact: 'تبرع سريع وأثر مباشر',
    choose_project: 'اختر المشروع',
    
    // Zakat
    zakat_calculator: 'حاسبة الزكاة',
    calculate_zakat: 'احسب زكاتك',
    
    // Common
    learn_more: 'اعرف أكثر',
    view_all: 'عرض الكل',
    read_more: 'قراءة المزيد',
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About Us',
    programs: 'Our Programs',
    projects: 'Our Projects',
    donate: 'Donate',
    contact: 'Contact Us',
    
    // Hero
    hero_title: 'rbdcye... Enduring Impact, Building Futures',
    hero_subtitle: 'rbdcye Foundation - Leading humanitarian and developmental organization in Yemen',
    donate_now: 'Donate Now',
    quick_donate: 'Quick Donate',
    watch_story: 'Watch Our Story',
    
    // Stats
    beneficiaries: 'Direct Beneficiaries',
    projects_completed: 'Projects Completed',
    partners: 'Strategic Partners',
    
    // Donation
    donation_amount: 'Donation Amount',
    quick_impact: 'Quick Donation, Direct Impact',
    choose_project: 'Choose Project',
    
    // Zakat
    zakat_calculator: 'Zakat Calculator',
    calculate_zakat: 'Calculate Your Zakat',
    
    // Common
    learn_more: 'Learn More',
    view_all: 'View All',
    read_more: 'Read More',
  },
};

// Get stored language
export function getStoredLanguage(): LanguageCode {
  const savedLang = localStorage.getItem('rbdcye-language') as LanguageCode;
  return savedLang && savedLang in LANGUAGES ? savedLang : 'ar';
}

// Set language
export function setStoredLanguage(lang: LanguageCode): void {
  localStorage.setItem('rbdcye-language', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGUAGES[lang].dir;
}

// Translation function
export function t(key: string, language: LanguageCode = 'ar'): string {
  return translations[language][key as keyof typeof translations[typeof language]] || key;
}

// Get direction
export function getDirection(language: LanguageCode = 'ar'): 'ltr' | 'rtl' {
  return LANGUAGES[language].dir;
}

