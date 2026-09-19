"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowUpRight, Film, Moon, Sun } from "lucide-react";
import { LazyMotion, domAnimation, m, MotionConfig } from "framer-motion";
import { contactLinks, heroLinks } from "@/config/links";
import { featuredWork } from "@/config/featured-work";

export function FofanPortfolio() {
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

  const hasVideo = /^[\w-]{11}$/.test(featuredWork.youtubeId);

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
                wade<span> montage</span><span className="logo-stop" aria-hidden="true">.</span>
              </a>
              <div className="nav-actions">
                <a className="nav-link" href="#works" onClick={e => scrollTo(e, "works")}>Работа</a>
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
              <p className="intro">Дмитрий, 18 лет.</p>
              <h1 id="hero-title">wade <span>montage</span><span className="title-stop">.</span></h1>
              <p className="hero-description">Монтирую видео для YouTube,<br className="mobile-break" /> Reels и Shorts.</p>
              <div className="hero-actions">
                <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                  Обсудить проект <ArrowUpRight size={18} />
                </a>
                <a className="text-link" href="#works" onClick={e => scrollTo(e, "works")}>
                  К работе <ArrowDown size={16} />
                </a>
              </div>
            </section>

            <section className="shell works-section" id="works" aria-labelledby="works-title">
              <div className="section-heading">
                <h2 id="works-title">Работа</h2>
                <span>YouTube <span aria-hidden="true">/</span> 16:9</span>
              </div>
              <m.article initial={{ y: 8 }} whileInView={{ y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div className="featured-video">
                  {hasVideo ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${featuredWork.youtubeId}`}
                      title={featuredWork.title || "Работа — wade montage"}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="video-empty" role="status">
                      <Film size={30} strokeWidth={1.2} aria-hidden="true" />
                      <p>Скоро здесь будет новая работа</p>
                    </div>
                  )}
                </div>
                {featuredWork.title && <h3 className="work-title">{featuredWork.title}</h3>}
                {featuredWork.description && <p className="work-description">{featuredWork.description}</p>}
                {featuredWork.review && (
                  <blockquote className="work-review">
                    <p>{featuredWork.review}</p>
                    {featuredWork.reviewAuthor && <cite>{featuredWork.reviewAuthor}</cite>}
                  </blockquote>
                )}
              </m.article>
            </section>

            <section className="shell contact-section" id="contact" aria-labelledby="contact-title">
              <div className="contact-heading">
                <p className="intro">Связь со мной</p>
                <h2 id="contact-title">Обсудим ваш ролик.</h2>
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
