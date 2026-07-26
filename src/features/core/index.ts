// Core Services Initialization
import { seoManager } from '@/utils/seoAdvanced';

interface CoreConfig {
  appName: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  sentryDsn?: string;
  analyticsId?: string;
}

const CORE_CONFIG: CoreConfig = {
  appName: 'رحماء بينهم',
  appVersion: '2.0.0',
  environment: (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
};

export async function initializeCoreServices(): Promise<void> {
  try {
    // Initialize SEO manager
    if (typeof window !== 'undefined') {
      seoManager.update({
        title: 'مؤسسة رحماء بينهم - منصة العمل الإنساني',
        description: 'منصة رقمية متكاملة لإدارة العمل الإنساني والخيري، تهدف لخدمة المتبرعين والمستفيدين',
        type: 'organization',
        image: '/og-image.png',
        url: 'https://rbdcye.org',
      });
    }

    // Initialize monitoring
    if (CORE_CONFIG.environment === 'production') {
      // Production monitoring setup
      window.addEventListener('unhandledrejection', (event) => {
        console.error('[Core] Unhandled rejection:', event.reason);
      });

      window.addEventListener('error', (event) => {
        console.error('[Core] Global error:', event.error);
      });
    }

    // Performance monitoring
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      if (paintEntries.length > 0) {
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          // Report FCP
          console.log(`[Core] FCP: ${fcp.startTime}ms`);
        }
      }
    }

    console.log(`[Core] ${CORE_CONFIG.appName} v${CORE_CONFIG.appVersion} initialized successfully (${CORE_CONFIG.environment})`);
  } catch (error) {
    console.error('[Core] Failed to initialize core services:', error);
  }
}

export function getCoreConfig(): CoreConfig {
  return { ...CORE_CONFIG };
}