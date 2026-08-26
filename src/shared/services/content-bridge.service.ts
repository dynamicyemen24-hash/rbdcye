// ============================================================
// Content Bridge Service — Updated
// Routes ALL content types through ContentManager
// so the UI layer never knows the data source.
// ============================================================

import { contentManager, type ContentResult } from './content-manager';

// Legacy type for backward compatibility
type ImpactMetrics = {
  totalBeneficiaries?: number;
  activeProjects?: number;
  totalPartners?: number;
  volunteers?: number;
};

/**
 * Generic content getter — now supports ALL content types.
 * The UI layer never sees loading spinners or empty states.
 */
export const contentBridge = {
  async getContent<T = unknown>(key: string): Promise<ContentResult<T>> {
    switch (key) {
      case 'impact':
        return contentManager.getImpact() as Promise<ContentResult<T>>;
      case 'news':
        return contentManager.getNews() as Promise<ContentResult<T>>;
      case 'projects':
        return contentManager.getProjects() as Promise<ContentResult<T>>;
      case 'programs':
        return contentManager.getPrograms() as Promise<ContentResult<T>>;
      case 'partners':
        return contentManager.getPartners() as Promise<ContentResult<T>>;
      case 'stories':
        return contentManager.getSuccessStories() as Promise<ContentResult<T>>;
      case 'search':
        // Search is handled separately
        return { data: [], source: 'static', isDynamic: false, error: null };
      default:
        return { data: [], source: 'static', isDynamic: false, error: null };
    }
  },
};
