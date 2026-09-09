"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowUpRight, Moon, Play, Sun } from "lucide-react";
import { LazyMotion, domAnimation, m, MotionConfig } from "framer-motion";
import { contactLinks, heroLinks } from "@/config/links";
import type { SiteWorkItem } from "@/lib/work-types";

function thumbnail(work: SiteWorkItem) {
  if (work.thumbnail) return work.thumbnail;
  if (work.kind !== "youtube") return null;
  try {
    const url = new URL(work.href);
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] : ["youtube.com", "m.youtube.com"].includes(host)
      ? url.searchParams.get("v") || (["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : null) : null;
    return id && /^[\w-]{11}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  } catch { return null; }
}

export function FofanPortfolio({ initialWorks }: { initialWorks: SiteWorkItem[] }) {
  const [light, setLight] = useState(false);
  const animation = useRef(0);
  useEffect(() => {
    try { setLight(localStorage.getItem("wade-theme") === "light"); } catch {}
    return () => cancelAnimationFrame(animation.current);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = light ? "light" : "dark"; }, [light]);
  function toggleTheme() {
    setLight(!light);
    try { localStorage.setItem("wade-theme", light ? "dark" : "light"); } catch {}
  }
  function scrollTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    cancelAnimationFrame(animation.current);
    const start = window.scrollY;
    const end = Math.max(0, Math.min(target.getBoundingClientRect().top + start - 100, document.documentElement.scrollHeight - innerHeight));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { window.scrollTo(0, end); return; }
    const time = performance.now();
    function step(now: number) {
      const t = Math.min((now - time) / 1200, 1);
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, start + (end - start) * eased);
      if (t < 1) animation.current = requestAnimationFrame(step);
    }
    animation.current = requestAnimationFrame(step);
  }
  return <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">
    <div className="portfolio" id="top" onWheel={() => cancelAnimationFrame(animation.current)} onTouchStart={() => cancelAnimationFrame(animation.current)}>
      <header className="site-header"><nav className="shell flex h-20 items-center justify-between gap-4" aria-label="Основная навигация">
        <a className="wordmark" href="#top" onClick={e => scrollTo(e, "top")}>wade<span> montage</span></a>
        <div className="flex items-center gap-5 sm:gap-8">
          <a className="nav-link" href="#works" onClick={e => scrollTo(e, "works")}>Работы</a>
          <a className="nav-link" href="#contact" onClick={e => scrollTo(e, "contact")}>Связаться</a>
          <button className="theme-button" onClick={toggleTheme} aria-label={light ? "Включить тёмную тему" : "Включить светлую тему"} title={light ? "Тёмная тема" : "Светлая тема"}>{light ? <Moon size={18} /> : <Sun size={18} />}</button>
        </div>
      </nav></header>
      <main>
        <section className="shell hero" aria-labelledby="hero-title">
          <m.div initial={false} animate={{ opacity: 1 }}>
            <p className="intro">Дмитрий, 18 лет. Видеомонтажёр.</p>
            <h1 id="hero-title">wade montage<span className="brand-period">.</span></h1>
            <div className="hero-bottom"><div>
              <p className="hero-description">Монтирую YouTube-видео, Reels и Shorts.<br className="hidden sm:block" /> Помогаю сделать материал понятным<br className="hidden sm:block" /> и удержать внимание зрителя.</p>
              <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">Обсудить монтаж <ArrowUpRight size={18} /></a>
            </div><div className="hero-socials">
              <a className="text-link" href={heroLinks.telegramChannel} target="_blank" rel="noreferrer">Telegram-канал <ArrowUpRight size={16} /></a>
              <a className="text-link" href={heroLinks.youtube} target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={16} /></a>
            </div></div>
          </m.div>
        </section>
        <section className="shell works-section" id="works" aria-labelledby="works-title">
          <div className="section-heading"><h2 id="works-title">Избранные работы</h2><ArrowDown size={20} aria-hidden="true" /></div>
          <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">{initialWorks.map((work, index) => <WorkCard key={work.id} work={work} index={index} />)}</div>
        </section>
        <section className="shell contact-section" id="contact" aria-labelledby="contact-title">
          <div><p className="intro">Есть проект?</p><h2 id="contact-title">Давайте обсудим.</h2><p className="contact-copy">Напишите, что нужно смонтировать.<br />Обсудим идею, сроки и детали.</p></div>
          <a className="contact-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">{contactLinks.telegramUsername}<ArrowUpRight size={28} /></a>
        </section>
      </main>
      <footer className="shell footer"><span>© 2026 wade montage</span><a href="#top" onClick={e => scrollTo(e, "top")}>Наверх <ArrowUpRight size={14} /></a></footer>
    </div>
  </MotionConfig></LazyMotion>;
}

function WorkCard({ work, index }: { work: SiteWorkItem; index: number }) {
  const image = thumbnail(work);
  const vertical = work.frame === "9:16";
  const layout = index === 0 ? "lg:col-span-5 lg:row-span-2" : index === 1 ? "lg:col-span-7" : index === 2 ? "lg:col-span-4" : "lg:col-span-3";
  const preview = <>
    {image && <Image src={image} alt={work.title.ru} fill sizes={vertical ? "(max-width: 1023px) 100vw, 40vw" : "(max-width: 1023px) 100vw, 55vw"} className="work-image" />}
    <span className="play-button"><Play size={22} fill="currentColor" strokeWidth={1.5} aria-hidden="true" /></span>
  </>;
  return <m.article className={`${layout} work-card group`} initial={{ y: 10 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.15), ease: "easeOut" }}>
    {work.href ? <a className={`work-preview ${vertical ? "aspect-[9/16]" : "aspect-video"}`} href={work.href} target="_blank" rel="noreferrer" aria-label={`Смотреть: ${work.title.ru}`}>{preview}</a> : <div className={`work-preview ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>{preview}</div>}
    <div className="work-meta"><span>{work.kind === "youtube" ? "YouTube" : "TikTok / Reels"}</span><span>{work.frame}</span></div>
    <div className="work-title-row"><h3>{work.title.ru}</h3>{work.href && <a href={work.href} target="_blank" rel="noreferrer" className="work-open" aria-label={`Смотреть: ${work.title.ru}`} title="Смотреть"><ArrowUpRight size={20} /></a>}</div>
  </m.article>;
}
