import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fofan montage | Video editing portfolio",
  description:
    "Premium video editing portfolio for YouTube, Reels, Shorts and dynamic social content.",
  keywords: [
    "Fofan montage",
    "video editing",
    "YouTube editor",
    "Reels editor",
    "Shorts editor",
    "монтаж видео",
  ],
  metadataBase: new URL("https://fofan-montage.vercel.app"),
  openGraph: {
    title: "Fofan montage",
    description:
      "Cinematic video editing for YouTube, Reels, Shorts and dynamic content.",
    type: "website",
    images: [
      {
        url: "/hero/fofan-hero.png",
        width: 1536,
        height: 1024,
        alt: "Fofan montage cinematic editing scene",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fofan montage",
    description:
      "Cinematic video editing for YouTube, Reels, Shorts and dynamic content.",
    images: ["/hero/fofan-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
