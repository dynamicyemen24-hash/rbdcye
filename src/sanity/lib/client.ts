/**
 * Sanity Client Configuration
 * مع دعم Fetch API المتقدم و Image URL Builder
 */
import { sanityClient } from '../client';

import type { QueryParams } from "@sanity/client";

export const client = sanityClient;

/**
 * Fetch helper with consistent error handling
 */
export async function sanityFetch<QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString;
  params?: QueryParams;
}): Promise<ReturnType<typeof client.fetch<QueryString>>> {
  try {
    return await client.fetch(query, params);
  } catch (error) {
    console.error("[Sanity] Fetch error:", error);
    throw error;
  }
}

/**
 * Get a server-side client with write access
 */
export function getServerClient(token?: string) {
  return client.withConfig({
    useCdn: false,
    token: token || import.meta.env.VITE_SANITY_API_READ_TOKEN,
  });
}
