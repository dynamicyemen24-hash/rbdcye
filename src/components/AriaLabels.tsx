// Common ARIA labels for RTL Arabic interface
export const ariaLabels = {
  // Navigation
  mainNavigation: 'التنقل الرئيسي',
  secondaryNavigation: 'التنقل الثانوي',
  breadcrumb: 'المسار',
  pagination: 'ترقيم الصفحات',
  
  // Actions
  search: 'بحث',
  filter: 'تصفية',
  sort: 'ترتيب',
  close: 'إغلاق',
  menu: 'القائمة',
  submenu: 'قائمة فرعية',
  
  // Content
  mainContent: 'المحتوى الرئيسي',
  sidebar: 'الشريط الجانبي',
  footer: 'التذييل',
  header: 'الترويسة',
  
  // Forms
  requiredField: 'هذا الحقل مطلوب',
  invalidInput: 'إدخال غير صالح',
  submitForm: 'إرسال النموذج',
  resetForm: 'إعادة تعيين النموذج',
  
  // Media
  playVideo: 'تشغيل الفيديو',
  pauseVideo: 'إيقاف الفيديو مؤقتاً',
  stopVideo: 'إيقاف الفيديو',
  muteAudio: 'كتم الصوت',
  unmuteAudio: 'تشغيل الصوت',
  showCaptions: 'إظهار التسميات التوضيحية',
  hideCaptions: 'إخفاء التسميات التوضيحية',
  
  // Loading
  loading: 'جاري التحميل',
  refreshing: 'جاري التحديث',
  saving: 'جاري الحفظ',
  
  // Errors
  error: 'خطأ',
  retry: 'إعادة المحاولة',
  dismiss: 'تجاهل',
  
  // Success
  success: 'نجاح',
  saved: 'تم الحفظ',
  deleted: 'تم الحذف',
  
  // Charity specific
  donate: 'تبرع',
  volunteer: 'تطوع',
  share: 'مشاركة',
  download: 'تنزيل',
  contact: 'اتصل بنا',
} as const;

// Hook for accessible announcements
export function useAnnounce() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.textContent = message;
    document.body.appendChild(el);
    
    setTimeout(() => {
      document.body.removeChild(el);
    }, 1000);
  };

  return { announce };
}

// Live region component for dynamic content
export function LiveRegion({ 
  children, 
  priority = 'polite',
  label 
}: { 
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      aria-label={label}
      className="sr-only"
    >
      {children}
    </div>
  );
}