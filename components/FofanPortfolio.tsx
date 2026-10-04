"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Film, Moon, Play, Quote, Sun } from "lucide-react";
import { LazyMotion, domAnimation, m, MotionConfig } from "framer-motion";
import { contactLinks, heroLinks } from "@/config/links";
import { featuredWork } from "@/config/featured-work";
import { works as defaultWorks } from "@/config/works";
import type { SiteWorkItem } from "@/lib/work-types";

function getYouTubeId(href: string) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] :
      ["youtube.com", "m.youtube.com"].includes(host) ?
        url.searchParams.get("v") || (["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : null) : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function Reveal({ children, className, delay = 0, id }: {
  children: ReactNode; className: string; delay?: number; id?: string;
}) {
  return <m.div id={id} className={`reveal ${className}`}
    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}>
    {children}
  </m.div>;
}

function WorkCard({ work, featured = false }: { work: SiteWorkItem; featured?: boolean }) {
  const youtubeId = getYouTubeId(work.href);
  const [fallback, setFallback] = useState(false);
  const preview = youtubeId && (featured || !work.thumbnail)
    ? `https://i.ytimg.com/vi/${youtubeId}/${fallback ? "hqdefault" : "maxresdefault"}.jpg`
    : work.thumbnail;
  const [failed, setFailed] = useState(false);
  const media = <>
    {preview && !failed ? <Image src={preview} alt={work.title.ru} fill
      sizes={featured ? "(max-width: 760px) calc(100vw - 40px), (max-width: 1150px) 55vw, 594px" : "(max-width: 640px) calc(100vw - 40px), (max-width: 1150px) 45vw, 516px"}
      className="work-image"
      onLoad={event => {
        if (youtubeId && !fallback && event.currentTarget.naturalWidth <= 120) setFallback(true);
      }}
      onError={() => youtubeId && !fallback ? setFallback(true) : setFailed(true)} /> : <Film size={32} strokeWidth={1.2} />}
    {work.href && <span className="work-play"><Play size={22} fill="currentColor" strokeWidth={0} /></span>}
  </>;
  return <article className={`work-card ${featured ? "work-featured" : ""}`}>
    {work.href ? <a className={`work-media ${work.frame === "9:16" ? "work-vertical" : ""}`}
      href={work.href} target="_blank" rel="noreferrer" aria-label={`Смотреть: ${work.title.ru}`}>{media}</a> :
      <div className={`work-media ${work.frame === "9:16" ? "work-vertical" : ""}`}>{media}</div>}
    <div className="work-meta"><span>{work.kind === "reels" ? "TikTok / Reels" : "YouTube"}</span><span>{work.frame}</span></div>
    <div className="work-caption"><h3>{work.title.ru}</h3>
      {work.href && <a className="work-open" href={work.href} target="_blank" rel="noreferrer"
        aria-label={`Открыть: ${work.title.ru}`} title="Смотреть"><ArrowUpRight size={20} /></a>}
    </div>
  </article>;
}

