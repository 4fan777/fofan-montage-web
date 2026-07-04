import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type { WorkFrame, WorkInput, WorkKind } from "@/lib/work-types";

type AdminAction =
  | {
      action: "list";
      accessKey: string;
      password: string;
    }
  | {
      action: "create";
      accessKey: string;
      password: string;
      work: WorkInput;
    }
  | {
      action: "update";
      accessKey: string;
      password: string;
      id: string;
      work: WorkInput;
    }
  | {
      action: "delete";
      accessKey: string;
      password: string;
      id: string;
    };

const allowedTypes = new Set<WorkKind>(["reels", "youtube"]);
const allowedFrames = new Set<WorkFrame>(["9:16", "16:9"]);

function unauthorized() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

function isAdminRequest(payload: unknown): payload is AdminAction {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as Record<string, unknown>;
  return (
    data.accessKey === process.env.ADMIN_ACCESS_KEY &&
    data.password === process.env.ADMIN_PASSWORD
  );
}

function validateWorkInput(value: unknown): WorkInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const videoUrl =
    typeof input.video_url === "string" ? input.video_url.trim() : "";
  const type = input.type;
  const frame = input.frame;
  const sortOrder =
    typeof input.sort_order === "number" && Number.isFinite(input.sort_order)
      ? Math.trunc(input.sort_order)
      : 100;
  const isPublished =
    typeof input.is_published === "boolean" ? input.is_published : true;

  if (!title || !videoUrl) {
    return null;
  }

  try {
    new URL(videoUrl);
  } catch {
    return null;
  }

  if (!allowedTypes.has(type as WorkKind) || !allowedFrames.has(frame as WorkFrame)) {
    return null;
  }

  return {
    title,
    video_url: videoUrl,
    type: type as WorkKind,
    frame: frame as WorkFrame,
    sort_order: sortOrder,
    is_published: isPublished,
  };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return unauthorized();
  }

  if (!isAdminRequest(payload)) {
    return unauthorized();
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const supabase = getSupabaseAdmin();

  if (payload.action === "list") {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ works: data });
  }

  if (payload.action === "create") {
    const work = validateWorkInput(payload.work);

    if (!work) {
      return NextResponse.json({ error: "Invalid work data." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("works")
      .insert(work)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ work: data });
  }

  if (payload.action === "update") {
    const work = validateWorkInput(payload.work);

    if (!work || !payload.id) {
      return NextResponse.json({ error: "Invalid work data." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("works")
      .update({ ...work, updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ work: data });
  }

  if (payload.action === "delete") {
    if (!payload.id) {
      return NextResponse.json({ error: "Invalid work id." }, { status: 400 });
    }

    const { error } = await supabase.from("works").delete().eq("id", payload.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  return unauthorized();
}
