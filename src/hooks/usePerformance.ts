// Performance Hook - Web Vitals Monitoring
// Professional Performance Tracking for Production

import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  FCP: number | null; // First Contentful Paint
  TTFB: number | null; // Time to First Byte
}

export function usePerformance() {
  const reportWebVitals = useCallback((metrics: PerformanceMetrics) => {
    if (import.meta.env.PROD) {
      // Send to analytics service
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      }).catch(console.error);
    } else {
      if (import.meta.env.DEV) console.log('Web Vitals:', metrics);
    }
  }, []);

  useEffect(() => {
    // Measure Core Web Vitals
    const metrics: PerformanceMetrics = {
      LCP: null,
      FID: null,
      CLS: null,
      FCP: null,
      TTFB: null,
    };

    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FCP - First Contentful Paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstEntry = entries[0];
      metrics.FCP = firstEntry.startTime;
    });
    fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });

    // TTFB - Time to First Byte
    const ttfbObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const navigationEntry = entries.find((e) => e.name === 'navigation');
      if (navigationEntry) {
        // Type assertion for browser-specific PerformanceNavigationTiming
        const navEntry = navigationEntry as PerformanceNavigationTiming;
        metrics.TTFB = navEntry.responseStart;
      }
    });
    ttfbObserver.observe({ entryTypes: ['navigation'] });

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as unknown as { hadRecentInput?: boolean }).hadRecentInput) {
          clsValue += (entry as unknown as { value?: number }).value || 0;
        }
      }
      metrics.CLS = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // FID - First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstEntry = entries[0];
      if (firstEntry) {
        // Type assertion for browser-specific PerformanceEventTiming
        const eventEntry = firstEntry as PerformanceEventTiming;
        metrics.FID = eventEntry.processingStart - eventEntry.startTime;
        reportWebVitals(metrics);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cleanup
    return () => {
      lcpObserver.disconnect();
      fcpObserver.disconnect();
      ttfbObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, [reportWebVitals]);

  return { reportWebVitals };
}

// Performance Marks Utility
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(name);
  }
}

export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof performance !== 'undefined') {
    performance.measure(name, startMark, endMark);
    return performance.getEntriesByName(name)[0]?.duration || 0;
  }
  return 0;
}

