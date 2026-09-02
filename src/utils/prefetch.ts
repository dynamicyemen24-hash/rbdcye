/**
 * Route & Component Prefetching Utility
 * Allows preloading pages and dynamic chunks on user interaction (hover/focus)
 * and during browser idle time using requestIdleCallback.
 */

// Cache for loaded modules to avoid duplicate import calls
const prefetchedModules = new Set<string>();

/**
 * Map of page route keys to their dynamic import functions
 */
const routeImportMap: Record<string, () => Promise<unknown>> = {
  home: () => import('@/app/pages/HomePage'),
  about: () => import('@/app/pages/AboutPage'),
  programs: () => import('@/app/pages/ProgramsPage'),
  projects: () => import('@/app/pages/ProjectsPage'),
  success: () => import('@/app/pages/SuccessStoriesPage'),
  news: () => import('@/app/pages/NewsPage'),
  media: () => import('@/app/pages/MediaPage'),
  reports: () => import('@/app/pages/ReportsPage'),
  transparency: () => import('@/app/pages/TransparencyPage'),
  volunteer: () => import('@/app/pages/VolunteerPage'),
  zakat: () => import('@/app/pages/ZakatPage'),
  endowment: () => import('@/app/pages/EndowmentPage'),
  donate: () => import('@/app/pages/DonatePage'),
  contact: () => import('@/app/pages/ContactPage'),
  partners: () => import('@/app/pages/PartnersPage'),
  donor: () => import('@/app/pages/DonorPortalPage'),
  admin: () => import('@/app/pages/AdminPage'),
  search: () => import('@/app/components/SearchOverlay'),
};

/**
 * Prefetches a specific route module on-demand (e.g., hover on nav link)
 */
export function prefetchRoute(pageKey: string): void {
  if (prefetchedModules.has(pageKey)) return;

  const importFn = routeImportMap[pageKey];
  if (importFn) {
    prefetchedModules.add(pageKey);
    importFn().catch(() => {
      // If prefetch fails (e.g., offline), remove from set so it can retry later
      prefetchedModules.delete(pageKey);
    });
  }
}

/**
 * Idle-time preloader that preloads top-priority routes in background
 */
export function initIdlePrefetching(): void {
  if (typeof window === 'undefined') return;

  const priorityPages = ['donate', 'projects', 'programs', 'zakat', 'about'];

  const schedulePrefetch = () => {
    let index = 0;

    const loadNext = (deadline?: IdleDeadline) => {
      while (index < priorityPages.length && (!deadline || deadline.timeRemaining() > 5)) {
        prefetchRoute(priorityPages[index]);
        index++;
      }

      if (index < priorityPages.length) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNext, { timeout: 3000 });
        } else {
          setTimeout(loadNext, 1000);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadNext, { timeout: 3000 });
    } else {
      setTimeout(loadNext, 2000);
    }
  };

  if (document.readyState === 'complete') {
    schedulePrefetch();
  } else {
    window.addEventListener('load', schedulePrefetch, { once: true });
  }
}


