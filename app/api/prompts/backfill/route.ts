import { auth } from "@clerk/nextjs/server";
import { getSupabaseClient } from "@/lib/supabase";
import { requireSupabaseToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateEmbedding, getEmbeddingText } from "@/lib/embeddings";
import { generateUseCases } from "@/lib/ai";
import { ConfigError } from "@/lib/errors";

/**
 * One-time endpoint to backfill use_cases for existing prompts.
 * POST /api/prompts/backfill
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseToken = await requireSupabaseToken();
    const supabase = getSupabaseClient(supabaseToken);
    // Fetch all prompts without use_cases (RLS filters by user)
    const { data: prompts, error: fetchError } = await supabase
      .from("prompts")
      .select("id, name, content")
      .is("use_cases", null);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
    }

    if (!prompts || prompts.length === 0) {
      return NextResponse.json({ message: "No prompts to backfill", updated: 0 });
    }

    let updated = 0;
    const errors: string[] = [];

    for (const prompt of prompts) {
      try {
        // Generate use cases
        const useCases = await generateUseCases(prompt.name, prompt.content);

        // Regenerate embedding with use cases included
        const embeddingText = getEmbeddingText(prompt.name, prompt.content, useCases);
        const embedding = await generateEmbedding(embeddingText);

        // Update the prompt (RLS ensures only own prompts can be updated)
        const { error: updateError } = await supabase
          .from("prompts")
          .update({ use_cases: useCases, embedding })
          .eq("id", prompt.id);

        if (updateError) {
          errors.push(`Failed to update ${prompt.id}: ${updateError.message}`);
        } else {
          updated++;
        }
      } catch (err) {
        errors.push(`Error processing ${prompt.id}: ${err}`);
      }
    }

    return NextResponse.json({
      message: `Backfill complete`,
      total: prompts.length,
      updated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    if (error instanceof ConfigError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    console.error("Backfill error:", error);
    return NextResponse.json({ error: "Backfill failed" }, { status: 500 });
  }
}
