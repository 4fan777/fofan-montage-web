@import "tailwindcss";

@theme {
  --font-sans: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace;
  --color-fofan-bg: #050506;
  --color-fofan-panel: #0c0c0e;
  --color-fofan-line: #27272a;
  --color-fofan-red: #e3272d;
  --color-fofan-red-soft: #ff4b50;
  --color-fofan-text: #f5f5f6;
  --color-fofan-muted: #a1a1aa;
}

:root {
  color-scheme: dark;
  background: #050506;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: #050506;
}

body {
  min-height: 100dvh;
  margin: 0;
  overflow-x: hidden;
  background: #050506;
  color: #f5f5f6;
  font-family: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body::selection {
  background: rgb(227 39 45 / 0.88);
  color: #fff;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

:focus-visible {
  outline: 2px solid rgb(255 75 80 / 0.9);
  outline-offset: 4px;
}

.site-noise {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 60;
  opacity: 0.06;
  mix-blend-mode: screen;
  background-image:
    radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.75) 0 0.8px, transparent 0.9px),
    radial-gradient(circle at 80% 70%, rgb(255 255 255 / 0.45) 0 0.7px, transparent 0.8px);
  background-size: 4px 4px, 6px 6px;
}

.glass-shell {
  border: 1px solid rgb(255 255 255 / 0.1);
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.1), rgb(255 255 255 / 0.03)),
    rgb(10 10 12 / 0.68);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.08),
    0 24px 80px rgb(0 0 0 / 0.36);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
}

.red-glow {
  box-shadow:
    0 0 0 1px rgb(227 39 45 / 0.35),
    0 18px 60px rgb(227 39 45 / 0.2),
    inset 0 1px 0 rgb(255 255 255 / 0.08);
}

.theme-white {
  background:
    linear-gradient(90deg, rgb(9 9 11 / 0.045) 1px, transparent 1px),
    linear-gradient(180deg, rgb(9 9 11 / 0.04) 1px, transparent 1px),
    radial-gradient(circle at 10% 16%, rgb(227 39 45 / 0.08), transparent 28rem),
    radial-gradient(circle at 88% 78%, rgb(227 39 45 / 0.07), transparent 34rem),
    #f7f7f8;
  background-size:
    22px 22px,
    22px 22px,
    auto,
    auto,
    auto;
  color: #09090b;
}

.theme-white .site-noise {
  opacity: 0.04;
  mix-blend-mode: multiply;
}

.theme-white .glass-shell {
  border-color: rgb(9 9 11 / 0.12);
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.92), rgb(255 255 255 / 0.58)),
    rgb(255 255 255 / 0.78);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.92),
    0 24px 80px rgb(9 9 11 / 0.12),
    0 18px 70px rgb(227 39 45 / 0.08);
}

.theme-white .text-white,
.theme-white h1,
.theme-white h2,
.theme-white h3 {
  color: #09090b;
}

.theme-white .brand-logo {
  background-image: linear-gradient(90deg, #09090b, #09090b, #e3272d);
}

.theme-white .theme-toggle-active {
  background-color: #09090b;
  color: #ffffff;
}

.theme-white .red-glow {
  color: #ffffff;
}

.theme-white .text-zinc-300 {
  color: #3f3f46;
}

.theme-white .text-zinc-400,
.theme-white .text-zinc-500 {
  color: #71717a;
}

.theme-white .bg-fofan-bg {
  background-color: #f7f7f8;
}

.theme-white .bg-fofan-panel,
.theme-white .bg-zinc-950,
.theme-white [class*="bg-zinc-950"] {
  background-color: #ffffff;
}

.theme-white .border-l-white {
  border-left-color: #09090b;
}

.theme-white .theme-toggle-active {
  background-color: #09090b;
  color: #ffffff;
}

.theme-white article {
  border-color: rgb(9 9 11 / 0.12);
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.86), rgb(255 255 255 / 0.56)),
    rgb(255 255 255 / 0.76);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.86),
    0 24px 70px rgb(9 9 11 / 0.1);
}

.theme-white nav a:hover,
.theme-white .hover\:text-white:hover {
  color: #09090b;
}

.theme-white .border-white\/10 {
  border-color: rgb(9 9 11 / 0.1);
}

.theme-white .bg-white\/\[0\.04\],
.theme-white .bg-white\/\[0\.035\] {
  background-color: rgb(255 255 255 / 0.72);
}

.theme-white .from-fofan-bg {
  --tw-gradient-from: rgb(255 255 255 / 1);
}

.theme-white .from-fofan-bg\/80 {
  --tw-gradient-from: rgb(255 255 255 / 0.8);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .glass-shell {
    background: #0c0c0e;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
