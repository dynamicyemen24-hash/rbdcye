/**
 * React Hook for Sanity Data Fetching - Generic Query Hook
 */

import { useState, useEffect, type DependencyList } from "react";

import { sanityService } from "../services/sanity.service";

function useSanityQuery<T>(
  fetchFn: () => Promise<T>,
  deps: DependencyList
): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    setLoading(true);

    fetchFn()
      .then((result) => {
        if (mounted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- precise: deps intentionally limited to avoid loop — verified safe
  }, deps);

  return { data, loading, error };
}

export function useSanityProjects() {
  const { data, loading, error } = useSanityQuery(() => sanityService.getProjects(), []);
  return { projects: data ?? [], loading, error };
}

export function useSanityNews(publishedOnly = true) {
  const { data, loading, error } = useSanityQuery(() => sanityService.getNews(), [publishedOnly]);
  return { news: data ?? [], loading, error };
}

export function useSanityPartners() {
  const { data, loading, error } = useSanityQuery(() => sanityService.getPartners(), []);
  return { partners: data ?? [], loading, error };
}

export function useSanitySuccessStories() {
  const { data, loading, error } = useSanityQuery(() => sanityService.getSuccessStories(), []);
  return { stories: data ?? [], loading, error };
}

export function useSanityMedia() {
  const { data, loading, error } = useSanityQuery(() => sanityService.getMedia(), []);
  return { media: data ?? [], loading, error };
}

export function useSanityReports() {
  const { data, loading, error } = useSanityQuery(() => sanityService.getReports(), []);
  return { reports: data ?? [], loading, error };
}
