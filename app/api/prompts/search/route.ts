import { auth } from "@clerk/nextjs/server";
import { getSupabaseClient } from "@/lib/supabase";
import { requireSupabaseToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/embeddings";
import { expandSearchQuery } from "@/lib/ai";
import { ConfigError, requireEnv, toErrorMessage } from "@/lib/errors";

function jsonError(args: {
  status: number;
  code: string;
  message: string;
  hint?: string;
  debug?: Record<string, unknown>;
}) {
  const { status, code, message, hint, debug } = args;
  return NextResponse.json(
    {
      error: message,
      code,
      hint,
      debug,
    },
    { status }
  );
}

function isSupabaseRpcNotFound(err: unknown): boolean {
  const message = (err as any)?.message;
  const code = (err as any)?.code;
  if (code === "PGRST202") return true; // "Could not find the function ..."
  if (typeof message !== "string") return false;
  return (
    message.includes("Could not find the function") ||
    (message.toLowerCase().includes("match_prompts") && message.toLowerCase().includes("function"))
  );
}

function isSupabaseColumnMissing(err: unknown, table: string, column: string): boolean {
  const code = (err as any)?.code;
  const message = (err as any)?.message;
  if (code !== "42703") return false; // undefined_column
  if (typeof message !== "string") return false;
  const needle = `column ${table}.${column} does not exist`;
  return message.toLowerCase().includes(needle.toLowerCase());
}

function getOpenAIErrorMeta(err: unknown): { status?: number; code?: string } {
  const status = (err as any)?.status ?? (err as any)?.response?.status;
  const code = (err as any)?.code ?? (err as any)?.error?.code;
  return {
    status: typeof status === "number" ? status : undefined,
    code: typeof code === "string" ? code : undefined,
  };
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError({
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Unauthorized",
      hint: "Sign in and try again.",
    });
  }

  try {
    // Fail fast with a clear message (otherwise OpenAI failures can look like generic 500s)
    requireEnv("OPENAI_API_KEY");

    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      return jsonError({
        status: 400,
        code: "INVALID_JSON",
        message: "Invalid JSON body",
        hint: 'Send { "query": "..." } as JSON.',
        debug: { error: toErrorMessage(err) },
      });
    }

    const { query, limit = 10 } = body ?? {};

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return jsonError({
        status: 400,
        code: "INVALID_QUERY",
        message: "Query is required",
        hint: "Provide a non-empty query string.",
      });
    }

    // Expand query with related terms for better intent matching
    const expandedQuery = await expandSearchQuery(query.trim());

    // Generate embedding for expanded search query
    const queryEmbedding = await generateEmbedding(expandedQuery);

    // Call Supabase RPC function for vector similarity search
    const supabaseToken = await requireSupabaseToken();
    const supabase = getSupabaseClient(supabaseToken);
    const { data, error } = await supabase.rpc("match_prompts", {
      query_embedding: queryEmbedding,
      match_count: limit,
      match_threshold: 0.4,
    });

    if (error) {
      console.error("Search error:", error);
      if (isSupabaseRpcNotFound(error)) {
        return jsonError({
          status: 500,
          code: "SUPABASE_RPC_NOT_FOUND",
          message: "Supabase RPC function match_prompts was not found",
          hint: 'Create the Postgres function (RPC) named "match_prompts" in Supabase, or update the route to call the correct function name.',
          debug: {
            supabaseCode: (error as any)?.code,
            supabaseMessage: (error as any)?.message,
          },
        });
      }

      if (isSupabaseColumnMissing(error, "prompts", "tags")) {
        return jsonError({
          status: 500,
          code: "SUPABASE_SCHEMA_MISMATCH",
          message: "Semantic search is misconfigured: prompts.tags column is missing",
          hint:
            'Fix in Supabase: update the "match_prompts" RPC function to stop referencing prompts.tags (this app no longer uses tags).',
          debug: {
            supabaseCode: (error as any)?.code,
            supabaseMessage: (error as any)?.message,
          },
        });
      }

      return jsonError({
        status: 500,
        code: "SUPABASE_RPC_ERROR",
        message: "Supabase semantic search RPC failed",
        hint: "Check Supabase logs for details.",
        debug: {
          supabaseCode: (error as any)?.code,
          supabaseMessage: (error as any)?.message,
        },
      });
    }

    return NextResponse.json({ prompts: data });
  } catch (error) {
    if (error instanceof ConfigError) {
      return jsonError({
        status: 500,
        code: error.code,
        message: error.message,
        hint: "Add the missing environment variable and restart the dev server.",
      });
    }

    // Heuristic: OpenAI SDK throws errors with a numeric `status`.
    const openaiMeta = getOpenAIErrorMeta(error);
    if (openaiMeta.status) {
      if (openaiMeta.status === 401 || openaiMeta.status === 403) {
        return jsonError({
          status: 500,
          code: "OPENAI_AUTH_FAILED",
          message: "OpenAI authentication failed",
          hint: "Verify OPENAI_API_KEY is set and valid (and restart the dev server).",
          debug: { upstreamStatus: openaiMeta.status, upstreamCode: openaiMeta.code },
        });
      }
      if (openaiMeta.status === 429) {
        return jsonError({
          status: 500,
          code: "OPENAI_RATE_LIMITED",
          message: "OpenAI rate limit exceeded",
          hint: "Wait a moment and retry, or reduce request volume.",
          debug: { upstreamStatus: openaiMeta.status, upstreamCode: openaiMeta.code },
        });
      }
      return jsonError({
        status: 500,
        code: "OPENAI_ERROR",
        message: "OpenAI request failed",
        hint: "Check server logs for more details.",
        debug: { upstreamStatus: openaiMeta.status, upstreamCode: openaiMeta.code },
      });
    }

    console.error("Request error:", error);
    return jsonError({
      status: 500,
      code: "SEARCH_FAILED",
      message: "Search failed",
      hint: "Check server logs for details.",
      debug: { error: toErrorMessage(error) },
    });
  }
}
