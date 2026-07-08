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

function mergeWithFallbackWorks(databaseWorks: SiteWorkItem[]) {
  const databaseLinks = new Set(
    databaseWorks
      .map((work) => work.href.trim().toLowerCase())
      .filter(Boolean),
  );
  const linkedDatabaseWorks = databaseWorks.filter((work) => work.href.trim());
  const emptyDatabaseWorks = databaseWorks.filter((work) => !work.href.trim());
  const missingFallbackWorks = fallbackWorks.filter((work) => {
    const fallbackLink = work.href.trim().toLowerCase();

    return !fallbackLink || !databaseLinks.has(fallbackLink);
  });

  return [...linkedDatabaseWorks, ...missingFallbackWorks, ...emptyDatabaseWorks];
}

export async function getPublishedWorks(): Promise<SiteWorkItem[]> {
  if (!hasSupabaseAdminConfig()) {
    return fallbackWorks;
  }

  try {
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

    return mergeWithFallbackWorks(data.map(mapRowToSiteWork));
  } catch (error) {
    console.error(
      "Failed to connect to Supabase works:",
      error instanceof Error ? error.message : error,
    );
    return fallbackWorks;
  }
}
