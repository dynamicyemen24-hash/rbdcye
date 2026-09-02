// Sanity Service - Client for fetching content from Sanity CMS
import { sanityClient } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const client = sanityClient;

const builder = imageUrlBuilder(client);

export const getImageUrl = (source: SanityImageSource) => {
  return builder.image(source).width(800).url();
};

export const sanityService = {
  getClient: () => client,

  getImageUrl: (source: SanityImageSource) => {
    return getImageUrl(source);
  },

  getNews: async () => {
    try {
      const query = `*[_type == "news"] | order(publishDate desc) {
        _id,
        title,
        excerpt,
        category,
        publishDate,
        mainImage,
        views
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  getProjects: async () => {
    try {
      const query = `*[_type == "project"] | order(orderRank) {
        _id,
        title,
        description,
        category,
        status,
        mainImage,
        progress,
        goalAmount,
        raisedAmount
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  getPrograms: async () => {
    try {
      const query = `*[_type == "program"] | order(orderRank) {
        _id,
        title,
        description,
        icon,
        mainImage
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  getSuccessStories: async () => {
    try {
      const query = `*[_type == "successStory"] | order(publishDate desc) {
        _id,
        title,
        story,
        beneficiaryName,
        mainImage,
        publishDate
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  getPartners: async () => {
    try {
      const query = `*[_type == "partner"] | order(orderRank) {
        _id,
        name,
        logo,
        website,
        type
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  getSettings: async () => {
    try {
      const query = `*[_type == "siteSettings"][0]`;
      return await client.fetch(query);
    } catch {
      return null;
    }
  },

  getMedia: async () => {
    try {
      const query = `*[_type == "media"] | order(_createdAt desc) {
        _id,
        title,
        type,
        file,
        date,
        altText
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  getReports: async () => {
    try {
      const query = `*[_type == "report"] | order(date desc) {
        _id,
        title,
        type,
        file,
        status,
        date
      }`;
      const items = await client.fetch(query);
      return items || [];
    } catch {
      return [];
    }
  },

  searchContent: async (query: string) => {
    try {
      const q = query.trim();
      if (!q) return null;
      const [projects, news, successStories, programs] = await Promise.all([
        client.fetch(
          `*[_type == "project" && (title match $q || description match $q)] | order(orderRank) { _id, title, slug, excerpt, image, sector, coverImage }[0...6]`,
          { q: `*${q}*` }
        ),
        client.fetch(
          `*[_type == "news" && (title match $q || summary match $q)] | order(publishDate desc) { _id, title, slug, summary, image, coverImage, publishDate }[0...6]`,
          { q: `*${q}*` }
        ),
        client.fetch(
          `*[_type == "successStory" && (title match $q || summary match $q)] | order(publishDate desc) { _id, title, slug, summary, image, coverImage, publishDate }[0...6]`,
          { q: `*${q}*` }
        ),
        client.fetch(
          `*[_type == "program" && (title match $q || description match $q)] | order(orderRank) { _id, title, slug, excerpt, image, coverImage }[0...6]`,
          { q: `*${q}*` }
        ),
      ]);
      return { projects, news, successStories, programs };
    } catch {
      return null;
    }
  },
};
