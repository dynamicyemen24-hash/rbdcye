import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ShortcutDefinition {
  id: string;
  title: string;
  description: string;
  keyCombo: string;
  altKeyCombo?: string;
  category: 'navigation' | 'actions' | 'accessibility';
  action: () => void;
}

export interface UseKeyboardShortcutsOptions {
  onOpenHelp?: () => void;
  isModalOpen?: boolean;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const { onOpenHelp, isModalOpen = false } = options;
  const navigate = useNavigate();
  const [activeShortcutNotice, setActiveShortcutNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotice = useCallback((message: string) => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    setActiveShortcutNotice(message);
    noticeTimerRef.current = setTimeout(() => {
      setActiveShortcutNotice(null);
    }, 2800);
  }, []);

  const dismissNotice = useCallback(() => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    setActiveShortcutNotice(null);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotice('تم الصعود إلى أعلى الصفحة');
  }, [showNotice]);

  const focusMainContent = useCallback(() => {
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.tabIndex = -1;
      mainEl.focus();
      mainEl.scrollIntoView({ behavior: 'smooth' });
      showNotice('تم توجيه التركيز إلى المحتوى الرئيسي');
    }
  }, [showNotice]);

  const navigateTo = useCallback((path: string, label: string, keyName: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotice(`تم الانتقال إلى: ${label} (${keyName})`);
  }, [navigate, showNotice]);

  const shortcuts: ShortcutDefinition[] = useMemo(() => [
    {
      id: 'home',
      title: 'الرئيسية',
      description: 'الانتقال إلى الصفحة الرئيسية',
      keyCombo: '1',
      category: 'navigation',
      action: () => navigateTo('/', 'الرئيسية', '1'),
    },
    {
      id: 'about',
      title: 'عن رحماء بينهم',
      description: 'التعرف على رحماء بينهم ورسالتها',
      keyCombo: '2',
      category: 'navigation',
      action: () => navigateTo('/about', 'عن رحماء بينهم', '2'),
    },
    {
      id: 'programs',
      title: 'برامجنا',
      description: 'استعراض المسارات والبرامج الإنسانية',
      keyCombo: '3',
      category: 'navigation',
      action: () => navigateTo('/programs', 'برامجنا', '3'),
    },
    {
      id: 'projects',
      title: 'مشاريعنا',
      description: 'المشاريع التنموية والإغاثية الحالية',
      keyCombo: '4',
      category: 'navigation',
      action: () => navigateTo('/projects', 'مشاريعنا', '4'),
    },
    {
      id: 'success',
      title: 'قصص النجاح',
      description: 'قصص حقيقية للمستفيدين وأثر العطاء',
      keyCombo: '5',
      category: 'navigation',
      action: () => navigateTo('/success', 'قصص النجاح', '5'),
    },
    {
      id: 'news',
      title: 'الأخبار والفعاليات',
      description: 'آخر أخبار وإنجازاتنا',
      keyCombo: '6',
      category: 'navigation',
      action: () => navigateTo('/news', 'الأخبار والفعاليات', '6'),
    },
    {
      id: 'media',
      title: 'معرض الوسائط',
      description: 'الصور ومقاطع الفيديو من الميدان',
      keyCombo: '7',
      category: 'navigation',
      action: () => navigateTo('/media', 'معرض الوسائط', '7'),
    },
    {
      id: 'reports',
      title: 'التقارير والإصدارات',
      description: 'التقارير السنوية والمالية المدققة',
      keyCombo: '8',
      category: 'navigation',
      action: () => navigateTo('/reports', 'التقارير والإصدارات', '8'),
    },
    {
      id: 'transparency',
      title: 'الشفافية والحوكمة',
      description: 'معايير النزاهة والرقابة المالية',
      keyCombo: '9',
      category: 'navigation',
      action: () => navigateTo('/transparency', 'الشفافية والحوكمة', '9'),
    },
    {
      id: 'donate',
      title: 'التبرع السريع',
      description: 'الانتقال إلى بوابة التبرع المباشر',
      keyCombo: 'D',
      altKeyCombo: 'د',
      category: 'actions',
      action: () => navigateTo('/donate', 'بوابة التبرع', 'D'),
    },
    {
      id: 'zakat',
      title: 'حاسبة الزكاة',
      description: 'حساب زكاة المال والذهب والأسهم',
      keyCombo: 'Z',
      altKeyCombo: 'ز',
      category: 'actions',
      action: () => navigateTo('/zakat', 'حاسبة الزكاة', 'Z'),
    },
    {
      id: 'volunteer',
      title: 'التطوع معنا',
      description: 'استمارة الانضمام لفريق المتطوعين',
      keyCombo: 'V',
      altKeyCombo: 'ت',
      category: 'actions',
      action: () => navigateTo('/volunteer', 'بوابة التطوع', 'V'),
    },
    {
      id: 'contact',
      title: 'تواصل معنا',
      description: 'معلومات الاتصال والاستفسارات',
      keyCombo: 'C',
      altKeyCombo: 'ص',
      category: 'actions',
      action: () => navigateTo('/contact', 'تواصل معنا', 'C'),
    },
    {
      id: 'partners',
      title: 'شركاء النجاح',
      description: 'المؤسسات والشركاء الاستراتيجيون',
      keyCombo: 'P',
      altKeyCombo: 'ش',
      category: 'actions',
      action: () => navigateTo('/partners', 'شركاء النجاح', 'P'),
    },
    {
      id: 'help',
      title: 'دليل الاختصارات',
      description: 'فتح نافذة مساعدة اختصارات لوحة المفاتيح',
      keyCombo: '?',
      altKeyCombo: 'H',
      category: 'accessibility',
      action: () => {
        if (onOpenHelp) {
          onOpenHelp();
          showNotice('دليل اختصارات لوحة المفاتيح (?)');
        }
      },
    },
    {
      id: 'top',
      title: 'أعلى الصفحة',
      description: 'التمرير السلس إلى أعلى الصفحة',
      keyCombo: 'T',
      altKeyCombo: 'ف',
      category: 'accessibility',
      action: scrollToTop,
    },
    {
      id: 'main',
      title: 'المحتوى الرئيسي',
      description: 'التركيز المباشر على المحتوى الرئيسي',
      keyCombo: 'M',
      altKeyCombo: 'م',
      category: 'accessibility',
      action: focusMainContent,
    },
  ], [navigateTo, onOpenHelp, scrollToTop, focusMainContent, showNotice]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is inside an input, textarea, select, or editable element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore if modifier keys (Ctrl/Cmd/Alt) are pressed, unless it is a specific combo
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (isModalOpen && e.key !== 'Escape') {
        return;
      }

      const key = e.key;

      // Match shortcut
      const matched = shortcuts.find(
        (s) =>
          s.keyCombo.toLowerCase() === key.toLowerCase() ||
          (s.altKeyCombo && s.altKeyCombo.toLowerCase() === key.toLowerCase())
      );

      if (matched) {
        e.preventDefault();
        matched.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, [shortcuts, isModalOpen]);

  return {
    shortcuts,
    activeShortcutNotice,
    dismissNotice,
  };
}


