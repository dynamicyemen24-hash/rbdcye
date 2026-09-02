/**
 * Centralized GROQ Queries
 * جميع استعلامات GROQ محسّنة مع defineQuery لدعم TypeGen
 */
import { defineQuery } from "groq";

// ============ Image Fragment ============
export const imageFragment = defineQuery(`
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  alt,
  hotspot,
  crop
`);

// ============ SEO Fragment ============
export const seoFragment = defineQuery(`
  seo {
    metaTitle,
    metaDescription,
    ogImage {
      ${imageFragment}
    },
    noIndex,
    canonicalUrl
  }
`);

// ============ Projects ============
export const PROJECTS_LIST_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && status != "pending"]
  | order(featured desc, _createdAt desc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    status,
    progress,
    budget,
    beneficiaries,
    location,
    mainImage {
      ${imageFragment}
    },
    startDate,
    endDate,
    featured,
    ${seoFragment}
  }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    status,
    progress,
    budget,
    beneficiaries,
    location,
    mainImage {
      ${imageFragment}
    },
    gallery[] {
      asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      }
    },
    startDate,
    endDate,
    featured,
    ${seoFragment}
  }
`);

// ============ News ============
export const NEWS_LIST_QUERY = defineQuery(`
  *[_type == "news" && defined(slug.current) && status == "PUBLISHED"]
  | order(featured desc, publishDate desc) [0...30] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    author,
    mainImage {
      ${imageFragment}
    },
    publishDate,
    tags,
    featured,
    ${seoFragment}
  }
`);

export const NEWS_BY_SLUG_QUERY = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    content,  // Portable Text content
    excerpt,
    category,
    author,
    mainImage {
      ${imageFragment}
    },
    publishDate,
    tags,
    featured,
    ${seoFragment}
  }
`);

// ============ Partners ============
export const PARTNERS_LIST_QUERY = defineQuery(`
  *[_type == "partner" && status == "active"] | order(name asc) {
    _id,
    name,
    type,
    description,
    logo {
      ${imageFragment}
    },
    website
  }
`);

// ============ Media ============
export const MEDIA_LIST_QUERY = defineQuery(`
  *[_type == "media" && status == "published"]
  | order(isFeatured desc, publishDate desc) {
    _id,
    title,
    type,
    imageFile {
      ${imageFragment}
    },
    description,
    category,
    tags,
    albums,
    isFeatured,
    isCover,
    publishDate,
    ${seoFragment}
  }
`);

// ============ Success Stories ============
export const SUCCESS_STORIES_QUERY = defineQuery(`
  *[_type == "successStory" && status == "published"]
  | order(featured desc, _createdAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    name,
    program,
    quote,
    mainImage {
      ${imageFragment}
    },
    featured,
    ${seoFragment}
  }
`);

// ============ Videos ============
export const VIDEOS_LIST_QUERY = defineQuery(`
  *[_type == "video" && defined(slug.current)]
  | order(isFeatured desc, publishDate desc) [0...30] {
    _id,
    title,
    "slug": slug.current,
    description,
    thumbnail {
      ${imageFragment}
    },
    videoUrl,
    videoFile {
      asset->{ url, metadata { dimensions } }
    },
    duration,
    category,
    tags,
    isFeatured,
    isStoryVideo,
    views,
    likes,
    publishDate,
    chapters[] {
      time,
      title
    },
    ${seoFragment}
  }
`);

export const VIDEO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "video" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    thumbnail {
      ${imageFragment}
    },
    videoUrl,
    videoFile {
      asset->{ url, metadata { dimensions } }
    },
    duration,
    category,
    tags,
    isFeatured,
    isStoryVideo,
    views,
    likes,
    publishDate,
    chapters[] {
      time,
      title
    },
    ${seoFragment}
  }
`);

export const FEATURED_VIDEOS_QUERY = defineQuery(`
  *[_type == "video" && isFeatured == true && defined(slug.current)]
  | order(publishDate desc) [0...10] {
    _id,
    title,
    "slug": slug.current,
    description,
    thumbnail {
      ${imageFragment}
    },
    videoUrl,
    videoFile {
      asset->{ url }
    },
    duration,
    category,
    tags,
    isStoryVideo,
    views,
    likes,
    publishDate,
    chapters[] {
      time,
      title
    }
  }
`);

export const STORY_VIDEO_QUERY = defineQuery(`
  *[_type == "video" && isStoryVideo == true && isFeatured == true && defined(slug.current)][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    thumbnail {
      ${imageFragment}
    },
    videoUrl,
    videoFile {
      asset->{ url }
    },
    duration,
    category,
    tags,
    views,
    likes,
    publishDate,
    chapters[] {
      time,
      title
    }
  }
