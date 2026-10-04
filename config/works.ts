import type { SiteWorkItem } from "@/lib/work-types";

export const works: SiteWorkItem[] = [
  {
    id: "vertical-reels",
    kind: "reels",
    title: {
      ru: "Динамичный Reels монтаж",
      en: "Dynamic Reels edit",
    },
    // Local video file served from /public.
    href: "/reels.mp4",
    thumbnail: "/reels-preview.jpg",
    frame: "9:16",
  },
  {
    id: "youtube-dynamic",
    kind: "youtube",
    title: {
      ru: "Динамичный ролик",
      en: "High-energy video",
    },
    // Replace with the real YouTube URL.
    href: "https://youtu.be/o06bDTg3rUY",
    frame: "16:9",
  },
  {
    id: "youtube-story",
    kind: "youtube",
    title: {
      ru: "Туториал",
      en: "Tutorial",
    },
    // Replace with the real YouTube URL.
    href: "https://youtu.be/eNbiIc5AtiA?si=aZ4ravF6r2IFAvFX",
    frame: "16:9",
  },
  {
    id: "youtube-opener",
    kind: "youtube",
    title: {
      ru: "YouTube интро",
      en: "YouTube opener",
    },
    // Replace with the real YouTube URL.
    href: "https://youtu.be/R6D1iVwefPk?si=BPJ0lPDdw2pBpTvP",
    frame: "16:9",
  },
];
