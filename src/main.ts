import { getCoverBackground, projects, type Project } from "./data/projects";
import { STORIES, type StoryBlock, type StoryMedia, type StoryRecording } from "./data/stories";
import { VK_CARDS } from "./data/vkCases";
import "./contact";
import { inWorkGroup, WORK_GROUPS, type WorkGroup } from "./data/workFilter";
import { animateDialog, closePopover, openPopover, settle, toggleDropdown, transitionPage } from "./motion";

// Watchson and Ingrid lead, then newest first
const ORDER = ["watchson", "ingrid", "athos-commerce", "whirl", "rho-studio", "liliworld", "pewee-diary", "blindspot", "plywood"];
const list = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p));

const SITE_TITLE = "Viktor Dopke – Product Designer";

const main = document.querySelector<HTMLElement>("#main")!;
const lightbox = document.querySelector<HTMLDialogElement>("#lightbox")!;
const navLinks = document.querySelector<HTMLElement>(".nav__links")!;
const navToggle = document.querySelector<HTMLElement>(".nav__toggle")!;

const esc = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// ─── Pieces ──────────────────────────────────────────────────────────────────

const cover = (p: Project, className = "") => `
  <span class="cover ${p.coverFill ? "cover--fill" : ""} ${className}" style="background:${esc(getCoverBackground(p))}">
    <img src="${esc(p.coverImage)}" alt="${esc(p.coverImageAlt)}" />
  </span>`;

// A project's recording on its backdrop, where it has one
const stage = (slug: string) => {
  const card = VK_CARDS[slug];
  return `
  <div class="media-stage media-stage--${slug} media-stage--card">
    <video data-autoplay muted loop playsinline preload="none" poster="${card.poster}" width="1280" height="664" aria-hidden="true">
      <source src="${card.video}.webm" type="video/webm" />
      <source src="${card.video}.mp4" type="video/mp4" />
    </video>
  </div>`;
};

// Animations that fill a card on their own, with no backdrop
const CARD_VIDEOS: Record<string, { video: string; poster: string; width: number; height: number }> = {
  whirl: { video: "/videos/whirl-card", poster: "/images/work/whirl-card-poster.webp", width: 876, height: 656 },
};

const cardVideo = (slug: string) => {
  const card = CARD_VIDEOS[slug];
  return `
  <span class="cover cover--video">
    <video data-autoplay muted loop playsinline preload="none" poster="${card.poster}" width="${card.width}" height="${card.height}" aria-hidden="true">
      <source src="${card.video}.webm" type="video/webm" />
      <source src="${card.video}.mp4" type="video/mp4" />
    </video>
  </span>`;
};

// Thumbnails composed with their own background, cropped to fill the card
const CARD_IMAGES: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "athos-commerce": {
    src: "/images/work/athos-card.webp",
    alt: "The Athos Commerce dashboard over a soft watercolour background, showing search performance, catalog sync and category performance.",
    width: 2000,
    height: 1260,
  },
  liliworld: {
    src: "/images/work/liliworld-card.webp",
    alt: "The LiliWorld island from above: an observatory, shops and a greenhouse around a stone plaza, with a dock and a boat on turquoise water.",
    width: 2000,
    height: 1266,
  },
};

const cardImage = (slug: string, className = "") => {
  const card = CARD_IMAGES[slug];
  return `
  <span class="cover cover--fill ${className}">
    <img src="${card.src}" alt="${esc(card.alt)}" width="${card.width}" height="${card.height}" />
  </span>`;
};

const workCard = (p: Project) => `
  <li data-slug="${esc(p.slug)}">
    <a href="/work/${esc(p.slug)}/" class="work-card">
      ${VK_CARDS[p.slug] ? stage(p.slug) : CARD_VIDEOS[p.slug] ? cardVideo(p.slug) : CARD_IMAGES[p.slug] ? cardImage(p.slug) : cover(p)}
      <p class="work-card__meta">${esc(VK_CARDS[p.slug]?.meta ?? `${p.category} · ${p.year}`)}</p>
      <h3>${esc(p.name)}</h3>
      <p>${esc(VK_CARDS[p.slug]?.result ?? p.impact ?? p.tagline)}</p>
    </a>
  </li>`;

// ─── Pages ───────────────────────────────────────────────────────────────────

