import { auth } from "@clerk/nextjs/server";
import { getSupabaseClient } from "@/lib/supabase";
import { requireSupabaseToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { validatePromptInput } from "@/lib/validations";
import { generateEmbedding, getEmbeddingText } from "@/lib/embeddings";
import { generateUseCases } from "@/lib/ai";
import { ConfigError } from "@/lib/errors";

function isClerkTokenTemplateNotFound(err: unknown): boolean {
  const status = (err as any)?.status;
  const name = (err as any)?.name;
  const code = (err as any)?.code;
  const message = (err as any)?.message;
  return (
    name === "ClerkAPIResponseError" &&
    status === 404 &&
    code === "api_response_error" &&
    typeof message === "string" &&
    message.toLowerCase().includes("not found")
  );
}

export async function GET() {
  const { userId } = await auth();
  console.log("Clerk userId:", userId);
  // #region agent log
  fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H4",
      location: "app/api/prompts/route.ts:GET",
      message: "Route entry",
      data: { hasUserId: Boolean(userId) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      const supabaseToken = await requireSupabaseToken();
      supabase = getSupabaseClient(supabaseToken);
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:GET",
          message: "Using Supabase user client (Clerk JWT template succeeded)",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
    } catch (err) {
      if (!isClerkTokenTemplateNotFound(err)) throw err;
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:GET",
          message: "Falling back to Supabase service-role (Clerk JWT template not found)",
          data: {
            clerkStatus: (err as any)?.status,
            clerkCode: (err as any)?.code,
            clerkTraceId: (err as any)?.clerkTraceId,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
      return NextResponse.json(
        {
          error: "Supabase auth token template is misconfigured",
          code: "CLERK_SUPABASE_TEMPLATE_NOT_FOUND",
          hint:
            'Ensure Clerk has a JWT template named "supabase" AND Supabase JWT settings trust the Clerk issuer/JWKS for this environment.',
        },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix2",
          hypothesisId: "H6",
          location: "app/api/prompts/route.ts:GET",
          message: "Supabase query error",
          data: { supabaseCode: (error as any)?.code, supabaseMessage: (error as any)?.message },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
    }

    return NextResponse.json({ prompts: data });
  } catch (err) {
    if (err instanceof ConfigError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 500 });
    }
    console.error("Request error:", err);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      const supabaseToken = await requireSupabaseToken();
      supabase = getSupabaseClient(supabaseToken);
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:POST",
          message: "Using Supabase user client (Clerk JWT template succeeded)",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
    } catch (err) {
      if (!isClerkTokenTemplateNotFound(err)) throw err;
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:POST",
          message: "Falling back to Supabase service-role (Clerk JWT template not found)",
          data: {
            clerkStatus: (err as any)?.status,
            clerkCode: (err as any)?.code,
            clerkTraceId: (err as any)?.clerkTraceId,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
      return NextResponse.json(
        {
          error: "Supabase auth token template is misconfigured",
          code: "CLERK_SUPABASE_TEMPLATE_NOT_FOUND",
          hint:
            'Ensure Clerk has a JWT template named "supabase" AND Supabase JWT settings trust the Clerk issuer/JWKS for this environment.',
        },
        { status: 500 }
      );
    }
    const body = await req.json();
    const validation = validatePromptInput(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, content } = validation.data;
    const category_id = body.category_id || null;

    // Generate use cases for intent-based search (graceful degradation if it fails)
    let useCases: string | null = null;
    try {
      useCases = await generateUseCases(name, content);
    } catch (error) {
      console.error("Failed to generate use cases:", error);
    }

    // Generate embedding for semantic search (graceful degradation if it fails)
    let embedding: number[] | null = null;
    try {
      const embeddingText = getEmbeddingText(name, content, useCases);
      embedding = await generateEmbedding(embeddingText);
    } catch (error) {
      console.error("Failed to generate embedding:", error);
    }

    const { data, error } = await supabase
      .from("prompts")
      .insert({ user_id: userId, name, content, embedding, use_cases: useCases, category_id })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
    }

    return NextResponse.json({ prompt: data });
  } catch (error) {
    if (error instanceof ConfigError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    console.error("Request error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      const supabaseToken = await requireSupabaseToken();
      supabase = getSupabaseClient(supabaseToken);
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:PUT",
          message: "Using Supabase user client (Clerk JWT template succeeded)",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
    } catch (err) {
      if (!isClerkTokenTemplateNotFound(err)) throw err;
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:PUT",
          message: "Falling back to Supabase service-role (Clerk JWT template not found)",
          data: {
            clerkStatus: (err as any)?.status,
            clerkCode: (err as any)?.code,
            clerkTraceId: (err as any)?.clerkTraceId,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
      return NextResponse.json(
        {
          error: "Supabase auth token template is misconfigured",
          code: "CLERK_SUPABASE_TEMPLATE_NOT_FOUND",
          hint:
            'Ensure Clerk has a JWT template named "supabase" AND Supabase JWT settings trust the Clerk issuer/JWKS for this environment.',
        },
        { status: 500 }
      );
    }
    const body = await req.json();
    const { id } = body;

    // Validate ID exists and matches UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
      return NextResponse.json({ error: "Valid prompt ID is required" }, { status: 400 });
    }

    // Validate input using shared validation
    const validation = validatePromptInput(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, content } = validation.data;
    const category_id = body.category_id !== undefined ? body.category_id : undefined;

    // Regenerate use cases for intent-based search (graceful degradation if it fails)
    let useCases: string | null = null;
    try {
      useCases = await generateUseCases(name, content);
    } catch (error) {
      console.error("Failed to generate use cases:", error);
    }

    // Regenerate embedding for semantic search (graceful degradation if it fails)
    let embedding: number[] | null = null;
    try {
      const embeddingText = getEmbeddingText(name, content, useCases);
      embedding = await generateEmbedding(embeddingText);
    } catch (error) {
      console.error("Failed to generate embedding:", error);
    }

    const updateData: Record<string, unknown> = { name, content, embedding, use_cases: useCases };
    if (category_id !== undefined) {
      updateData.category_id = category_id;
    }

    const { data, error } = await supabase
      .from("prompts")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
    }

    return NextResponse.json({ prompt: data });
  } catch (error) {
    if (error instanceof ConfigError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    console.error("Request error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      const supabaseToken = await requireSupabaseToken();
      supabase = getSupabaseClient(supabaseToken);
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:DELETE",
          message: "Using Supabase user client (Clerk JWT template succeeded)",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
    } catch (err) {
      if (!isClerkTokenTemplateNotFound(err)) throw err;
      // #region agent log
      fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "post-fix",
          hypothesisId: "H1",
          location: "app/api/prompts/route.ts:DELETE",
          message: "Falling back to Supabase service-role (Clerk JWT template not found)",
          data: {
            clerkStatus: (err as any)?.status,
            clerkCode: (err as any)?.code,
            clerkTraceId: (err as any)?.clerkTraceId,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
      return NextResponse.json(
        {
          error: "Supabase auth token template is misconfigured",
          code: "CLERK_SUPABASE_TEMPLATE_NOT_FOUND",
          hint:
            'Ensure Clerk has a JWT template named "supabase" AND Supabase JWT settings trust the Clerk issuer/JWKS for this environment.',
        },
        { status: 500 }
      );
    }
    const body = await req.json();
    const { id } = body;

    // Validate ID exists, is a string, and matches UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
      return NextResponse.json({ error: "Valid prompt ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("prompts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ConfigError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    console.error("Request error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
