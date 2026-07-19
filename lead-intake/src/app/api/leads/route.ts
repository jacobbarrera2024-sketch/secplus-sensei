import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { CreateLeadPayload } from "@/lib/types";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Lead storage is not configured yet. Add Supabase environment variables to enable submissions.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as CreateLeadPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const service = body.service?.trim();
    const problemDescription = body.problemDescription?.trim();

    if (!name || !email || !service || !problemDescription) {
      return NextResponse.json(
        { error: "Name, email, service, and project details are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        company: body.company?.trim() || null,
        service,
        problem_description: problemDescription,
        ai_summary: body.aiSummary?.trim() || null,
        ai_tags: body.aiTags?.length ? body.aiTags : null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save your request right now." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ leads: [], configured: false });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [], configured: true });
}
