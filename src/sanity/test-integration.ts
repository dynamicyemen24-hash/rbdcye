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
  console.log("🔍 Testing Sanity Integration...\n");

  try {
    // Test 1: Fetch all content types
    console.log("1️⃣ Testing GROQ queries...");

    const [news, projects, partners, stories, events] = await Promise.all([
      sanityClient.fetch(queries.allNews),
      sanityClient.fetch(queries.allProjects),
      sanityClient.fetch(queries.allPartners),
      sanityClient.fetch(queries.allSuccessStories),
      sanityClient.fetch(queries.allEvents),
    ]);

    console.log(`  ✅ News: ${news.length} articles`);
    console.log(`  ✅ Projects: ${projects.length} projects`);
    console.log(`  ✅ Partners: ${partners.length} partners`);
    console.log(`  ✅ Success Stories: ${stories.length} stories`);
    console.log(`  ✅ Events: ${events.length} events`);

    // Test 2: Fetch metrics
    console.log("\n2️⃣ Testing dashboard metrics...");
    const metrics = await sanityClient.fetch(queries.dashboardMetrics);
    console.log("  ✅ Metrics:", JSON.stringify(metrics, null, 2));

    // Test 3: Display sample content
    console.log("\n3️⃣ Sample content from Sanity:");
    if (news.length > 0) {
      console.log(`  📰 Latest news: "${news[0].title}"`);
    }
    if (projects.length > 0) {
      console.log(`  📁 Latest project: "${projects[0].title}"`);
    }

    console.log("\n✅ Integration test passed!");
    console.log("🌐 Content is accessible via GROQ queries");
    console.log("🎨 Studio available at /admin/studio");
    console.log("📊 Dashboard metrics working\n");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Integration test failed:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

testIntegration();
