import * as React from "react";

/**
 * ============================================================================
 * Accessibility / ARIA
 * ============================================================================
 *
 * Centralized Arabic labels for an RTL-first production interface.
 *
 * Guidelines:
 * - Prefer semantic HTML before ARIA.
 * - Use these labels only when the native accessible name is insufficient.
 * - Keep labels concise and action-oriented.
 * - Do not use these labels as visible UI copy unless intentionally desired.
 * - Keep the object immutable with `as const`.
 */

export const ariaLabels = {
  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------
  mainNavigation: "التنقل الرئيسي",
  secondaryNavigation: "التنقل الثانوي",
  breadcrumb: "المسار",
  pagination: "ترقيم الصفحات",

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------
  search: "بحث",
  filter: "تصفية",
  sort: "ترتيب",
  close: "إغلاق",
  menu: "القائمة",
  submenu: "قائمة فرعية",
  open: "فتح",
  expand: "توسيع",
  collapse: "طي",
  moreOptions: "خيارات إضافية",
  previous: "السابق",
  next: "التالي",
  back: "رجوع",
  forward: "التالي",
  refresh: "تحديث",
  copy: "نسخ",
  edit: "تعديل",
  delete: "حذف",
  confirm: "تأكيد",
  cancel: "إلغاء",
  clear: "مسح",
  selectAll: "تحديد الكل",
  deselectAll: "إلغاء تحديد الكل",

  // --------------------------------------------------------------------------
  // Content / Landmarks
  // --------------------------------------------------------------------------
  mainContent: "المحتوى الرئيسي",
  sidebar: "الشريط الجانبي",
  footer: "التذييل",
  header: "الترويسة",
  complementaryContent: "محتوى تكميلي",
  relatedContent: "محتوى ذو صلة",

  // --------------------------------------------------------------------------
  // Forms
  // --------------------------------------------------------------------------
  requiredField: "هذا الحقل مطلوب",
  invalidInput: "إدخال غير صالح",
  submitForm: "إرسال النموذج",
  resetForm: "إعادة تعيين النموذج",
  formError: "يوجد خطأ في النموذج",
  formSuccess: "تم إرسال النموذج بنجاح",
  fieldError: "يوجد خطأ في هذا الحقل",

  // --------------------------------------------------------------------------
  // Media
  // --------------------------------------------------------------------------
  playVideo: "تشغيل الفيديو",
  pauseVideo: "إيقاف الفيديو مؤقتاً",
  stopVideo: "إيقاف الفيديو",
  muteAudio: "كتم الصوت",
  unmuteAudio: "تشغيل الصوت",
  showCaptions: "إظهار التسميات التوضيحية",
  hideCaptions: "إخفاء التسميات التوضيحية",
  enterFullscreen: "الدخول إلى وضع ملء الشاشة",
  exitFullscreen: "الخروج من وضع ملء الشاشة",

  // --------------------------------------------------------------------------
  // Loading / Progress
  // --------------------------------------------------------------------------
  loading: "جاري التحميل",
  refreshing: "جاري التحديث",
  saving: "جاري الحفظ",
  processing: "جاري المعالجة",
  uploading: "جاري الرفع",
  downloading: "جاري التنزيل",

  // --------------------------------------------------------------------------
  // Errors
  // --------------------------------------------------------------------------
  error: "خطأ",
  retry: "إعادة المحاولة",
  dismiss: "تجاهل",
  failed: "فشلت العملية",
  unavailable: "غير متاح",
  connectionError: "حدث خطأ في الاتصال",

  // --------------------------------------------------------------------------
  // Success
  // --------------------------------------------------------------------------
  success: "نجاح",
  saved: "تم الحفظ",
  deleted: "تم الحذف",
  updated: "تم التحديث",
  completed: "اكتملت العملية",

  // --------------------------------------------------------------------------
  // Charity / Organization
  // --------------------------------------------------------------------------
  donate: "تبرع",
  volunteer: "تطوع",
  share: "مشاركة",
  download: "تنزيل",
  contact: "اتصل بنا",
} as const;

export type AriaLabelKey = keyof typeof ariaLabels;

/**
 * ============================================================================
 * Live Announcement Types
 * ============================================================================
 */

export type AnnouncementPriority = "polite" | "assertive";

export interface AnnounceOptions {
  /**
   * Priority used by assistive technologies.
   *
   * polite:
   *   Announces when the screen reader is ready.
   *
   * assertive:
   *   Interrupts the current announcement when appropriate.
   *
   * Use assertive sparingly for important errors, warnings, or state changes.
   */
  priority?: AnnouncementPriority;

  /**
   * Whether the announcement should be treated as atomic.
   */
  atomic?: boolean;

  /**
   * Optional delay before announcing.
   *
   * Useful when a state update and announcement happen in the same render cycle.
   */
  delay?: number;
}

/**
 * ============================================================================
 * Internal Constants
 * ============================================================================
 */

const LIVE_REGION_ID = "app-accessibility-live-region";
const DEFAULT_ANNOUNCEMENT_DELAY = 50;

/**
 * ============================================================================
 * Screen-reader-only utility
 * ============================================================================
 *
 * This class must exist globally in the application's CSS.
 *
 * Recommended implementation:
 *
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border: 0;
 * }
 *
 * Do not use `display:none` or `visibility:hidden`,
 * because those remove the content from the accessibility tree.
 */

/**
 * ============================================================================
 * Live Region DOM Factory
 * ============================================================================
 */

