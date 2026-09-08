// Performance optimization utilities
export function preloadCriticalAssets(): void {
  const assets = [
    { href: "/fonts/cairo-var-arabic.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
    { href: "/fonts/cairo-var-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
    { href: "/images/defaults/about-hero.svg", as: "image", fetchPriority: "high" },
    { href: "/images/defaults/story-community.svg", as: "image", fetchPriority: "high" },
  ];

  assets.forEach((asset) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = asset.href;
    link.as = asset.as as string;
    if (asset.crossOrigin) link.crossOrigin = asset.crossOrigin;
    if (asset.fetchPriority) link.fetchPriority = asset.fetchPriority as "high" | "low" | "auto";
    document.head.appendChild(link);
  });
}

// Prefetch pages for smoother navigation
export function prefetchPage(path: string): void {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = path;
  document.head.appendChild(link);
}

// Intersection Observer for lazy loading sections
export function setupLazySections(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement;
          section.classList.remove("lazy-section");
          observer.unobserve(section);
        }
      });
    },
    { rootMargin: "200px", threshold: 0.1 }
  );

  document.querySelectorAll("main section.lazy-section").forEach((section) => {
    observer.observe(section);
  });
}

// Performance marks for Core Web Vitals
export function markPerformance(name: string): void {
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark(name);
  }
}

export function measurePerformance(name: string, startMark: string, endMark: string): number {
  if (typeof performance !== "undefined" && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name);
      return entries.length > 0 ? entries[0].duration : 0;
    } catch {
      return 0;
    }
  }
  return 0;
}
