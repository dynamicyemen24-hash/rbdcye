import { useState, useEffect, useCallback } from 'react';

import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api';

import type { NewsItem, NewsQueryParams, PaginatedResponse } from '../types';

export function useNews(params: NewsQueryParams = {}) {
  const [data, setData] = useState<PaginatedResponse<NewsItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NEWS.LIST}?${new URLSearchParams(params as any)}`);
      if (!res.ok) throw new Error('Failed to fetch news');
      const json: PaginatedResponse<NewsItem> = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { data, loading, error, refetch: fetchNews };
}


