export const translations = {
  ru: {
    nav: {
      works: "Работы",
      contact: "Связаться",
      language: "Язык",
    },
    hero: {
      title: "Fofan montage",
      kicker: "Портфолио видеомонтажа",
      subtitle:
        "Монтаж для YouTube, Reels, Shorts и динамичного контента, который удерживает внимание.",
      ctas: {
        telegramChannel: "Telegram Channel",
        fofanWeb: "Fofan web",
        youtube: "YouTube",
      },
      imageAlt: "Кинематографичная сцена видеомонтажа с красным светом",
    },
    works: {
      title: "Работы",
      description:
        "Подборка форматов для коротких вертикальных роликов и YouTube-видео. Ссылки легко заменить в конфиге.",
      watch: "Смотреть",
      preview: "Превью",
      linkPlaceholder: "Ссылка появится позже",
      types: {
        reels: "TikTok/Reels",
        youtube: "YouTube",
      },
    },
    contact: {
      title: "Связаться",
      description:
        "Напишите, если нужен монтаж для ролика, канала или серии коротких видео.",
      buttons: {
        telegramBot: "Telegram Bot",
      },
    },
    common: {
      unavailableLink: "Замените ссылку в конфиге",
    },
    footer: "© 2026 Fofan montage. All rights reserved.",
  },
  en: {
    nav: {
      works: "Works",
      contact: "Contact",
      language: "Language",
    },
    hero: {
      title: "Fofan montage",
      kicker: "Video editing portfolio",
      subtitle:
        "Video editing for YouTube, Reels, Shorts and dynamic content built to hold attention.",
      ctas: {
        telegramChannel: "Telegram Channel",
        fofanWeb: "Fofan web",
        youtube: "YouTube",
      },
      imageAlt: "Cinematic video editing scene with red light",
    },
    works: {
      title: "Works",
      description:
        "A focused set of formats for short vertical videos and YouTube edits. Replace links anytime in the config.",
      watch: "Watch",
      preview: "Preview",
      linkPlaceholder: "Link will be added later",
      types: {
        reels: "TikTok/Reels",
        youtube: "YouTube",
      },
    },
    contact: {
      title: "Contact",
      description:
        "Reach out for editing on a single video, a channel package or a short-form content series.",
      buttons: {
        telegramBot: "Telegram Bot",
      },
    },
    common: {
      unavailableLink: "Replace this link in the config",
    },
    footer: "© 2026 Fofan montage. All rights reserved.",
  },
} as const;

export type Language = keyof typeof translations;
