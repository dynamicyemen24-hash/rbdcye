export interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

export interface WebVitals {
  FCP?: PerformanceMetric;
  LCP?: PerformanceMetric;
  FID?: PerformanceMetric;
  CLS?: PerformanceMetric;
  INP?: PerformanceMetric;
  TTFB?: PerformanceMetric;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  init() {
    if (typeof window === "undefined") return;

    this.observeNavigation();
    this.observePaint();
    this.observeLayoutShifts();
    this.observeInteractions();
    this.observeResourceTiming();
  }

  private observeNavigation() {
    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navEntry) {
        this.metrics.set("TTFB", {
          name: "TTFB",
          value: navEntry.responseStart,
          rating: this.rateMetric("TTFB", navEntry.responseStart),
          delta: navEntry.responseStart,
          id: this.generateId(),
        });
      }
    } catch (error) {
      console.error("Navigation observation error:", error);
    }
  }

  private observePaint() {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            this.metrics.set("FCP", {
              name: "FCP",
              value: entry.startTime,
              rating: this.rateMetric("FCP", entry.startTime),
              delta: entry.startTime,
              id: this.generateId(),
            });
          }
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
      this.observers.push(paintObserver);
    } catch (error) {
      console.error("Paint observation error:", error);
    }
  }

  private observeLayoutShifts() {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.set("CLS", {
          name: "CLS",
          value: clsValue,
          rating: this.rateMetric("CLS", clsValue),
          delta: clsValue,
          id: this.generateId(),
        });
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      this.observers.push(clsObserver);
    } catch (error) {
      console.error("CLS observation error:", error);
    }
  }

  private observeInteractions() {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.set("FID", {
            name: "FID",
            value: (entry as any).processingStart - entry.startTime,
            rating: this.rateMetric("FID", (entry as any).processingStart - entry.startTime),
            delta: (entry as any).processingStart - entry.startTime,
            id: this.generateId(),
          });
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });
      this.observers.push(fidObserver);
    } catch (error) {
      console.error("FID observation error:", error);
    }
  }

  private observeResourceTiming() {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 1000) {
            // slow resource detected
          }
        }
      });
      resourceObserver.observe({ type: "resource", buffered: true });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.error("Resource timing error:", error);
    }
  }

  private rateMetric(name: string, value: number): "good" | "needs-improvement" | "poor" {
    const thresholds: Record<string, { good: number; poor: number }> = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name];
    if (!threshold) return "good";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getMetrics(): WebVitals {
    const result: WebVitals = {};
    this.metrics.forEach((value, key) => {
      result[key as keyof WebVitals] = value;
    });
    return result;
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  clear() {
    this.metrics.clear();
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  destroy() {
    this.clear();
    PerformanceMonitor.instance = undefined as any;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
