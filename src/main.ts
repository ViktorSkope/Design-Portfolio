import { getCoverBackground, projects, type Project } from "./data/projects";
import { getProjectPage } from "./data/projectPage";
import { VK_CARDS, VK_CASES } from "./data/vkCases";
import "./contact";
import { inWorkGroup, WORK_GROUPS, type WorkGroup } from "./data/workFilter";

// Watchson and Ingrid lead, then newest first
const ORDER = ["watchson", "ingrid", "athos-commerce", "blindspot", "rho-studio", "liliworld", "pewee-diary", "whirl", "plywood"];
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

const workCard = (p: Project) => `
  <li data-slug="${esc(p.slug)}">
    <a href="/work/${esc(p.slug)}/" class="work-card">
      ${VK_CARDS[p.slug] ? stage(p.slug) : cover(p)}
      <p class="work-card__meta">${esc(VK_CARDS[p.slug]?.meta ?? `${p.category} · ${p.year}`)}</p>
      <h3>${esc(p.name)}</h3>
      <p>${esc(VK_CARDS[p.slug]?.result ?? p.impact ?? p.tagline)}</p>
    </a>
  </li>`;

const tile = (p: Project, kind: string) => `
  <a href="/work/${esc(p.slug)}/" class="tile tile--${kind}" aria-label="${esc(p.name)} case study">${VK_CARDS[p.slug] ? stage(p.slug) : cover(p)}</a>`;

// The truck status card recording, cut to fill this tile
const ingridTile = `
  <a href="/work/ingrid/" class="tile tile--truck-card" aria-label="Ingrid case study: a truck status card over a satellite map, showing speed, payload and arrival time">
    <video data-autoplay muted loop playsinline preload="none" poster="/images/work/ingrid-truck-card-poster.webp" width="946" height="430" aria-hidden="true">
      <source src="/videos/ingrid-truck-card.webm" type="video/webm" />
      <source src="/videos/ingrid-truck-card.mp4" type="video/mp4" />
    </video>
  </a>`;

const whirlTile = `
  <a href="/work/whirl/" class="tile tile--whirl" aria-label="Whirl case study: how the spiraling handwritten logo was built">
    <img src="/whirl-logo-construction.png" alt="" width="1159" height="906" />
  </a>`;

// ─── Pages ───────────────────────────────────────────────────────────────────

function homePage() {
  const watchson = list.find((p) => p.slug === "watchson")!;
  return `
    <section class="hero container">
      <h1 class="hero__title">
        <span class="hero__title-setup">Multidisciplinary product designer with 10+ YOE</span>
        driving design strategy for B2B&nbsp;SaaS, Startups and&nbsp;Games.<span class="hero__chip" aria-hidden="true"><img src="/avatar-pixel.webp" alt="" width="50" height="50" /></span>
      </h1>
      <div class="hero__actions">
        <button type="button" data-contact class="btn btn--primary">Get in touch</button>
        <a href="/work/" class="btn btn--outline">See all work</a>
      </div>
    </section>

    <section class="mosaic container" aria-label="Selected work">
      <div class="mosaic__grid">
        ${tile(watchson, "fleet")}${whirlTile}${ingridTile}
      </div>
    </section>

    <section class="section container">
      <div class="section-head">
        <h2>Selected work</h2>
        <a href="/work/" class="text-link">See all work</a>
      </div>
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

  // As on the previous portfolio, everything but About counts as Work
  const section = path === "/about" ? "about" : "work";
  navLinks.querySelectorAll<HTMLElement>("[data-page]").forEach((link) => {
    if (link.dataset.page === section) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  setMenu(false);
  playVideos();
}

function setMenu(open: boolean) {
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  const zoom = target.closest<HTMLElement>("[data-zoom]");
  if (zoom) {
    const big = lightbox.querySelector("img")!;
    big.src = zoom.dataset.zoom!;
    big.alt = zoom.querySelector("img")?.alt ?? "";
    lightbox.showModal();
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
  history.pushState(null, "", link.getAttribute("href")!);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
});

document.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;
  if (input.matches(".compare input")) input.parentElement!.style.setProperty("--split", `${input.value}%`);
});

lightbox.addEventListener("click", () => lightbox.close());
addEventListener("popstate", render);

render();
