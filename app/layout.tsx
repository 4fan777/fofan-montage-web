import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { themeStorageKey } from "@/config/theme";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "wade montage — Дмитрий, видеомонтажёр",
  description:
    "Дмитрий, видеомонтажёр. Монтаж YouTube-видео, Reels и Shorts. Избранные работы и связь для заказа монтажа.",
  keywords: [
    "wade montage",
    "video editing",
    "YouTube editor",
    "Reels editor",
    "Shorts editor",
    "монтаж видео",
  ],
  metadataBase: new URL("https://wade-montage.vercel.app"),
  openGraph: {
    title: "wade montage",
    description:
      "Дмитрий. Монтаж YouTube-видео, Reels и Shorts.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "wade montage",
    description:
      "Дмитрий. Монтаж YouTube-видео, Reels и Shorts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={manrope.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Dark is the default; apply a saved light choice before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("${themeStorageKey}")==="light")document.documentElement.dataset.theme="light"}catch(e){}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
