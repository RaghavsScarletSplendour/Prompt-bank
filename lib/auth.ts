import { auth } from "@clerk/nextjs/server";

function safeJwtIssuer(token: string | null | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const iss = payload?.iss;
    return typeof iss === "string" ? iss : null;
  } catch {
    return null;
  }
}

function safeJwtMeta(token: string | null | undefined): {
  headerAlg?: string;
  headerKid?: string;
  headerTyp?: string;
  issuer?: string;
  audience?: string | string[];
  role?: string;
} {
  if (!token) return {};
  const parts = token.split(".");
  if (parts.length < 2) return {};
  try {
    const headerJson = Buffer.from(parts[0], "base64url").toString("utf8");
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);

    const headerAlg = typeof header?.alg === "string" ? header.alg : undefined;
    const headerKid = typeof header?.kid === "string" ? header.kid : undefined;
    const headerTyp = typeof header?.typ === "string" ? header.typ : undefined;
    const issuer = typeof payload?.iss === "string" ? payload.iss : undefined;
    const audience =
      typeof payload?.aud === "string" || Array.isArray(payload?.aud) ? payload.aud : undefined;
    const role = typeof payload?.role === "string" ? payload.role : undefined;

    return { headerAlg, headerKid, headerTyp, issuer, audience, role };
  } catch {
    return {};
  }
}

export async function getSupabaseToken(): Promise<string | null> {
  // #region agent log
  fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix2",
      hypothesisId: "H3",
      location: "lib/auth.ts:getSupabaseToken",
      message: "Clerk env key modes (no secrets)",
      data: {
        publishableKeyMode: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_")
            ? "test"
            : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_live_")
              ? "live"
              : "unknown"
          : "missing",
        secretKeyMode: process.env.CLERK_SECRET_KEY
          ? process.env.CLERK_SECRET_KEY.startsWith("sk_test_")
            ? "test"
            : process.env.CLERK_SECRET_KEY.startsWith("sk_live_")
              ? "live"
              : "unknown"
          : "missing",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  const a = await auth();
  // #region agent log
  fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H4",
      location: "lib/auth.ts:getSupabaseToken",
      message: "auth() context received",
      data: {
        hasUserId: Boolean((a as any)?.userId),
        hasSessionId: Boolean((a as any)?.sessionId),
        hasGetToken: typeof (a as any)?.getToken === "function",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  // #region agent log
  fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix2",
      hypothesisId: "H3",
      location: "lib/auth.ts:getSupabaseToken",
      message: "Requesting default Clerk session token (no template) to inspect issuer",
      data: {},
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  try {
    const defaultToken = await (a as any).getToken();
    const issuer = safeJwtIssuer(defaultToken);
    // #region agent log
    fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix2",
        hypothesisId: "H3",
        location: "lib/auth.ts:getSupabaseToken",
        message: "Default token issuer (iss) derived",
        data: { issuer },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  } catch (err: any) {
    // #region agent log
    fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix2",
        hypothesisId: "H3",
        location: "lib/auth.ts:getSupabaseToken",
        message: "Default getToken() (no template) threw",
        data: {
          name: err?.name,
          message: err?.message,
          status: err?.status,
          code: err?.code,
          clerkTraceId: err?.clerkTraceId,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  }

  // #region agent log
  fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "lib/auth.ts:getSupabaseToken",
      message: "Requesting Clerk token with template",
      data: { template: "supabase" },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  try {
    const token = await (a as any).getToken({ template: "supabase" });
    const meta = safeJwtMeta(token);
    // #region agent log
    fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "lib/auth.ts:getSupabaseToken",
        message: "getToken() returned",
        data: { tokenPresent: Boolean(token), jwt: meta },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
    return token;
  } catch (err: any) {
    // #region agent log
    fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "lib/auth.ts:getSupabaseToken",
        message: "getToken() threw",
        data: {
          name: err?.name,
          message: err?.message,
          status: err?.status,
          code: err?.code,
          clerkTraceId: err?.clerkTraceId,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
    throw err;
  }
}

export async function requireSupabaseToken(): Promise<string> {
  const token = await getSupabaseToken();
  // #region agent log
  fetch("http://127.0.0.1:7245/ingest/cb137be1-9c26-40ae-bf8b-1b9be3cdfd10", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "lib/auth.ts:requireSupabaseToken",
      message: "Token presence after getSupabaseToken()",
      data: { tokenPresent: Boolean(token) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log
  if (!token) throw new Error("Failed to get Supabase token");
  return token;
}
