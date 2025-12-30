// Run with: npx tsx scripts/backfill-embeddings.ts
// Loads environment variables from .env.local

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Load .env.local file
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error("Missing required environment variables:");
  if (!supabaseUrl) console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseKey) console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  if (!openaiKey) console.error("  - OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function backfillEmbeddings() {
  console.log("Fetching prompts without embeddings...");

  // Fetch prompts without embeddings
  const { data: prompts, error } = await supabase
    .from("prompts")
    .select("id, name, content")
    .is("embedding", null);

  if (error) {
    console.error("Failed to fetch prompts:", error);
    process.exit(1);
  }

  if (!prompts || prompts.length === 0) {
    console.log("No prompts need embeddings. All done!");
    return;
  }

  console.log(`Found ${prompts.length} prompts to backfill\n`);

  let success = 0;
  let failed = 0;

  for (const prompt of prompts) {
    const text = [prompt.name, prompt.content]
      .filter(Boolean)
      .join(" ");

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      const embedding = response.data[0].embedding;

      const { error: updateError } = await supabase
        .from("prompts")
        .update({ embedding })
        .eq("id", prompt.id);

      if (updateError) {
        console.error(`Failed to update "${prompt.name}":`, updateError.message);
        failed++;
      } else {
        console.log(`Updated: ${prompt.name}`);
        success++;
      }
    } catch (err) {
      console.error(`Failed to embed "${prompt.name}":`, err);
      failed++;
    }

    // Rate limit: wait 100ms between requests
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\nBackfill complete!`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed: ${failed}`);
}

backfillEmbeddings();