export function FofanPortfolio({ initialWorks }: { initialWorks: SiteWorkItem[] }) {
  const [light, setLight] = useState(true);
  const animation = useRef(0);
  const mainWork = initialWorks.find(work => getYouTubeId(work.href) === "o06bDTg3rUY")
    ?? defaultWorks.find(work => work.id === "youtube-dynamic")!;
  const otherWorks = initialWorks.filter(work => getYouTubeId(work.href) !== "o06bDTg3rUY");

  useEffect(() => {
    try {
      setLight(localStorage.getItem("wade-appearance-v2") !== "dark");
    } catch {}
    return () => cancelAnimationFrame(animation.current);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);

  function toggleTheme() {
    setLight(!light);
    try {
      localStorage.setItem("wade-appearance-v2", light ? "dark" : "light");
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
                <span className="nav-brand">WADE<span>montage</span></span>
              </a>
              <div className="nav-actions">
                <a className="nav-link about-nav" href="#about" onClick={e => scrollTo(e, "about")}>Визитка</a>
                <a className="nav-link" href="#works" onClick={e => scrollTo(e, "works")}>Работы</a>
                <a className="nav-link" href="#reviews" onClick={e => scrollTo(e, "reviews")}>Отзывы</a>
              </div>
              <a className="header-contact" href={contactLinks.telegram} target="_blank" rel="noreferrer" aria-label="Написать в Telegram" title="Написать в Telegram"><span>Написать</span><ArrowUpRight size={16} /></a>
            </nav>
          </header>

          <main>
            <section className="shell hero" aria-labelledby="hero-title">
              <div className="hero-copy">
                <h1 id="hero-title"><em>Монтаж для<br />YouTube,</em><br />Reels и Shorts.</h1>
                <p className="hero-summary">Дмитрий, 18 лет. Видеомонтажёр.</p>
                <div className="hero-actions">
                  <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                    Обсудить проект <ArrowRight size={18} />
                  </a>
                </div>
                <div className="hero-details">
                  <span className="experience-badge"><strong>2+</strong><span>года в Ae и Pr</span></span>
                </div>
              </div>
              <div className="hero-visual">
                <Image className="hero-mascot" src="/mascot/business.webp" alt="Маскот WADE со скрещёнными руками" width={600} height={900} sizes="(max-width: 760px) 230px, 340px" priority />
                {featuredWork.review && <figure className="hero-quote">
                  <figcaption className="hero-quote-author">
                    <span className="hero-quote-avatar" aria-hidden="true">{featuredWork.reviewAuthor.charAt(0)}</span>
                    <a href={featuredWork.reviewAuthorUrl} target="_blank" rel="noreferrer">{featuredWork.reviewAuthor}<ArrowUpRight size={14} aria-hidden="true" /></a>
                  </figcaption>
                  <blockquote>Монтаж аккуратный, ничего не перегружено.</blockquote>
                </figure>}
              </div>
            </section>

            <section className="shell introduction-section" id="about" aria-label="Видео-визитка">
              {/* Set featuredWork.youtubeId to add a video introduction here. */}
              <Reveal className="introduction-media">
                {featuredWork.youtubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${featuredWork.youtubeId}`}
                  title="Видео-визитка WADE" loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen /> :
                  <div className="introduction-empty" role="img" aria-label="Пустое место для будущей видео-визитки" />}
              </Reveal>
            </section>

            <section className="shell works-section" id="works" aria-labelledby="works-title">
              <div className="section-heading">
                <h2 id="works-title">Мои <em>работы</em></h2>
              </div>
              <div className="featured-case">
                <Reveal className="featured-video"><WorkCard work={mainWork} featured /></Reveal>
                <Reveal className="featured-review" delay={0.1}>
                  <section className="review-content" id="reviews" aria-labelledby="reviews-title">
                    <h3 id="reviews-title" className="visually-hidden">Отзыв {featuredWork.reviewAuthor}</h3>
                    <Quote className="review-symbol" size={32} strokeWidth={1.5} aria-hidden="true" />
                    {featuredWork.review ? (
                  <blockquote className="work-review">
                    <p>{featuredWork.review}</p>
                    {featuredWork.reviewAuthor && <cite className="review-author">
                      <a href={featuredWork.reviewAuthorUrl} target="_blank" rel="noreferrer"
                        aria-label={`${featuredWork.reviewAuthor} — YouTube-канал`}>
                        {featuredWork.reviewAuthor}<ArrowUpRight size={18} aria-hidden="true" />
                      </a>
                    </cite>}
                  </blockquote>
                    ) : <p className="review-empty">Отзыв пока не добавлен.</p>}
                  </section>
                  <p className="featured-description">В исходниках было много материала. Задача - собрать динамичный игровой ролик по референсу в стиле MrBeast. Судя по комментариям, нужную подачу удалось передать - многие зрители отдельно отметили сходство со стилем оригинала.</p>
                </Reveal>
              </div>
              <div className="works-grid">
                {otherWorks.map((work, index) => <Reveal key={work.id}
                  className={`work-item ${work.frame === "9:16" ? "work-item-vertical" : ""}`}
                  delay={Math.min(index, 2) * 0.06}><WorkCard work={work} /></Reveal>)}
              </div>
            </section>

            <section className="shell contact-section" id="contact" aria-labelledby="contact-title">
              <Reveal className="contact-inner">
              <div className="contact-heading">
                <h2 id="contact-title">Обсудим <em>ваш ролик.</em></h2>
                <p className="contact-copy">Напишите, что нужно смонтировать и к какому сроку.</p>
              </div>
              <div className="contact-actions">
                <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                  Написать в Telegram <ArrowRight size={18} />
                </a>
                <span className="contact-username">{contactLinks.telegramUsername}</span>
              </div>
              </Reveal>
            </section>
          </main>

          <footer className="shell footer">
            <span>© 2026 wade montage</span>
            <div className="footer-socials">
              <a href={heroLinks.telegramChannel} target="_blank" rel="noreferrer">Telegram-канал <ArrowUpRight size={13} /></a>
              <a href={heroLinks.youtube} target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={13} /></a>
            </div>
            <div className="footer-tools">
              <a className="back-top" href="#top" onClick={e => scrollTo(e, "top")}>Наверх <ArrowUpRight size={13} /></a>
              <button className="theme-button" onClick={toggleTheme}
                aria-label={light ? "Включить тёмную тему" : "Включить светлую тему"}
                title={light ? "Тёмная тема" : "Светлая тема"}>
                {light ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