function homePage() {
  return `
    <section class="hero container">
      <h1 class="hero__title">
        <span class="hero__title-setup">Multidisciplinary product designer with 10+ YOE</span>
        driving design strategy for B2B&nbsp;SaaS, Startups and&nbsp;Games.<span class="hero__chip" aria-hidden="true"><img src="/avatar-pixel.webp" alt="" width="50" height="50" /></span>
      </h1>
    </section>

    <section class="section container home-work" aria-label="Selected work">
      <ul class="card-grid">${list.slice(0, 6).map(workCard).join("")}</ul>
    </section>`;
}

function workPage() {
  const groups = Object.entries(WORK_GROUPS) as [WorkGroup, { label: string }][];
  return `
    <section class="page-hero container"><h1>Work</h1></section>
    <section class="section container" aria-label="Projects">
      <div class="filter-bar" role="group" aria-label="Filter projects">
        <button type="button" class="btn btn--outline btn--small" data-filter="all" aria-pressed="true">All</button>
        ${groups.map(([id, g]) => `<button type="button" class="btn btn--outline btn--small" data-filter="${id}" aria-pressed="false">${esc(g.label)}</button>`).join("")}
      </div>
      <ul class="card-grid">${list.map(workCard).join("")}</ul>
    </section>`;
}

function aboutPage() {
  return `
    <section class="page-hero container">
      <h1>Viktor Dopke</h1>
      <p class="page-hero__lead">Product Designer · Curitiba, Brazil</p>
    </section>
    <section class="section container about-grid">
      <img src="/about-photo.png" alt="Viktor Dopke" />
      <div class="case-section__body">
        <p class="lead">I design digital products with a focus on clarity, usefulness, and the kind of detail that makes things feel considered.</p>
        <p>My work spans B2B platforms, consumer apps, and internal tools, usually somewhere between the mess of discovery and the satisfaction of shipping something that works.</p>
        <p>I care about understanding problems before solving them, working closely with engineers and product teams, and making sure the people actually using a product are never an afterthought. When I am not designing I am probably reading about things I have no practical use for, or spending too much time on a side project nobody asked for.</p>
        <div class="about-links">
          <a class="btn btn--outline btn--small" href="https://www.behance.net/vikdopke">Behance</a>
          <a class="btn btn--outline btn--small" href="https://www.linkedin.com/in/viktor-dopke/">LinkedIn</a>
          <a class="btn btn--outline btn--small" href="https://medium.com/@vikdpk">Medium</a>
        </div>
      </div>
    </section>`;
}

const nextProject = (next: Project) => `
  <section class="section container container--case">
    <a class="next-project" href="/work/${esc(next.slug)}/">
      <div><span>Next project</span><strong>${esc(next.name)}</strong></div>
      <span class="text-link">View case study</span>
    </a>
  </section>`;

const recording = (r: StoryRecording) => `
  <div class="media-stage media-stage--${r.stage}"${r.stage === "native" ? ` style="aspect-ratio:${r.width}/${r.height}"` : ""}>
    <video data-autoplay muted loop playsinline preload="none" poster="${r.poster}" width="${r.width}" height="${r.height}" aria-label="${esc(r.label)}">
      <source src="${r.video}.webm" type="video/webm" />
      <source src="${r.video}.mp4" type="video/mp4" />
    </video>
  </div>`;

const figure = (m: StoryMedia) => `
  <figure class="story-figure${"plain" in m && m.plain ? " story-figure--plain" : ""}${"backdrop" in m && m.backdrop ? " story-figure--staged" : ""}">
    ${"stage" in m ? recording(m) : "plain" in m && m.plain ? `<img src="${esc(m.src)}" alt="${esc(m.alt)}" loading="lazy" />` : `<button type="button" data-zoom="${esc(m.src)}" aria-label="Enlarge image: ${esc(m.alt)}"${"backdrop" in m && m.backdrop ? ` style="background-image:url('${esc(m.backdrop)}')"` : ""}><img src="${esc(m.src)}" alt="${esc(m.alt)}" loading="lazy" /></button>`}
    ${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ""}
  </figure>`;

