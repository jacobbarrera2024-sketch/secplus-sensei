import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { checkPublicRateLimit } from "@/lib/rate-limit";
import { createLeadSchema, getClientIp } from "@/lib/validation";

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

  const ip = getClientIp(request);
  const { allowed } = checkPublicRateLimit(`leads:${ip}`, 20);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this address. Try again later." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Invalid submission payload.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const {
      name,
      email,
      company,
      service,
      problemDescription,
      aiSummary,
      aiTags,
    } = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        company: company?.trim() || null,
        service,
        problem_description: problemDescription,
        ai_summary: aiSummary?.trim() || null,
        ai_tags: aiTags?.length ? aiTags : null,
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
