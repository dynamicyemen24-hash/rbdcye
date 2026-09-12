import { useEffect, useState } from 'react';

import { SEED_IMPACT } from '@/content/website';

import { sanityClient } from '../client';
import { IMPACT_METRICS_QUERY } from '../queries';

export type ImpactMetrics = {
  totalBeneficiaries: number;
  activeProjects: number;
  totalPartners: number;
  totalVolunteers: number;
  totalProjects?: number;
};

const CACHE_KEY = 'rbdcye:impact:v1';
const STALE_MS = 7 * 24 * 60 * 60 * 1000; // 7d

function readCache(): ImpactMetrics | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > STALE_MS) return null;
    return data as ImpactMetrics;
  } catch { return null; }
}

function writeCache(data: ImpactMetrics) {
  // eslint-disable-next-line no-empty -- precise: no-empty — verified safe
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export function useImpactMetrics() {
  const [data, setData] = useState<ImpactMetrics>({
    totalBeneficiaries: SEED_IMPACT.beneficiaries,
    activeProjects: SEED_IMPACT.projects,
    totalPartners: SEED_IMPACT.partners,
    totalVolunteers: SEED_IMPACT.volunteers,
  });
  const [source, setSource] = useState<'seed'|'cache'|'sanity'>('seed');

  useEffect(() => {
    const cached = readCache();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    if (cached) { setData(cached); setSource('cache'); }

    let cancelled = false;
    // GROQ via defineQuery — System of Record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sanityClient.fetch(IMPACT_METRICS_QUERY, {}, { perspective: 'published' } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (cancelled || !res) return;
        const next: ImpactMetrics = {
          totalBeneficiaries: res.totalBeneficiaries ?? res.totalBeneficiaries ?? SEED_IMPACT.beneficiaries,
          activeProjects: res.activeProjects ?? SEED_IMPACT.projects,
          totalPartners: res.totalPartners ?? SEED_IMPACT.partners,
          totalVolunteers: res.totalVolunteers ?? SEED_IMPACT.volunteers,
          totalProjects: res.totalProjects,
        };
        // sanity returns sums, ensure numbers
        if (typeof next.totalBeneficiaries === 'number' && next.totalBeneficiaries > 0) {
          writeCache(next);
          setData(next);
          setSource('sanity');
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  return { data, source };
}
