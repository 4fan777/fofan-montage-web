"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Film, Moon, Play, Sun } from "lucide-react";
import {
  LazyMotion, domAnimation, m, MotionConfig, useMotionValue, useMotionValueEvent,
  useScroll, useSpring, useTransform,
} from "framer-motion";
import { contactLinks, heroLinks } from "@/config/links";
import { featuredWork } from "@/config/featured-work";
import { themeStorageKey } from "@/config/theme";
import { works as defaultWorks } from "@/config/works";
import type { SiteWorkItem } from "@/lib/work-types";

const ease = [0.22, 1, 0.36, 1] as const;

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

/** Fades content up, or opens it like a shutter when `wipe` is set. */
function Reveal({ children, className, delay = 0, id, wipe = false }: {
  children: ReactNode; className: string; delay?: number; id?: string; wipe?: boolean;
}) {
  // A clipped element never reports as visible, so a wipe is observed on an unclipped wrapper.
  if (wipe) return <m.div id={id} className={`reveal ${className}`} initial="hidden" whileInView="shown"
    viewport={{ once: true, amount: 0.15 }}>
    <m.div className="reveal-wipe" variants={{
      hidden: { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
      shown: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, delay, ease } },
    }}>{children}</m.div>
  </m.div>;
  return <m.div id={id} className={`reveal ${className}`}
    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, delay, ease }}>
    {children}
  </m.div>;
}

/** Slides a heading line up from behind a mask when it enters the viewport. */
function Line({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <m.span className="line" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
    <m.span className="line-inner" variants={{
      hidden: { y: "108%" },
      shown: { y: "0%", transition: { duration: 1.05, delay, ease } },
    }}>
      {children}
    </m.span>
  </m.span>;
}

/** The mascot as a bust cut by its disc: breathes and leans slightly toward the cursor. */
function Mascot() {
  const pointer = useMotionValue(0);
  const lean = useSpring(pointer, { stiffness: 50, damping: 16 });
  const rotate = useTransform(lean, [-1, 1], [-2.5, 2.5]);
  const x = useTransform(lean, [-1, 1], [-8, 8]);
  const stageX = useTransform(lean, [-1, 1], [6, -6]);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const move = (event: PointerEvent) => pointer.set(event.clientX / innerWidth * 2 - 1);
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, [pointer]);

  return <div className="mascot">
    <m.div className="mascot-stage" style={{ x: stageX }}>
      <span className="mascot-disc" aria-hidden="true" />
      <m.div className="mascot-lean" style={{ rotate, x }}>
        <div className="mascot-breath">
          <Image className="hero-mascot" src="/mascot/bust.webp" alt="Маскот WADE со скрещёнными руками"
            width={600} height={480} sizes="(max-width: 760px) 487px, 608px" priority />
        </div>
      </m.div>
    </m.div>
  </div>;
}

function ReviewCard({ text, author, context }: { text: string; author: string; context: string }) {
  return <figure className="review-card">
    <span className="review-card-context">{context}</span>
    <blockquote><p>{text}</p></blockquote>
    <figcaption className="review-card-author">
      <span className="review-card-avatar" aria-hidden="true">{author.charAt(0).toUpperCase()}</span>
      <span>{author}</span>
    </figcaption>
  </figure>;
}

const reelsReview = "Рилс получился очень качественным. Просил больше динамики, красивого текста и саунд-дизайна. Результат очень удивил, цену оправдал даже с запасом)";

