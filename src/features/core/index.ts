// Core Services Initialization
import { seoManager } from "@/utils/seoAdvanced";

interface CoreConfig {
  appName: string;
  appVersion: string;
  environment: "development" | "staging" | "production";
  apiUrl: string;
  sentryDsn?: string;
  analyticsId?: string;
}

const CORE_CONFIG: CoreConfig = {
  appName: "رحماء بينهم",
  appVersion: "2.0.0",
  environment: (import.meta.env.MODE as "development" | "staging" | "production") || "development",
  apiUrl: import.meta.env.VITE_API_URL || "/api",
};

export async function initializeCoreServices(): Promise<void> {
  try {
    // Initialize SEO manager
    if (typeof window !== "undefined") {
      seoManager.update({
        title: "حملة رحماء بينهم للإغاثة والتنمية",
        description: "الموقع الإلكتروني التعريفي الرسمي لحملة رحماء بينهم للإغاثة والتنمية باليمن",
        type: "organization",
        image: "/og-image.png",
        url: "https://rbdcye.org",
      });
    }

    // Initialize monitoring
    if (CORE_CONFIG.environment === "production") {
      // Production monitoring setup
      // Global error handling is managed by ErrorBoundary and main.tsx setupGlobalErrorHandler()
    }

    // Performance monitoring
    if ("performance" in window && "getEntriesByType" in performance) {
      const paintEntries = performance.getEntriesByType("paint");
      if (paintEntries.length > 0) {
        const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint");
        if (fcp) {
          // Report FCP
           if (import.meta.env.DEV) {
        // Report FCP in development
      }
        }
      }
    }

    if (import.meta.env.DEV) {
      // Initialization log
    }
  } catch {
    // Core initialization failed
  }
}

export function getCoreConfig(): CoreConfig {
  return { ...CORE_CONFIG };
}