function getOrCreateLiveRegion(
  priority: AnnouncementPriority,
): HTMLDivElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  let region = document.getElementById(
    LIVE_REGION_ID,
  ) as HTMLDivElement | null;

  if (!region) {
    region = document.createElement("div");

    region.id = LIVE_REGION_ID;
    region.className = "sr-only";
    region.setAttribute("aria-atomic", "true");

    document.body.appendChild(region);
  }

  /**
   * `role="alert"` provides assertive announcement semantics.
   *
   * `role="status"` provides polite announcement semantics.
   *
   * Do not use `role="status"` for assertive announcements.
   */
  if (priority === "assertive") {
    region.setAttribute("role", "alert");
    region.setAttribute("aria-live", "assertive");
  } else {
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
  }

  return region;
}

/**
 * ============================================================================
 * useAnnounce
 * ============================================================================
 *
 * Stable accessibility announcement API.
 *
 * Design goals:
 * - SSR safe
 * - React Strict Mode safe
 * - No DOM node per announcement
 * - No uncontrolled DOM growth
 * - Centralized live region
 * - Proper polite/assertive semantics
 * - Cleanup on unmount
 * - Safe repeated announcements
 * - Compatible with RTL interfaces
 */
export function useAnnounce() {
  const timersRef = React.useRef<Set<number>>(new Set());

  const announce = React.useCallback(
    (
      message: string,
      options: AnnounceOptions = {},
    ): void => {
      const normalizedMessage = message.trim();

      if (!normalizedMessage) {
        return;
      }

      const {
        priority = "polite",
        atomic = true,
        delay = DEFAULT_ANNOUNCEMENT_DELAY,
      } = options;

      const timeout = window.setTimeout(() => {
        timersRef.current.delete(timeout);

        const region = getOrCreateLiveRegion(priority);

        if (!region) {
          return;
        }

        region.setAttribute("aria-atomic", String(atomic));

        /**
         * Clear first, then write.
         *
         * This helps assistive technologies recognize repeated
         * announcements containing the same text.
         */
        region.textContent = "";

        window.requestAnimationFrame(() => {
          region.textContent = normalizedMessage;
        });
      }, Math.max(0, delay));

      timersRef.current.add(timeout);
    },
    [],
  );

  React.useEffect(() => {
    return () => {
      for (const timer of timersRef.current) {
        window.clearTimeout(timer);
      }

      timersRef.current.clear();
    };
  }, []);

  return { announce };
}

/**
 * ============================================================================
 * Standalone announcement helper
 * ============================================================================
 *
 * Useful outside React components.
 *
 * Example:
 *
 * announceAccessibility("تم حفظ البيانات");
 *
 * announceAccessibility("تعذر الاتصال بالخادم", {
 *   priority: "assertive",
 * });
 */

export function announceAccessibility(
  message: string,
  options: AnnounceOptions = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    return;
  }

  const {
    priority = "polite",
    atomic = true,
    delay = DEFAULT_ANNOUNCEMENT_DELAY,
  } = options;

  window.setTimeout(() => {
    const region = getOrCreateLiveRegion(priority);

    if (!region) {
      return;
    }

    region.setAttribute("aria-atomic", String(atomic));

    region.textContent = "";

    window.requestAnimationFrame(() => {
      region.textContent = normalizedMessage;
    });
  }, Math.max(0, delay));
}

/**
 * ============================================================================
 * LiveRegion
 * ============================================================================
 *
 * Declarative live region for dynamic UI state.
 *
 * Examples:
 *
 * <LiveRegion>
 *   تم تحديث النتائج
 * </LiveRegion>
 *
 * <LiveRegion priority="assertive">
 *   تعذر حفظ البيانات
 * </LiveRegion>
 *
 * Important:
 * - Do not wrap normal page content in this component.
 * - Use it only for meaningful dynamic status changes.
 * - Avoid excessive announcements.
 */

export interface LiveRegionProps {
  children: React.ReactNode;
  priority?: AnnouncementPriority;
  label?: string;
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  priority = "polite",
  label,
  atomic = true,
  className = "sr-only",
}: LiveRegionProps) {
  const role = priority === "assertive" ? "alert" : "status";

  /**
   * `aria-label` is optional.
   *
   * For most live regions the actual children are the announcement,
   * therefore no label is required.
   */
  return (
    <div
      className={className}
      role={role}
      aria-live={priority}
      aria-atomic={atomic}
      {...(label ? { "aria-label": label } : {})}
    >
      {children}
    </div>
  );
}

/**
 * ============================================================================
 * Specialized Live Regions
 * ============================================================================
 *
 * These make common application states explicit and consistent.
 */

export function LoadingAnnouncement({
  children = ariaLabels.loading,
}: {
  children?: React.ReactNode;
}) {
  return (
    <LiveRegion priority="polite">
      {children}
    </LiveRegion>
  );
}

export function ErrorAnnouncement({
  children = ariaLabels.error,
}: {
  children?: React.ReactNode;
}) {
  return (
    <LiveRegion priority="assertive">
      {children}
    </LiveRegion>
  );
}

export function SuccessAnnouncement({
  children = ariaLabels.success,
}: {
  children?: React.ReactNode;
}) {
  return (
    <LiveRegion priority="polite">
      {children}
    </LiveRegion>
  );
}

/**
 * ============================================================================
 * Utility: Arabic ARIA label lookup
 * ============================================================================
 */

export function getAriaLabel(key: AriaLabelKey): string {
  return ariaLabels[key];
}