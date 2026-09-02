import type { Metric } from "web-vitals";

function sendToAnalytics(metric: Metric) {
  if (import.meta.env.PROD) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/web-vitals", body);
    } else {
      fetch("/api/analytics/web-vitals", {
        body,
        method: "POST",
        keepalive: true,
      });
    }
  }
}

export function reportWebVitals() {
  if (typeof window !== "undefined" && "performance" in window) {
    import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      onINP(sendToAnalytics);
    });
  }
}
