// Performance monitoring utilities
// Tracks Core Web Vitals and custom metrics

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

// Track Largest Contentful Paint
export function observeLCP(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    callback({
      name: 'LCP',
      value: lastEntry.startTime,
      unit: 'ms',
      timestamp: Date.now(),
    });
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // LCP API not supported
  }

  return () => observer.disconnect();
}

// Track First Input Delay
export function observeFID(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (entry.processingStart) {
        callback({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          unit: 'ms',
          timestamp: Date.now(),
        });
      }
    });
  });

  try {
    observer.observe({ type: 'first-input', buffered: true });
  } catch {
    // First Input API not supported
  }

  return () => observer.disconnect();
}

// Track Cumulative Layout Shift
export function observeCLS(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;

  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        callback({
          name: 'CLS',
          value: clsValue,
          unit: '',
          timestamp: Date.now(),
        });
      }
    });
  });

  try {
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Layout Shift API not supported
  }

  return () => observer.disconnect();
}

// Track Interaction to Next Paint (INP) — Core Web Vital 2024+
export function observeINP(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.interactionId) {
          callback({
            name: 'INP',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
          });
        }
      });
    });
    observer.observe({ type: 'event', buffered: true, durationThreshold: 16 } as any);
    return () => observer.disconnect();
  } catch {
    // INP API not supported — fallback to FID already tracked
  }
  return () => {};
}

// Track Time to First Byte (TTFB)
export function observeTTFB(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return;
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      callback({
        name: 'TTFB',
        value: navEntry.responseStart - navEntry.requestStart,
        unit: 'ms',
        timestamp: Date.now(),
      });
    }
  } catch {
    // Navigation timing not supported
  }
}

// Connection-aware prefetch strategy — record-level: saves data + speeds perceived perf
export function getPrefetchStrategy(): 'prefetch-all' | 'prefetch-critical' | 'no-prefetch' {
  if (typeof navigator === 'undefined') return 'prefetch-critical';
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean; downlink?: number } }).connection;
  if (!navigator.onLine) return 'no-prefetch';
  if (conn?.saveData) return 'no-prefetch';
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return 'no-prefetch';
  if (conn?.effectiveType === '3g' || (conn?.downlink && conn.downlink < 1.5)) return 'prefetch-critical';
  return 'prefetch-all';
}

// Measure component render time
export function measureRender(name: string) {
  const start = performance.now();
  return () => {
    const end = performance.now();
    if (import.meta.env.DEV) {
      console.log(`[Perf] ${name}: ${(end - start).toFixed(2)}ms`);
    }
  };
}

// Lazy load images with IntersectionObserver
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.disconnect();
      }
    },
    { rootMargin: '200px' }
  );
  observer.observe(img);
  return () => observer.disconnect();
}

// Preload critical resources — with crossorigin & type support for fonts
export function preloadResource(href: string, as: string, opts?: { crossOrigin?: string; type?: string; fetchPriority?: 'high' | 'low' | 'auto' }) {
  if (typeof document === 'undefined') return;
  // Avoid duplicate preload links
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (opts?.crossOrigin) link.crossOrigin = opts.crossOrigin;
  if (opts?.type) link.type = opts.type;
  if (opts?.fetchPriority) (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = opts.fetchPriority;
  document.head.appendChild(link);
}

// Report Web Vitals to analytics — record-level: LCP/FID/CLS + INP/TTFB
export function reportWebVitals() {
  observeLCP((metric) => {
    if (import.meta.env.DEV) console.log('[WebVitals]', metric);
  });
  observeFID((metric) => {
    if (import.meta.env.DEV) console.log('[WebVitals]', metric);
  });
  observeCLS((metric) => {
    if (import.meta.env.DEV) console.log('[WebVitals]', metric);
  });
  observeINP((metric) => {
    if (import.meta.env.DEV) console.log('[WebVitals]', metric);
  });
  observeTTFB((metric) => {
    if (import.meta.env.DEV) console.log('[WebVitals]', metric);
  });
}

// Preload critical assets — connection-aware, font-optimized
export function preloadCriticalAssets() {
  if (typeof window === 'undefined') return;

  // Always preload brand logo with high priority (LCP candidate)
  preloadResource('/UAMEX_ERPLOGO.png', 'image', { fetchPriority: 'high' });

  // Fonts: woff2 with crossorigin & type for correct preload
  preloadResource('/fonts/tajawal-var-arabic.woff2', 'font', {
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    fetchPriority: 'high',
  });
  preloadResource('/fonts/tajawal-var-latin.woff2', 'font', {
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    fetchPriority: 'high',
  });
}

// Prefetch pages based on connection quality — saves data on slow/offline
export function prefetchPages(routes: string[]) {
  if (typeof document === 'undefined' || typeof navigator === 'undefined') return;
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  // Respect Save-Data and slow connections — skip prefetch
  if (conn?.saveData) return;
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return;
  if (!navigator.onLine) return;

  routes.forEach((href) => {
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    // Hint low priority prefetch
    (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'low';
    document.head.appendChild(link);
  });
}

// Prefetch images based on connection — lazy network-aware
export function prefetchCriticalImages(srcs: string[]) {
  if (typeof document === 'undefined' || typeof navigator === 'undefined') return;
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  if (conn?.saveData) return;
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return;
  if (!navigator.onLine) return;

  srcs.forEach((src) => {
    if (document.querySelector(`link[rel="prefetch"][href="${src}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Auto-init: preload critical + prefetch key routes when idle & connection allows
export function initPerformancePrefetch() {
  if (typeof window === 'undefined') return;
  const idle = (cb: () => void) => {
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(cb, { timeout: 2000 });
    } else {
      globalThis.setTimeout(cb, 1500);
    }
  };

  idle(() => {
    try {
      // No-op if already preloaded — guarded inside preloadCriticalAssets
      preloadCriticalAssets();
      // Prefetch high-value routes only on good connections
      prefetchPages(['/donate', '/about', '/sectors', '/news']);
    } catch {
      // Silently ignore prefetch failures — non-critical
    }
  });
}
