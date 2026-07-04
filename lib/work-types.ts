import type { Language } from "@/config/translations";

export type WorkKind = "reels" | "youtube";
export type WorkFrame = "9:16" | "16:9";

export type SiteWorkItem = {
  id: string;
  kind: WorkKind;
  title: Record<Language, string>;
  href: string;
  frame: WorkFrame;
};

export type WorkRow = {
  id: string;
  title: string;
  type: WorkKind;
  video_url: string;
  frame: WorkFrame;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkInput = {
  title: string;
  type: WorkKind;
  video_url: string;
  frame: WorkFrame;
  sort_order: number;
  is_published: boolean;
};