const anchor = (label: string) => "s-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const storyBlock = (b: StoryBlock) => {
  const text = `
    <p class="story-block__label">${esc(b.label)}</p>
    <h2>${esc(b.headline)}</h2>
    ${b.text ? `<p class="story-block__text">${esc(b.text)}</p>` : ""}
    ${b.points ? `<ul class="story-block__points">${b.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` : ""}`;
  const stats = b.stats
    ? `<div class="stats story-stats">${b.stats.map((st) => `<div class="stat"><strong>${esc(st.value)}</strong><span>${esc(st.label)}</span></div>`).join("")}</div>`
    : "";
  const compare = b.compare
    ? `<figure class="story-figure">
        <div class="compare">
          <img src="${esc(b.compare.before)}" alt="${esc(b.compare.beforeAlt)}" loading="lazy" />
          <img class="compare__after" src="${esc(b.compare.after)}" alt="${esc(b.compare.afterAlt)}" loading="lazy" />
          <span class="compare__line"></span>
          <input type="range" min="0" max="100" value="50" aria-label="Compare before and after" />
        </div>
        ${b.compare.caption ? `<figcaption>${esc(b.compare.caption)}</figcaption>` : ""}
      </figure>`
    : "";
  const media = b.media?.length ? `<div class="story-media${b.pair ? " story-media--pair" : ""}">${b.media.map(figure).join("")}</div>` : "";
  const versus = b.versus
    ? `<div class="story-versus">${b.versus.map((v) => `<div><p class="story-versus__label">${esc(v.label)}</p><p>${esc(v.text)}</p></div>`).join("")}</div>`
    : "";
  const kind = [b.split && "story-block--split", b.split && b.reverse && "story-block--reverse", b.emphasis && "story-block--emphasis"]
    .filter(Boolean)
    .join(" ");
  return b.split
    ? `<section class="story-block ${kind}" id="${anchor(b.label)}"><div>${text}${stats}${versus}</div>${media}</section>`
    : `<section class="story-block ${kind}" id="${anchor(b.label)}">${text}${stats}${versus}${compare}${media}</section>`;
};

function casePage(p: Project) {
  const next = list[(list.indexOf(p) + 1) % list.length];
  const story = STORIES[p.slug];
  const coverMedia = story?.cover
    ? recording(story.cover).replace('class="media-stage', 'class="case-cover media-stage')
    : CARD_IMAGES[p.slug]
      ? cardImage(p.slug, "case-cover")
      : cover(p, "case-cover");
  const blocks = story?.blocks ?? [];

  return `
    <section class="page-hero container container--case story-hero">
      <p class="breadcrumb"><a href="/work/">Work</a> / ${esc(p.name)}</p>
      <h1>${esc(story?.title ?? p.tagline)}</h1>
      <p class="page-hero__lead">${esc(story?.summary ?? p.overview)}</p>
      ${story?.link ? `<div class="page-hero__actions"><a href="${esc(story.link.href)}" class="btn btn--primary" target="_blank" rel="noopener" data-external>${esc(story.link.label)}</a></div>` : ""}
      <dl class="case-meta">${(story?.facts ?? [{ label: "Role", value: p.role }, { label: "Year", value: p.year }])
        .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
        .join("")}</dl>
    </section>
    <section class="container container--case" aria-label="${esc(p.name)} cover">${coverMedia}</section>
    ${
      blocks.length
        ? `<div class="container container--case story">${blocks.map(storyBlock).join("")}</div>`
        : ""
    }
    ${nextProject(next)}`;
}

// ─── Routing ─────────────────────────────────────────────────────────────────

// Recordings play only while on screen
let watcher: IntersectionObserver | undefined;

function playVideos() {
  watcher?.disconnect();
  const videos = main.querySelectorAll<HTMLVideoElement>("video[data-autoplay]");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    videos.forEach((video) => (video.controls = true));
    return;
  }
  watcher = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const video = target as HTMLVideoElement;
      if (isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  });
  videos.forEach((video) => watcher!.observe(video));
}

// Before/after sliders sweep from side to side while in view, until someone drags them
let sweeper: IntersectionObserver | undefined;

