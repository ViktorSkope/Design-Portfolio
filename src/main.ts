import { getCoverBackground, projects, type Project } from "./data/projects";
import { getProjectPage } from "./data/projectPage";
import { VK_CARDS, VK_CASES } from "./data/vkCases";
import "./contact";
import { inWorkGroup, WORK_GROUPS, type WorkGroup } from "./data/workFilter";
import { animateDialog, closePopover, openPopover, settle, toggleDropdown, transitionPage } from "./motion";

// Watchson and Ingrid lead, then newest first
const ORDER = ["watchson", "ingrid", "athos-commerce", "whirl", "rho-studio", "liliworld", "pewee-diary", "blindspot", "plywood"];
const list = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p));

const COMING_SOON = "Details coming soon.";
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

const workCard = (p: Project) => `
  <li data-slug="${esc(p.slug)}">
    <a href="/work/${esc(p.slug)}/" class="work-card">
      ${VK_CARDS[p.slug] ? stage(p.slug) : CARD_VIDEOS[p.slug] ? cardVideo(p.slug) : cover(p)}
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

const caseSection = (title: string, body: string) => `
  <section class="section container case-section">
    <h2>${esc(title)}</h2>
    <div class="case-section__body">${body}</div>
  </section>`;

const nextProject = (next: Project) => `
  <section class="section container">
    <a class="next-project" href="/work/${esc(next.slug)}/">
      <div><span>Next project</span><strong>${esc(next.name)}</strong></div>
      <span class="text-link">View case study</span>
    </a>
  </section>`;

function casePage(p: Project) {
  const next = list[(list.indexOf(p) + 1) % list.length];
  if (VK_CASES[p.slug]) return VK_CASES[p.slug] + nextProject(next);
  const page = getProjectPage(p);
  const sections = page.sections
    .map((s) => ({ ...s, items: s.items.filter((item) => item.image || item.caption !== COMING_SOON) }))
    .filter((s) => s.items.length);

  return `
    <section class="page-hero container">
      <p class="breadcrumb"><a href="/work/">Work</a> / ${esc(p.name)}</p>
      <h1><span class="slate">${esc(p.name)}.</span> ${esc(p.tagline)}</h1>
      <dl class="case-meta">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
        <div><dt>Type</dt><dd>${esc(p.category)}</dd></div>
        ${p.impact ? `<div><dt>Results</dt><dd>${esc(p.impact)}</dd></div>` : ""}
      </dl>
    </section>
    <section class="container" aria-label="${esc(p.name)} cover">${cover(p, "case-cover")}</section>
    ${caseSection("Problem", `<p class="lead">${esc(page.problem)}</p>`)}
    ${caseSection("My role", `<p>${esc(page.myRole)}</p>`)}
    ${sections
      .map((s) =>
        caseSection(
          s.label,
          s.items
            .map(
              (item) => `
              <figure class="case-figure">
                ${item.image ? `<button type="button" data-zoom="${esc(item.image.src)}" aria-label="Enlarge image: ${esc(item.image.alt)}"><img src="${esc(item.image.src)}" alt="${esc(item.image.alt)}" loading="lazy" /></button>` : ""}
                ${item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ""}
              </figure>`,
            )
            .join(""),
        ),
      )
      .join("")}
    ${
      page.beforeAfter
        ? caseSection(
            "Before / After",
            `<div class="compare">
              <img src="${esc(page.beforeAfter.before)}" alt="${esc(page.beforeAfter.beforeAlt)}" loading="lazy" />
              <img class="compare__after" src="${esc(page.beforeAfter.after)}" alt="${esc(page.beforeAfter.afterAlt)}" loading="lazy" />
              <span class="compare__line"></span>
              <input type="range" min="0" max="100" value="50" aria-label="Compare before and after" />
            </div>`,
          )
        : ""
    }
    ${caseSection("Tags", `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`)}
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
const caseMedia = () => main.querySelector(".media-stage, .case-cover");
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
