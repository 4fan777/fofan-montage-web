"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Film, Moon, Play, Quote, Sun } from "lucide-react";
import { LazyMotion, domAnimation, m, MotionConfig } from "framer-motion";
import { contactLinks, heroLinks } from "@/config/links";
import { featuredWork } from "@/config/featured-work";
import type { SiteWorkItem } from "@/lib/work-types";

function getPreview(work: SiteWorkItem) {
  if (work.thumbnail) return work.thumbnail;
  try {
    const url = new URL(work.href);
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] :
      ["youtube.com", "m.youtube.com"].includes(host) ?
        url.searchParams.get("v") || (["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : null) : null;
    return id && /^[\w-]{11}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

function WorkCard({ work, index }: { work: SiteWorkItem; index: number }) {
  const preview = getPreview(work);
  const [failed, setFailed] = useState(false);
  const media = <>
    {preview && !failed ? <Image src={preview} alt={work.title.ru} fill
      sizes={index === 0 ? "(max-width: 640px) 100vw, 42vw" : "(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 60vw"}
      className="work-image" onError={() => setFailed(true)} /> : <Film size={32} strokeWidth={1.2} />}
    {work.href && <span className="work-play"><Play size={22} fill="currentColor" strokeWidth={0} /></span>}
  </>;
  return <m.article className={`work-card work-card-${Math.min(index, 4)}`}
    initial={{ y: 8 }} whileInView={{ y: 0 }} viewport={{ once: true }}
    transition={{ duration: 0.55, delay: Math.min(index, 3) * 0.05, ease: "easeOut" }}>
    {work.href ? <a className={`work-media ${work.frame === "9:16" ? "work-vertical" : ""}`}
      href={work.href} target="_blank" rel="noreferrer" aria-label={`Смотреть: ${work.title.ru}`}>{media}</a> :
      <div className={`work-media ${work.frame === "9:16" ? "work-vertical" : ""}`}>{media}</div>}
    <div className="work-meta"><span>{work.kind === "reels" ? "TikTok / Reels" : "YouTube"}</span><span>{work.frame}</span></div>
    <div className="work-caption"><h3>{work.title.ru}</h3>
      {work.href && <a className="work-open" href={work.href} target="_blank" rel="noreferrer"
        aria-label={`Открыть: ${work.title.ru}`} title="Смотреть"><ArrowUpRight size={20} /></a>}
    </div>
  </m.article>;
}

export function FofanPortfolio({ initialWorks }: { initialWorks: SiteWorkItem[] }) {
  const [light, setLight] = useState(false);
  const animation = useRef(0);

  useEffect(() => {
    try {
      setLight(localStorage.getItem("wade-theme") === "light");
    } catch {}
    return () => cancelAnimationFrame(animation.current);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);

  function toggleTheme() {
    setLight(!light);
    try {
      localStorage.setItem("wade-theme", light ? "dark" : "light");
    } catch {}
  }

  function scrollTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    cancelAnimationFrame(animation.current);
    const start = window.scrollY;
    const end = Math.max(0, Math.min(
      target.getBoundingClientRect().top + start - 96,
      document.documentElement.scrollHeight - innerHeight,
    ));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, end);
      return;
    }
    const time = performance.now();
    function step(now: number) {
      const t = Math.min((now - time) / 1100, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, start + (end - start) * eased);
      if (t < 1) animation.current = requestAnimationFrame(step);
    }
    animation.current = requestAnimationFrame(step);
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          className="portfolio"
          id="top"
          onWheel={() => cancelAnimationFrame(animation.current)}
          onTouchStart={() => cancelAnimationFrame(animation.current)}
        >
          <header className="site-header">
            <nav className="shell navigation" aria-label="Основная навигация">
              <a className="wordmark" href="#top" onClick={e => scrollTo(e, "top")}>
                <span className="nav-brand">wade montage</span>
              </a>
              <div className="nav-actions">
                <a className="nav-link about-nav" href="#top" onClick={e => scrollTo(e, "top")}>Обо мне</a>
                <a className="nav-link" href="#works" onClick={e => scrollTo(e, "works")}>Работы</a>
                <a className="nav-link" href="#reviews" onClick={e => scrollTo(e, "reviews")}>Отзывы</a>
                <a className="nav-link" href="#contact" onClick={e => scrollTo(e, "contact")}>Контакт</a>
                <button className="theme-button" onClick={toggleTheme}
                  aria-label={light ? "Включить тёмную тему" : "Включить светлую тему"}
                  title={light ? "Тёмная тема" : "Светлая тема"}>
                  {light ? <Moon size={17} /> : <Sun size={17} />}
                </button>
              </div>
            </nav>
          </header>

          <main>
            <section className="shell hero" aria-labelledby="hero-title">
              <div className="hero-topline"><p>Независимый видеомонтажёр</p><span>YouTube / Reels / Shorts</span></div>
              <div className="identity-stage">
                <span className="identity-corner corner-tl" aria-hidden="true" />
                <span className="identity-corner corner-br" aria-hidden="true" />
                <h1 id="hero-title" aria-label="wade montage"><span className="hero-name">WADE</span><span className="hero-role">montage</span></h1>
              </div>
              <div className="hero-bottom">
                <div className="hero-bio"><p className="intro">Дмитрий, 18 лет.</p><p className="hero-description">Монтирую видео для YouTube,<br /> Reels и Shorts.</p></div>
                <div className="hero-actions">
                <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                  Обсудить проект <ArrowUpRight size={18} />
                </a>
                <a className="text-link" href="#works" onClick={e => scrollTo(e, "works")}>
                  Смотреть работы <ArrowDown size={16} />
                </a>
                </div>
              </div>
            </section>

            <section className="shell works-section" id="works" aria-labelledby="works-title">
              <div className="section-heading">
                <div><span className="section-index">Портфолио</span><h2 id="works-title">Работы.</h2></div>
                <span className="section-note">YouTube / Reels</span>
              </div>
              <div className="works-grid">
                {initialWorks.map((work, index) => <WorkCard key={work.id} work={work} index={index} />)}
              </div>
            </section>

            <section className="shell reviews-section" id="reviews" aria-labelledby="reviews-title">
              <div className="section-heading"><div><span className="section-index">Обратная связь</span><h2 id="reviews-title">Отзывы.</h2></div></div>
              <div className="review-content">
                <Quote className="review-symbol" size={64} strokeWidth={1} aria-hidden="true" />
                {featuredWork.review ? (
                  <blockquote className="work-review"><p>{featuredWork.review}</p>{featuredWork.reviewAuthor && <cite>{featuredWork.reviewAuthor}</cite>}</blockquote>
                ) : <p className="review-empty">Отзыв пока не добавлен.</p>}
              </div>
            </section>

            <section className="shell contact-section" id="contact" aria-labelledby="contact-title">
              <div className="contact-heading">
                <p className="section-index">Контакт</p>
                <h2 id="contact-title">Обсудим<br /><span>ваш ролик.</span></h2>
                <p className="contact-copy">Напишите в Telegram.<br />Обсудим задачу, сроки и стоимость.</p>
              </div>
              <div className="contact-actions">
                <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                  Связаться в Telegram <ArrowUpRight size={18} />
                </a>
                <span className="contact-username">{contactLinks.telegramUsername}</span>
              </div>
            </section>
          </main>

          <footer className="shell footer">
            <span>© 2026 wade montage</span>
            <div className="footer-socials">
              <a href={heroLinks.telegramChannel} target="_blank" rel="noreferrer">Telegram-канал <ArrowUpRight size={13} /></a>
              <a href={heroLinks.youtube} target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={13} /></a>
            </div>
            <a className="back-top" href="#top" onClick={e => scrollTo(e, "top")}>Наверх <ArrowUpRight size={13} /></a>
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
