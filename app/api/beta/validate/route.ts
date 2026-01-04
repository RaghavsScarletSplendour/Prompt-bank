import { auth } from "@clerk/nextjs/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Beta code is required", code: "MISSING_CODE" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const supabase = getSupabaseServiceClient();

    // Check if user already has beta access
    const { data: existingAccess } = await supabase
      .from("beta_codes")
      .select("id")
      .eq("used_by", userId)
      .single();

    if (existingAccess) {
      return NextResponse.json({ success: true, message: "Already have beta access" });
    }

    // Find the code
    const { data: betaCode, error: findError } = await supabase
      .from("beta_codes")
      .select("*")
      .eq("code", normalizedCode)
      .single();

    if (findError || !betaCode) {
      return NextResponse.json(
        { error: "Invalid beta code", code: "INVALID_CODE" },
        { status: 400 }
      );
    }

    // Check if already used
    if (betaCode.is_used) {
      return NextResponse.json(
        { error: "This code has already been used", code: "CODE_USED" },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date(betaCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This code has expired", code: "CODE_EXPIRED" },
        { status: 400 }
      );
    }

    // Redeem the code
    const { error: updateError } = await supabase
      .from("beta_codes")
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq("id", betaCode.id);

    if (updateError) {
      console.error("Failed to redeem code:", updateError);
      return NextResponse.json(
        { error: "Failed to redeem code", code: "REDEEM_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Beta access granted!" });
  } catch (error) {
    console.error("Beta validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate code", code: "VALIDATION_FAILED" },
      { status: 500 }
    );
  }
}
