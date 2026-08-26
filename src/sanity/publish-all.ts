/**
 * Publish all draft documents to Sanity
 * Usage: npx tsx src/sanity/publish-all.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'xd0ohyiz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function publishAll() {
  console.log('📦 Publishing all drafts...\n');
  
  const drafts = await client.fetch(`*[_id in path("drafts.**")] { _id, _type, title }`);
  console.log(`Found ${drafts.length} drafts\n`);

  let published = 0;
  let skipped = 0;

  for (const d of drafts) {
    const pubId = d._id.replace('drafts.', '');
    try {
      await client.create({
        ...d,
        _id: pubId,
        _type: d._type,
      });
      await client.delete(d._id);
      console.log(`✅ Published: ${d.title || d._type} (${pubId})`);
      published++;
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        // Document already published, just delete draft
        await client.delete(d._id);
        console.log(`⏭️ Already published, draft deleted: ${d.title || d._type}`);
        skipped++;
      } else {
        console.log(`❌ Failed: ${d._id} - ${e.message}`);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Published: ${published}`);
  console.log(`   Skipped (already published): ${skipped}`);
  console.log(`   Total processed: ${drafts.length}`);
  process.exit(0);
}

publishAll().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});