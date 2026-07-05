"use client";

import Image from "next/image";
import { MouseEvent, useMemo, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { contactLinks, heroLinks } from "@/config/links";
import { translations, type Language } from "@/config/translations";
import type { SiteWorkItem } from "@/lib/work-types";

const themes = ["black", "white"] as const;
type Theme = (typeof themes)[number];

const revealTransition = {
  duration: 0.72,
  ease: [0.16, 1, 0.3, 1],
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
};

export function FofanPortfolio({
  initialWorks,
}: {
  initialWorks: SiteWorkItem[];
}) {
  const language: Language = "ru";
  const [theme, setTheme] = useState<Theme>("black");
  const t = translations[language];
  const shouldReduceMotion = useReducedMotion();

  const heroActions = useMemo(
    () => [
      {
        label: t.hero.ctas.telegramChannel,
        href: heroLinks.telegramChannel,
        tone: "primary" as const,
      },
      {
        label: t.hero.ctas.fofanWeb,
        href: heroLinks.fofanWeb,
        tone: "secondary" as const,
      },
      {
        label: t.hero.ctas.youtube,
        href: heroLinks.youtube,
        tone: "secondary" as const,
      },
    ],
    [t.hero.ctas.fofanWeb, t.hero.ctas.telegramChannel, t.hero.ctas.youtube],
  );

  const contactActions = useMemo(
    () => [
      {
        label: t.contact.buttons.telegramBot,
        href: contactLinks.telegramBot,
      },
    ],
    [t.contact.buttons.telegramBot],
  );

  return (
    <MotionConfig reducedMotion="user">
      <main
        className={`relative isolate min-h-[100dvh] overflow-hidden bg-fofan-bg text-fofan-text ${
          theme === "white" ? "theme-white" : ""
        }`}
      >
        <BackgroundLayer />
        <Header theme={theme} setTheme={setTheme} t={t} />

        <section className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-7xl items-center gap-10 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pt-24">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
            className="max-w-3xl"
          >
            <p className="mb-5 font-mono text-xs text-fofan-red-soft sm:text-sm">
              {t.hero.kicker}
            </p>
            <h1 className="max-w-[10ch] text-6xl font-semibold leading-[0.9] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">
              {t.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {heroActions.map((action) => (
                <ActionLink
                  key={action.label}
                  href={action.href}
                  label={action.label}
                  unavailableLabel={t.common.unavailableLink}
                  tone={action.tone}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: 0.16 }}
            className="relative"
          >
            <div className="absolute inset-6 rounded-[42px] bg-fofan-red/20 blur-3xl" />
            <div className="glass-shell relative overflow-hidden rounded-[28px] p-2 sm:rounded-[34px]">
              <div className="relative aspect-[1.18/1] overflow-hidden rounded-[22px] bg-zinc-950 sm:rounded-[28px]">
                <Image
                  src="/hero/fofan-hero.webp"
                  alt={t.hero.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fofan-bg via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="works"
          className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
        >
          <SectionHeading title={t.works.title} />

          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6"
          >
            {initialWorks.map((work, index) => (
              <WorkCard
                key={work.id}
                work={work}
                language={language}
                typeLabel={t.works.types[work.kind]}
                previewLabel={t.works.preview}
                watchLabel={t.works.watch}
                unavailableLabel={t.works.linkPlaceholder}
                index={index}
                compact={index > 1}
              />
            ))}
          </motion.div>
        </section>

        <section
          id="contact"
          className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={revealTransition}
            className="glass-shell overflow-hidden rounded-[28px] px-6 py-10 text-center sm:px-10 sm:py-14"
          >
            <div className="mx-auto h-px w-20 bg-fofan-red" />
            <h2 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              {t.contact.description}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              {contactActions.map((action) => (
                <ActionLink
                  key={action.label}
                  href={action.href}
                  label={action.label}
                  unavailableLabel={t.common.unavailableLink}
                  tone="primary"
                />
              ))}
            </div>
          </motion.div>
        </section>

        <footer className="relative z-10 px-4 py-10 text-center text-sm text-zinc-500">
          {t.footer}
        </footer>
      </main>
    </MotionConfig>
  );
}

function BackgroundLayer() {
  return (
    <>
      <div className="site-noise" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-18%] top-[12%] h-[34rem] w-[34rem] rounded-full bg-fofan-red/12 blur-[150px]" />
        <div className="absolute bottom-[-22%] right-[-14%] h-[42rem] w-[42rem] rounded-full bg-fofan-red/10 blur-[170px]" />
      </div>
    </>
  );
}

function Header({
  theme,
  setTheme,
  t,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (typeof translations)[Language];
}) {
  function easeInOutCubic(progress: number) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function scrollToSection(
    event: MouseEvent<HTMLAnchorElement>,
    selector: string,
  ) {
    event.preventDefault();

    const target = document.querySelector(selector);

    if (!target) {
      return;
    }

    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const headerOffset = 88;
    const startY = window.scrollY;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    if (shouldReduceMotion) {
      window.scrollTo(0, targetY);
      return;
    }

    const distance = targetY - startY;
    const duration = 1100;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
      <nav className="glass-shell mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 sm:px-5">
        <a
          href="#"
          onClick={(event) => scrollToSection(event, "main")}
          className="group inline-flex min-w-0 items-center text-base font-semibold tracking-[-0.04em] text-white sm:text-lg"
          aria-label="Fofan montage"
        >
          <span className="brand-logo bg-gradient-to-r from-white via-white to-fofan-red-soft bg-clip-text text-transparent">
            Fofan montage
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-5">
          <div className="flex items-center gap-3 text-xs text-zinc-300 sm:gap-5 sm:text-sm">
            <a
              className="transition-colors duration-500 hover:text-white"
              href="#works"
              onClick={(event) => scrollToSection(event, "#works")}
            >
              {t.nav.works}
            </a>
            <a
              className="transition-colors duration-500 hover:text-white"
              href="#contact"
              onClick={(event) => scrollToSection(event, "#contact")}
            >
              {t.nav.contact}
            </a>
          </div>

          <div
            className="flex rounded-full border border-white/10 bg-white/[0.04] p-1"
            aria-label="Theme"
          >
            {themes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTheme(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === item
                    ? theme === "white"
                      ? "theme-toggle-active bg-zinc-950 text-white"
                      : "theme-toggle-active bg-white text-zinc-950"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item === "black" ? "Black" : "White"}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function SectionHeading({ title, body }: { title: string; body?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={revealTransition}
      className="max-w-3xl"
    >
      <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
          {body}
        </p>
      ) : null}
    </motion.div>
  );
}

function WorkCard({
  work,
  language,
  typeLabel,
  previewLabel,
  watchLabel,
  unavailableLabel,
  index,
  compact,
}: {
  work: SiteWorkItem;
  language: Language;
  typeLabel: string;
  previewLabel: string;
  watchLabel: string;
  unavailableLabel: string;
  index: number;
  compact: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const href = work.href.trim();
  const isVertical = work.frame === "9:16";
  const layoutClass =
    index === 0
      ? "lg:col-span-5 lg:row-span-2"
      : index === 1
        ? "lg:col-span-7"
        : index === 2
          ? "lg:col-span-4"
          : "lg:col-span-3";

  return (
    <motion.article
      variants={shouldReduceMotion ? undefined : itemVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }
      }
      className={`${layoutClass} group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-2 transition-colors hover:border-fofan-red/55`}
    >
      <div
        className={`relative overflow-hidden rounded-[22px] bg-fofan-panel ${
          isVertical ? "aspect-[9/16]" : compact ? "aspect-[16/10]" : "aspect-video"
        }`}
      >
        <PreviewPlaceholder
          frame={work.frame}
          previewLabel={previewLabel}
          vertical={isVertical}
        />
      </div>

      <div className="px-3 pb-4 pt-5 sm:px-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs text-fofan-red-soft">{typeLabel}</p>
          <span className="font-mono text-xs text-zinc-500">{work.frame}</span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
          {work.title[language]}
        </h3>
        <ActionLink
          href={href}
          label={watchLabel}
          unavailableLabel={unavailableLabel}
          tone="card"
          className="mt-5"
        />
      </div>
    </motion.article>
  );
}

function PreviewPlaceholder({
  frame,
  previewLabel,
  vertical,
}: {
  frame: string;
  previewLabel: string;
  vertical: boolean;
}) {
  return (
    <div className="absolute inset-0 isolate overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(227,39,45,0.28),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-xs text-zinc-400">
        <span>{previewLabel}</span>
        <span>{frame}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex items-center justify-center rounded-full border border-fofan-red/45 bg-zinc-950/35 shadow-[0_0_70px_rgba(227,39,45,0.34)] backdrop-blur-md transition-transform duration-500 group-hover:scale-105 ${
            vertical ? "h-20 w-20" : "h-16 w-16"
          }`}
        >
          <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-fofan-bg/80 to-transparent" />
    </div>
  );
}

function ActionLink({
  href,
  label,
  unavailableLabel,
  tone,
  className = "",
}: {
  href: string;
  label: string;
  unavailableLabel: string;
  tone: "primary" | "secondary" | "card";
  className?: string;
}) {
  const resolvedHref = href.trim();
  const disabled = !resolvedHref;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (disabled) {
      event.preventDefault();
    }
  }

  const toneClass =
    tone === "primary"
      ? "red-glow bg-fofan-red text-white hover:bg-fofan-red-soft"
      : tone === "card"
        ? "border-white/10 bg-white/[0.04] text-white hover:border-fofan-red/60 hover:bg-fofan-red/12"
        : "border-white/10 bg-white/[0.035] text-white hover:border-fofan-red/60 hover:bg-fofan-red/12";

  return (
    <motion.a
      href={resolvedHref || "#"}
      onClick={handleClick}
      target={resolvedHref ? "_blank" : undefined}
      rel={resolvedHref ? "noreferrer" : undefined}
      aria-disabled={disabled}
      title={disabled ? unavailableLabel : undefined}
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`${className} inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full border px-6 py-3 text-sm font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-auto ${toneClass} ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      {label}
    </motion.a>
  );
}
