export const reportWebVitals = (metric: { name: string; value: number; rating: string }) => {
  if (typeof window !== 'undefined') {
    const body = JSON.stringify(metric);
    const url = '/api/v1/analytics/web-vitals';
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  }
};

export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            reportWebVitals({ name: 'LCP', value: (entry as any).startTime, rating: (entry as any).rating || 'good' });
          }
          if (entry.entryType === 'first-input') {
            reportWebVitals({ name: 'FID', value: (entry as any).processingStart - (entry as any).startTime, rating: 'good' });
          }
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
    } catch {
      // PerformanceObserver not supported
    }
  }
};

export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    const links = [
      { rel: 'preload', href: '/fonts/cairo-var-arabic.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    ];
    links.forEach(link => {
      const el = document.createElement('link');
      Object.assign(el, link);
      document.head.appendChild(el);
    });
  }
};