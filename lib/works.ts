import { works as fallbackWorks } from "@/config/works";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type { SiteWorkItem, WorkRow } from "@/lib/work-types";

function mapRowToSiteWork(row: WorkRow): SiteWorkItem {
  return {
    id: row.id,
    kind: row.type,
    title: {
      ru: row.title,
      en: row.title,
    },
    href: row.video_url,
    frame: row.frame,
  };
}

export async function getPublishedWorks(): Promise<SiteWorkItem[]> {
  if (!hasSupabaseAdminConfig()) {
    return fallbackWorks;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch published works:", error.message);
    return fallbackWorks;
  }

  return data.map(mapRowToSiteWork);
}
