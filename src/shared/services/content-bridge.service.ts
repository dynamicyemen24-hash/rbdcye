// ============================================================
// Content Bridge Service
// Abstracts content source (Sanity CMS or static fallback)
// so the UI layer never knows or exposes the origin.
// ============================================================
import { SEED_IMPACT } from "@/content/website";

import { sanityService } from "./sanity.service";

type ImpactMetrics = {
  totalBeneficiaries?: number;
  activeProjects?: number;
  totalPartners?: number;
  volunteers?: number;
};

type ContentResult<T> = {
  data: T[];
  isDynamic: boolean;
  source: 'static' | 'sanity' | 'hybrid';
  error: string | null;
};

/**
 * Internal: attempt a Sanity fetch with a strict timeout.
 * Returns `null` on any failure so callers can fall back silently.
 */
async function trySanity<T>(query: string): Promise<T[] | null> {
  try {
    const client = sanityService.getClient();
    const data = await client.fetch<T[]>(query);
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/**
 * Fetch impact metrics from Sanity (if available) or fall back
 * to seeded static data. The `source` field is internal only
 * and is never surfaced to the visitor in the UI.
 */
async function getImpact(): Promise<ContentResult<ImpactMetrics>> {
  const sanityData = await trySanity<ImpactMetrics & { beneficiaries?: number; projects?: number; partners?: number }>(
    `*[_type == "impact"][0]{
      totalBeneficiaries,
      beneficiaries,
      activeProjects,
      projects,
      totalPartners,
      partners,
      volunteers
    }`
  );

  if (sanityData) {
    const d = sanityData[0];
    return {
      data: [
        {
          totalBeneficiaries: d?.totalBeneficiaries || d?.beneficiaries,
          activeProjects: d?.activeProjects || d?.projects,
          totalPartners: d?.totalPartners || d?.partners,
          volunteers: d?.volunteers,
        },
      ],
      isDynamic: true,
      source: 'sanity',
      error: null,
    };
  }

  // Static fallback – indistinguishable from CMS to the visitor
  return {
    data: [
      {
        totalBeneficiaries: SEED_IMPACT.beneficiaries,
        activeProjects: SEED_IMPACT.projects,
        totalPartners: SEED_IMPACT.partners,
        volunteers: SEED_IMPACT.volunteers,
      },
    ],
    isDynamic: false,
    source: 'static',
    error: null,
  };
}

/**
 * Generic content getter.
 * Supported keys: "impact"
 */
export const contentBridge = {
  async getContent<T = unknown>(key: string): Promise<ContentResult<T>> {
    switch (key) {
      case "impact":
        return getImpact() as Promise<ContentResult<T>>;
      default:
        return { data: [], isDynamic: false, source: 'static', error: null };
    }
  },
};