function WorkCard({ work, featured = false }: { work: SiteWorkItem; featured?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const youtubeId = getYouTubeId(work.href);
  const [fallback, setFallback] = useState(false);
  const preview = youtubeId && (featured || !work.thumbnail)
    ? `https://i.ytimg.com/vi/${youtubeId}/${fallback ? "hqdefault" : "maxresdefault"}.jpg`
    : work.thumbnail;
  const [failed, setFailed] = useState(false);
  const media = <>
    {preview && !failed ? <m.div className="work-parallax" style={{ y: drift }}>
      <Image src={preview} alt={work.title.ru} fill
        sizes={featured ? "(max-width: 760px) calc(100vw - 40px), (max-width: 1150px) 52vw, 540px" : "(max-width: 640px) calc(100vw - 40px), 320px"}
        className="work-image"
        onLoad={event => {
          if (youtubeId && !fallback && event.currentTarget.naturalWidth <= 120) setFallback(true);
        }}
        onError={() => youtubeId && !fallback ? setFallback(true) : setFailed(true)} />
    </m.div> : <Film size={32} strokeWidth={1.2} />}
    {work.href && <span className="work-play"><Play size={22} fill="currentColor" strokeWidth={0} /></span>}
  </>;
  return <article ref={ref} className={`work-card ${featured ? "work-featured" : ""}`}>
    {work.href ? <a className={`work-media ${work.frame === "9:16" ? "work-vertical" : ""}`}
      href={work.href} target="_blank" rel="noreferrer" aria-label={`Смотреть: ${work.title.ru}`}>{media}</a> :
      <div className={`work-media ${work.frame === "9:16" ? "work-vertical" : ""}`}>{media}</div>}
  </article>;
}

function Review({ text, author, label }: { text: string; author: ReactNode; label: string }) {
  return <section className="review-content" aria-label={label}>
    <span className="review-mark" aria-hidden="true">“</span>
    <blockquote className="work-review">
      <p>{text}</p>
      <cite className="review-author">{author}</cite>
    </blockquote>
  </section>;
}

export function FofanPortfolio({ initialWorks }: { initialWorks: SiteWorkItem[] }) {
  const [light, setLight] = useState(false);
  const [activeWork, setActiveWork] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const animation = useRef(0);
  const autoScrolling = useRef(false);
  const railRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainWork = initialWorks.find(work => getYouTubeId(work.href) === "o06bDTg3rUY")
    ?? defaultWorks.find(work => work.id === "youtube-dynamic")!;
  const horizontalWorks = [mainWork, ...initialWorks.filter(work =>
    work.href !== mainWork.href && work.kind === "youtube" && work.frame !== "9:16")];
  const reelsWorks = initialWorks.filter(work => work.kind === "reels" || work.frame === "9:16");
  const selectedWork = Math.min(activeWork, horizontalWorks.length - 1);
  const multiple = horizontalWorks.length > 1;

  const { scrollY, scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const glowA = useTransform(scrollYProgress, [0, 1], ["0vh", "70vh"]);
  const glowB = useTransform(scrollYProgress, [0, 1], ["0vh", "-50vh"]);
  const { scrollXProgress } = useScroll({ container: railRef });
  const railProgress = useSpring(
    useTransform(scrollXProgress, [0, 1], [1 / horizontalWorks.length, 1]),
    { stiffness: 160, damping: 28 },
  );
  const { scrollYProgress: introProgress } = useScroll({ target: introRef, offset: ["start end", "start 0.3"] });
  const introScale = useTransform(introProgress, [0, 1], [0.9, 1]);

  useMotionValueEvent(scrollY, "change", value => {
    if (autoScrolling.current) return;
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(value - previous) < 4) return;
    setHeaderHidden(value > previous && value > 180);
  });

  useEffect(() => {
    try {
      setLight(localStorage.getItem(themeStorageKey) === "light");
    } catch {}
    return () => cancelAnimationFrame(animation.current);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);

  function toggleTheme() {
    const next = !light;
    const apply = () => {
      document.documentElement.dataset.theme = next ? "light" : "dark";
      flushSync(() => setLight(next));
    };
    if ("startViewTransition" in document) document.startViewTransition(apply);
    else apply();
    try {
      localStorage.setItem(themeStorageKey, next ? "light" : "dark");
    } catch {}
  }

  function goToWork(index: number) {
    const rail = railRef.current;
    const slide = slideRefs.current[index];
    if (!rail || !slide) return;
    setActiveWork(index);
    rail.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  function syncActiveWork() {
    const rail = railRef.current;
    if (!rail) return;
    let closest = 0;
    slideRefs.current.forEach((slide, index) => {
      const current = slideRefs.current[closest];
      if (slide && current && Math.abs(slide.offsetLeft - rail.scrollLeft) < Math.abs(current.offsetLeft - rail.scrollLeft)) closest = index;
    });
    setActiveWork(closest);
  }

  function scrollTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;
    const target = section.querySelector("[data-anchor]") ?? section;
    const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
    cancelAnimationFrame(animation.current);
    setHeaderHidden(false);
    autoScrolling.current = true;
    const start = window.scrollY;
    const end = id === "top" ? 0 : Math.max(0, Math.min(
      target.getBoundingClientRect().top + start - header - 32,
      document.documentElement.scrollHeight - innerHeight,
    ));
    const time = performance.now();
    function step(now: number) {
      const t = Math.min((now - time) / 1100, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, start + (end - start) * eased);
      if (t < 1) animation.current = requestAnimationFrame(step);
      else autoScrolling.current = false;
    }
    animation.current = requestAnimationFrame(step);
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="never">
        <div
          className="portfolio"
          id="top"
          onWheel={() => { cancelAnimationFrame(animation.current); autoScrolling.current = false; }}
          onTouchStart={() => { cancelAnimationFrame(animation.current); autoScrolling.current = false; }}
        >
          <div className="ambient" aria-hidden="true">
            <m.span className="glow glow-a" style={{ y: glowA }} />
            <m.span className="glow glow-b" style={{ y: glowB }} />
          </div>
          <div className="grain" aria-hidden="true" />

          <header className={`site-header ${headerHidden ? "is-hidden" : ""}`}>
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
            <m.span className="scroll-progress" style={{ scaleX: pageProgress }} aria-hidden="true" />
          </header>

          <main>
            <section className="shell hero" aria-labelledby="hero-title">
              <div className="hero-copy">
                <h1 id="hero-title">
                  <span className="line"><span className="line-inner" style={{ ["--i" as string]: 0 }}><em>Монтаж для</em></span></span>
                  <span className="line"><span className="line-inner" style={{ ["--i" as string]: 1 }}><em>YouTube</em></span></span>
                  <span className="line"><span className="line-inner" style={{ ["--i" as string]: 2 }}>Reels и Shorts</span></span>
                </h1>
                <p className="hero-summary">Дмитрий 18 лет Видеомонтажёр</p>
                <div className="hero-actions">
                  <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                    <span>Обсудить проект</span> <ArrowRight size={18} />
                  </a>
                  <a className="ghost-link" href="#works" onClick={e => scrollTo(e, "works")}>Смотреть работы <ArrowDown size={16} /></a>
                </div>
              </div>
              <div className="hero-visual"><Mascot /></div>
              <div className="hero-notes">
                <div className="hero-note experience-badge"><strong>2+</strong><span>года в Ae и Pr</span></div>
                <figure className="hero-note hero-quote">
                  <span className="hero-quote-avatar" aria-hidden="true">A</span>
                  <div>
                    <blockquote>Результат очень удивил и оправдал цену с запасом.</blockquote>
                    <figcaption className="hero-quote-author">aquarody</figcaption>
                  </div>
                </figure>
                {featuredWork.review && <figure className="hero-note hero-quote">
                  <span className="hero-quote-avatar" aria-hidden="true">{featuredWork.reviewAuthor.charAt(0)}</span>
                  <div>
                    <blockquote>Монтаж аккуратный, ничего не перегружено.</blockquote>
                    <figcaption className="hero-quote-author">{featuredWork.reviewAuthor}</figcaption>
                  </div>
                </figure>}
              </div>
            </section>

            <section className="shell introduction-section" id="about" aria-label="Видео-визитка">
              <div data-anchor><Reveal className="section-label"><span>Видео-визитка</span></Reveal></div>
              {/* Set featuredWork.youtubeId to add a video introduction here. */}
              <m.div ref={introRef} className="introduction-media" style={{ scale: introScale }}>
                {featuredWork.youtubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${featuredWork.youtubeId}`}
                  title="Видео-визитка WADE" loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen /> :
                  <div className="introduction-empty" role="img" aria-label="Пустое место для будущей видео-визитки" />}
              </m.div>
            </section>

            <section className="shell works-section" id="works" aria-labelledby="works-title">
              <div className="section-head" data-anchor>
                <h2 id="works-title"><Line>Мои <em>работы</em></Line></h2>
                {multiple && <div className="works-controls" aria-label="Переключение работ">
                  <span className="visually-hidden" aria-live="polite">{horizontalWorks[selectedWork]?.title.ru}</span>
                  <button type="button" onClick={() => goToWork(Math.max(0, selectedWork - 1))}
                    disabled={selectedWork === 0} aria-label="Предыдущая работа" title="Предыдущая работа"><ArrowLeft size={20} /></button>
                  <button type="button" onClick={() => goToWork(Math.min(horizontalWorks.length - 1, selectedWork + 1))}
                    disabled={selectedWork === horizontalWorks.length - 1} aria-label="Следующая работа" title="Следующая работа"><ArrowRight size={20} /></button>
                </div>}
              </div>
              <Reveal className="works-stage" wipe>
                <div className={`works-rail ${multiple ? "" : "is-single"}`} ref={railRef} onScroll={syncActiveWork}
                  aria-label="Горизонтальные работы">
                  {horizontalWorks.map((work, index) => <div className={`works-slide ${index === selectedWork ? "is-active" : ""}`} key={work.id}
                    ref={node => { slideRefs.current[index] = node; }}>
                    <div className="featured-case" inert={index !== selectedWork} aria-hidden={index !== selectedWork}>
                      <div className="featured-video"><WorkCard work={work} featured /></div>
                      <div className="featured-review">
                        {index === 0 ? <>
                          <Review text={featuredWork.review} label={`Отзыв ${featuredWork.reviewAuthor}`}
                            author={<span>{featuredWork.reviewAuthor}</span>} />
                          <p className="featured-description">В исходниках было много материала Задача собрать динамичный игровой ролик по референсу в стиле MrBeast Судя по комментариям нужную подачу удалось передать многие зрители отдельно отметили сходство со стилем оригинала</p>
                        </> : getYouTubeId(work.href) === "eNbiIc5AtiA" ? <>
                          <Review text="Хотел быстро показать, на что способен мой плагин: динамичный монтаж и акценты на важных моментах."
                            label="Отзыв Wade" author={<span>Автор: Wade</span>} />
                          <p className="featured-description">Начало монтировал от 2 до 3 часов Исходные материалы создал с помощью нейросети Затем добавил динамики чтобы удержать внимание зрителя Этой работой я доволен закончил раньше чем планировал</p>
                        </> : getYouTubeId(work.href) === "R6D1iVwefPk" ? <>
                          <Review text="Хотел сделать ролик более познавательным, а интро — интересным с первых секунд, чтобы удержать внимание зрителя. В итоге это удалось: уже с первых минут понятно, что видео будет интересным."
                            label="Отзыв Wade" author={<span>Автор: Wade</span>} />
                          <p className="featured-description">На начало ушло около 6 часов монтажа с учётом правок и саунд-дизайна Как и планировал добавил больше динамики в начале и в конце Чтобы зритель не скучал по ходу ролика использовал частые вставки</p>
                        </> : <div className="author-card"><span>Автор</span><strong>Wade</strong></div>}
                      </div>
                    </div>
                    {index !== selectedWork && <button type="button" className="slide-cover" tabIndex={-1} aria-hidden="true"
                      onClick={() => goToWork(index)} />}
                  </div>)}
                  {multiple && <div className="rail-spacer" aria-hidden="true" />}
                </div>
                {multiple && <div className="rail-progress" aria-hidden="true"><m.span style={{ scaleX: railProgress }} /></div>}
              </Reveal>

              {reelsWorks.length > 0 && <div className="reels-section">
                <div className="section-head reels-head">
                  <h3><Line>Reels <em>формат</em></Line></h3>
                </div>
                <Reveal className="reels-case">
                  <div className="reels-video"><WorkCard work={reelsWorks[0]} /></div>
                  <div className="reels-review">
                    <Review text={reelsReview} label="Отзыв aquarody" author={<span>Автор: aquarody</span>} />
                    <p className="featured-description">В исходниках было сухое видео Я сократил его чтобы добавить динамики создал изображения с помощью нейросети и выбрал самые подходящие</p>
                  </div>
                </Reveal>
                {reelsWorks.length > 1 && <div className="reels-grid">
                  {reelsWorks.slice(1).map((work, index) => <Reveal key={work.id} className="reels-item" delay={index * 0.08}><WorkCard work={work} /></Reveal>)}
                </div>}
              </div>}
            </section>

            <section className="shell reviews-section" id="reviews" aria-labelledby="reviews-title">
              <div className="section-head" data-anchor>
                <h2 id="reviews-title"><Line>Отзывы <em>заказчиков</em></Line></h2>
              </div>
              <div className="reviews-grid">
                {featuredWork.review && <Reveal className="reviews-item">
                  <ReviewCard text={featuredWork.review} author={featuredWork.reviewAuthor} context="YouTube-ролик" />
                </Reveal>}
                <Reveal className="reviews-item" delay={0.12}>
                  <ReviewCard text={reelsReview} author="aquarody" context="Reels" />
                </Reveal>
              </div>
            </section>

            <section className="shell contact-section" id="contact" aria-labelledby="contact-title">
              <h2 id="contact-title"><Line>Обсудим</Line><Line delay={0.08}><em>ваш ролик</em></Line></h2>
              <Reveal className="contact-row" delay={0.15}>
                <p className="contact-copy">Напишите что нужно смонтировать и к какому сроку</p>
                <div className="contact-actions">
                  <a className="primary-link" href={contactLinks.telegram} target="_blank" rel="noreferrer">
                    <span>Написать в Telegram</span> <ArrowRight size={18} />
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
