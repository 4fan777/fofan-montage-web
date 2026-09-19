import type { Metadata } from "next";
import { Manrope } from "next/font/google";
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
    <html lang="ru" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
