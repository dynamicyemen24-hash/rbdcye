/**
 * Publish all draft documents to Sanity
 * Usage: npx tsx src/sanity/publish-all.ts
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xd0ohyiz",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function publishAll() {
  const drafts = await client.fetch(`*[_id in path("drafts.**")] { _id, _type, title }`);

  let published = 0;
  let skipped = 0;

  for (const d of drafts) {
    const pubId = d._id.replace("drafts.", "");
    try {
      await client.create({
        ...d,
        _id: pubId,
        _type: d._type,
      });
      await client.delete(d._id);
      published++;
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        // Document already published, just delete draft
        await client.delete(d._id);
        skipped++;
      }
    }
  }

  process.exit(0);
}

publishAll().catch(() => {
  process.exit(1);
});
