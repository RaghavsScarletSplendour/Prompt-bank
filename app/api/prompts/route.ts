import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { validatePromptInput } from "@/lib/validations";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }

  return NextResponse.json({ prompts: data });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = validatePromptInput(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, content, tags } = validation.data;

    const { data, error } = await supabase
      .from("prompts")
      .insert({ user_id: userId, name, tags, content })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
    }

    return NextResponse.json({ prompt: data });
  } catch (error) {
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
    console.error("Request error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
