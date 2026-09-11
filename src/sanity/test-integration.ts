/**
 * Test Sanity Integration
 * Verifies that content is accessible via GROQ queries
 */

import { client as sanityClient } from "./lib/client";
import {
  NEWS_LIST_QUERY as allNews,
  PROJECTS_LIST_QUERY as allProjects,
  PARTNERS_LIST_QUERY as allPartners,
  SUCCESS_STORIES_QUERY as allSuccessStories,
  EVENTS_LIST_QUERY as allEvents,
  IMPACT_METRICS_QUERY as dashboardMetrics,
} from "./queries/index";

const queries = {
  allNews,
  allProjects,
  allPartners,
  allSuccessStories,
  allEvents,
  dashboardMetrics,
};

async function testIntegration() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [news, projects, partners, stories, events] = await Promise.all([
      sanityClient.fetch(queries.allNews),
      sanityClient.fetch(queries.allProjects),
      sanityClient.fetch(queries.allPartners),
      sanityClient.fetch(queries.allSuccessStories),
      sanityClient.fetch(queries.allEvents),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const metrics = await sanityClient.fetch(queries.dashboardMetrics);

    if (news.length === 0 && projects.length === 0 && partners.length === 0) {
      process.exit(1);
    }

    process.exit(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    process.exit(1);
  }
}

testIntegration();