`);

export const VIDEOS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "video" && category == $category && defined(slug.current)]
  | order(publishDate desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    description,
    thumbnail {
      ${imageFragment}
    },
    videoUrl,
    duration,
    category,
    tags,
    isFeatured,
    views,
    likes,
    publishDate,
    chapters[] {
      time,
      title
    }
  }
`);

export const VIDEO_SITEMAP_QUERY = defineQuery(`
  *[_type == "video" && defined(slug.current) && seo.noIndex != true] {
    "url": "/video/" + slug.current,
    "title": title,
    "description": description,
    "thumbnailUrl": thumbnail.asset->url,
    "contentUrl": coalesce(videoUrl, videoFile.asset->url),
    "duration": duration,
    "publishDate": publishDate,
    "category": category,
    "views": views,
    "likes": likes
  }
`);

// ============ Reports ============
export const REPORTS_LIST_QUERY = defineQuery(`
  *[_type == "report" && status == "published"] | order(date desc) [0...20] {
    _id,
    title,
    type,
    file {
      asset->{ url, originalFilename }
    },
    date
  }
`);

// ============ Events ============
export const EVENTS_LIST_QUERY = defineQuery(`
  *[_type == "event" && status != "cancelled"]
  | order(startDate desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    description,
    mainImage {
      ${imageFragment}
    },
    type,
    startDate,
    endDate,
    location,
    status,
    featured,
    capacity,
    registeredCount,
    ${seoFragment}
  }
`);

// ============ Testimonials ============
export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && status == "published"] {
    _id,
    name,
    role,
    quote,
    photo {
      ${imageFragment}
    },
    rating
  }
`);

// ============ FAQs ============
export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`);

// ============ Site Settings (Single Document) ============
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    tagline,
    description,
    logo {
      ${imageFragment}
    },
    favicon {
      asset->{ url }
    },
    socialLinks[] {
      platform,
      url
    },
    youtubeChannelUrl,
    contactInfo {
      phone,
      phoneSecondary,
      whatsapp,
      email,
      emailInfo,
      address,
      workingHours,
      mapUrl
    },
    heroPoster {
      ${imageFragment}
    },
    heroVideoUrl,
    heroVideoMuted,
    heroVideoLoop,
    ${seoFragment}
  }
`);

// ============ Global Nav Links ============
export const NAV_LINKS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    "navLinks": [
      { "label": "الرئيسية", "href": "/" },
      { "label": "من نحن", "href": "/about" },
      { "label": "برامجنا", "href": "/programs" },
      { "label": "مشاريعنا", "href": "/projects" },
      { "label": "قصص النجاح", "href": "/success" },
      { "label": "الأخبار", "href": "/news" },
      { "label": "معرض الوسائط", "href": "/media" },
      { "label": "التقارير", "href": "/reports" },
      { "label": "الشركاء", "href": "/partners" },
      { "label": "تواصل معنا", "href": "/contact" }
    ]
  }
`);

// ============ Sitemap ============
export const SITEMAP_QUERY = defineQuery(`
  *[_type in ["project", "news", "successStory"] && defined(slug.current) && seo.noIndex != true] {
    "href": "/" + slug.current,
    _updatedAt
  }
`);

// ============ Home Page Featured Content ============
export const HOME_FEATURED_QUERY = defineQuery(`
  {
    "featuredProjects": *[_type == "project" && featured == true && status == "active"]
      | order(_createdAt desc) [0...3] {
        _id, title, "slug": slug.current, description, category,
        mainImage { ${imageFragment} }
      },
    "featuredNews": *[_type == "news" && featured == true && status == "PUBLISHED"]
      | order(publishDate desc) [0...3] {
        _id, title, "slug": slug.current, excerpt, category,
        mainImage { ${imageFragment} }, publishDate
      },
    "featuredStories": *[_type == "successStory" && featured == true && status == "published"]
      | order(_createdAt desc) [0...3] {
        _id, title, "slug": slug.current, name, quote,
        mainImage { ${imageFragment} }
      },
    "featuredVideos": *[_type == "video" && isFeatured == true]
      | order(publishDate desc) [0...3] {
        _id, title, "slug": slug.current, description,
        thumbnail { ${imageFragment} }, videoUrl, duration
      }
  }
`);

// ============ Impact Metrics ============
export const IMPACT_METRICS_QUERY = defineQuery(`
  {
    "totalProjects": count(*[_type == "project"]),
    "activeProjects": count(*[_type == "project" && status == "active"]),
    "totalBeneficiaries": sum(*[_type == "project"].beneficiaries),
    "totalPartners": count(*[_type == "partner" && status == "active"]),
    "totalVolunteers": count(*[_type == "volunteer" && status == "active"]),
    "totalDonations": count(*[_type == "donation" && status == "completed"]),
    "totalDonationAmount": sum(*[_type == "donation" && status == "completed"].amount)
  }
`);

