import { auth } from "@clerk/nextjs/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServiceClient();

    // Check if user has redeemed any beta code
    const { data, error } = await supabase
      .from("beta_codes")
      .select("id, code, used_at")
      .eq("used_by", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned (not an error for us)
      console.error("Beta status check error:", error);
    }

    return NextResponse.json({
      hasBetaAccess: !!data,
      redeemedAt: data?.used_at || null,
    });
  } catch (error) {
    console.error("Beta status error:", error);
    return NextResponse.json(
      { error: "Failed to check beta status" },
      { status: 500 }
    );
  }
}
