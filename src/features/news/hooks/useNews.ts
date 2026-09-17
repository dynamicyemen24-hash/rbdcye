import { useState, useEffect, useCallback } from "react";

import { API_BASE_URL, API_ENDPOINTS } from "@/shared/constants/api";

import type { NewsItem, NewsQueryParams, PaginatedResponse } from "../types";

export function useNews(params: NewsQueryParams = {}) {
  const [data, setData] = useState<PaginatedResponse<NewsItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          },
          {} as Record<string, string>
        )
      );
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NEWS.LIST}?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      const json: PaginatedResponse<NewsItem> = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    fetchNews();
  }, [fetchNews]);

  return { data, loading, error, refetch: fetchNews };
}
