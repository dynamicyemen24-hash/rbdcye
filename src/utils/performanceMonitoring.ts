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

// PerformanceEntry types match the browser PerformanceEntry API
// We only need the properties we actually use
type PerformanceEntryTiming =
  | { name: "first-contentful-paint"; startTime: number; duration: number }
  | { name: "largest-contentful-paint"; startTime: number; duration: number }
  | { name: "first-input"; startTime: number; duration: number }
  | { name: "layout-shift"; startTime: number; duration: number }
  | { name: "navigate"; startTime: number; duration: number };

export class PerformanceMonitor {
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
    this.observeFCP();
    this.observeLCP();
    this.observeCLS();
    this.observeFID();
    this.observeTTFB();
  }

  private getRate(value: number): "good" | "needs-improvement" | "poor" {
    if (value < 0.1) return "good";
    if (value < 0.25) return "needs-improvement";
    return "poor";
  }

  private rateMetric(name: string, value: number): "good" | "needs-improvement" | "poor" {
    switch (name) {
      case "CLS":
        return value < 0.1 ? "good" : value < 0.25 ? "needs-improvement" : "poor";
      case "FID":
        return value < 100 ? "good" : value < 300 ? "needs-improvement" : "poor";
      case "LCP":
        return value < 2500 ? "good" : value < 4000 ? "needs-improvement" : "poor";
      case "INP":
        return value < 200 ? "good" : value < 500 ? "needs-improvement" : "poor";
      case "TTFB":
        return value < 800 ? "good" : value < 1800 ? "needs-improvement" : "poor";
      default:
        return this.getRate(value);
    }
  }

  private observeFCP() {
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && "duration" in lastEntry) {
          const entry = lastEntry as PerformanceEntryTiming;
          this.metrics.set("FCP", {
            name: "FCP",
            value: entry.duration,
            rating: this.rateMetric("FCP", entry.duration),
            delta: entry.duration,
            id: this.generateId(),
          });
        }
      });
      fcpObserver.observe({ type: "first-contentful-paint", buffered: true });
      this.observers.push(fcpObserver);
    } catch (error) {
      console.error("FCP observation error:", error);
    }
  }

  private observeLCP() {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && "duration" in lastEntry) {
          const entry = lastEntry as PerformanceEntryTiming;
          this.metrics.set("LCP", {
            name: "LCP",
            value: entry.duration,
            rating: this.rateMetric("LCP", entry.duration),
            delta: entry.duration,
            id: this.generateId(),
          });
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.error("LCP observation error:", error);
    }
  }

  private observeCLS() {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        for (const entry of entries) {
          // CLS entries are PerformanceEntry objects
          if ((entry as any).hadRecentInput) continue;
          const value = (entry as any).value;
          if (typeof value === "number") {
            clsValue += value;
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

  private observeFID() {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          const entry = firstEntry as PerformanceEntryTiming;
          this.metrics.set("FID", {
            name: "FID",
            value: entry.duration,
            rating: this.rateMetric("FID", entry.duration),
            delta: entry.duration,
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

  private observeTTFB() {
    try {
      const tfbObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const entry = lastEntry as PerformanceEntryTiming;
          this.metrics.set("TTFB", {
            name: "TTFB",
            value: entry.duration,
            rating: this.rateMetric("TTFB", entry.duration),
            delta: entry.duration,
            id: this.generateId(),
          });
        }
      });
      tfbObserver.observe({ type: "navigate", buffered: true });
      this.observers.push(tfbObserver);
    } catch (error) {
      console.error("TTFB observation error:", error);
    }
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}

export default PerformanceMonitor;
