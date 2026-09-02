import { createClient } from "@sanity/client";

// Sanity configuration
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "xd0ohyiz";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01";
const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT || "30000", 10);

// Create Sanity client
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Set timeout to prevent hanging requests
  timeout: apiTimeout,
});

/**
 * Query with retry logic and timeout
 */
export async function queryWithRetry<T = any>(query: string, maxRetries: number = 3): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        client.fetch<T>(query),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Request timeout"));
          }, apiTimeout);
        }),
      ]);

      return result;
    } catch (error) {
      lastError = error as Error;
      // Retry with exponential backoff

      // Wait before retry with exponential backoff
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error("Unknown error");
}

/**
 * Fetch projects with retry
 */
export async function fetchProjectsWithRetry() {
  const query = `*[_type == "project" && status != "archived"] | order(_createdAt desc) {
    _id,
    title,
    description,
    category,
    status,
    "progress": coalesce(progress, 0),
    budget,
    beneficiaries,
    location,
    "mainImage": mainImage,
    "startDate": startDate,
    "endDate": endDate,
    "slug": slug
  }`;

  try {
    return await queryWithRetry(query);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetch news with retry
 */
export async function fetchNewsWithRetry() {
  const query = `*[_type == "news" && status == "PUBLISHED"] | order(publishDate desc) {
    _id,
    title,
    excerpt,
    category,
    "status": status,
    "mainImage": mainImage,
    publishDate,
    tags,
    views,
    "date": coalesce(date, _createdAt)
  }`;

  try {
    return await queryWithRetry(query);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}

/**
 * Fetch partners with retry
 */
export async function fetchPartnersWithRetry() {
  const query = `*[_type == "partner" && status == "active"] | order(_createdAt desc) {
    _id,
    name,
    type,
    description,
    "logo": logo,
    website,
    status
  }`;

  try {
    return await queryWithRetry(query);
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    return [];
  }
}

/**
 * Fetch success stories with retry
 */
export async function fetchSuccessStoriesWithRetry() {
  const query = `*[_type == "successStory" && status == "published"] | order(_createdAt desc) {
    _id,
    title,
    name,
    program,
    "mainImage": mainImage,
    content
  }`;

  try {
    return await queryWithRetry(query);
  } catch (error) {
    console.error("Failed to fetch success stories:", error);
    return [];
  }
}

/**
 * Fetch events with retry
 */
export async function fetchEventsWithRetry() {
  const query = `*[_type == "event"] | order(startDate desc) {
    _id,
    title,
    slug,
    description,
    "mainImage": mainImage,
    type,
    startDate,
    endDate,
    location,
    status,
    featured,
    capacity,
    registeredCount
  }`;

  try {
    return await queryWithRetry(query);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

/**
 * Fetch dashboard metrics with retry
 */
export async function fetchDashboardMetricsWithRetry() {
  const query = `{
    "totalProjects": count(*[_type == "project"]),
    "activeProjects": count(*[_type == "project" && status == "active"]),
    "totalPartners": count(*[_type == "partner" && status == "active"]),
    "totalNews": count(*[_type == "news" && status == "PUBLISHED"]),
    "totalStories": count(*[_type == "successStory" && status == "published"]),
    "totalEvents": count(*[_type == "event"]),
    "totalTestimonials": count(*[_type == "testimonial" && status == "published"]),
    "totalDonations": count(*[_type == "donation" && status == "completed"])
  }`;

  try {
    return await queryWithRetry(query);
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return {
      totalProjects: 0,
      activeProjects: 0,
      totalPartners: 0,
      totalNews: 0,
      totalStories: 0,
      totalEvents: 0,
      totalTestimonials: 0,
      totalDonations: 0,
    };
  }
}

export { client };