function sweepCompares() {
  sweeper?.disconnect();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  main.querySelectorAll<HTMLElement>(".compare").forEach((box) => {
    const input = box.querySelector("input")!;
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let stopped = false;
    const PERIOD = 6000;
    const step = (now: number) => {
      if (last) elapsed += now - last;
      last = now;
      const value = 50 + 42 * Math.sin((elapsed / PERIOD) * 2 * Math.PI);
      input.value = String(value);
      box.style.setProperty("--split", `${value}%`);
      frame = requestAnimationFrame(step);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      last = 0;
    };
    const stop = () => {
      stopped = true;
      pause();
    };
    ["pointerdown", "keydown", "input"].forEach((type) => box.addEventListener(type, stop, { once: true }));
    (box as HTMLElement & { _sweep?: (on: boolean) => void })._sweep = (on) => {
      if (stopped) return;
      pause();
      if (on) frame = requestAnimationFrame(step);
    };
  });
  // Starts once the slider is well into view, so the reader sees it begin
  sweeper = new IntersectionObserver(
    (entries) => entries.forEach(({ target, isIntersecting }) => (target as HTMLElement & { _sweep?: (on: boolean) => void })._sweep?.(isIntersecting)),
    { threshold: 0.6 },
  );
  main.querySelectorAll(".compare").forEach((box) => sweeper!.observe(box));
}

function render() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const slug = path.match(/^\/work\/([^/]+)$/)?.[1];
  const project = slug ? list.find((p) => p.slug === slug) : undefined;

  if (project) {
    main.innerHTML = casePage(project);
    document.title = `${project.name} – Viktor Dopke`;
  } else if (path === "/work") {
    main.innerHTML = workPage();
    document.title = `Work – Viktor Dopke`;
  } else if (path === "/about") {
    main.innerHTML = aboutPage();
    document.title = `About – Viktor Dopke`;
  } else {
    main.innerHTML = homePage();
    document.title = SITE_TITLE;
  }

  // Cards arrive as staggered rows, and a case study's facts settle in one after another
  settle(main.querySelectorAll(".card-grid > li"));
  settle(main.querySelectorAll(".case-meta > div, .stats > .stat"));

  // As on the previous portfolio, everything but About counts as Work
  const section = path === "/about" ? "about" : "work";
  navLinks.querySelectorAll<HTMLElement>("[data-page]").forEach((link) => {
    if (link.dataset.page === section) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  setMenu(false);
  playVideos();
  sweepCompares();
  shownSlug = currentSlug();
}

function setMenu(open: boolean) {
  toggleDropdown(navLinks, open, navToggle);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => setMenu(navToggle.getAttribute("aria-expanded") !== "true"));

// The project media that carries across pages: a card or tile's, or the case study's own
const PAGE_MEDIA = ".media-stage, .cover, video, img";
const caseMedia = () => main.querySelector(".case-cover");
const cardMedia = (slug: string) => main.querySelector(`a[href="/work/${slug}/"]`)?.querySelector(PAGE_MEDIA) ?? null;
const currentSlug = () => location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  const zoom = target.closest<HTMLElement>("[data-zoom]");
  if (zoom) {
    const big = lightbox.querySelector("img")!;
    big.src = zoom.dataset.zoom!;
    big.alt = zoom.querySelector("img")?.alt ?? "";
    openPopover(lightbox, zoom);
    return;
  }

  const filter = target.closest<HTMLElement>("[data-filter]");
  if (filter) {
    const group = filter.dataset.filter!;
    main.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === filter)));
    main.querySelectorAll<HTMLElement>("[data-slug]").forEach((li) => {
      li.classList.toggle("is-filtered-out", group !== "all" && !inWorkGroup(group as WorkGroup, li.dataset.slug!));
    });
    return;
  }

  // Links inside the site change the page without a reload
  const link = target.closest<HTMLAnchorElement>("a[href^='/']");
  if (!link || link.hasAttribute("data-external") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  const href = link.getAttribute("href")!;
  const toCase = /^\/work\/[^/]+\/?$/.test(href);
  transitionPage(
    () => {
      history.pushState(null, "", href);
      render();
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    toCase ? link.querySelector(PAGE_MEDIA) : null,
    () => (toCase ? caseMedia() : null),
  );
});

document.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;
  if (input.matches(".compare input")) input.parentElement!.style.setProperty("--split", `${input.value}%`);
});

animateDialog(lightbox);
lightbox.addEventListener("click", () => closePopover(lightbox));

// Going back from a case study, its media returns to the card it came from
let shownSlug = currentSlug();
addEventListener("popstate", () => {
  const from = shownSlug;
  const before = from ? caseMedia() : null;
  transitionPage(render, before, () => (from && !currentSlug() ? cardMedia(from) : null));
});

render();
