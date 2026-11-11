import { getCoverBackground, projects, type Project } from "./data/projects";
import { STORIES, type StoryBlock, type StoryMedia } from "./data/stories";
import { VK_CARDS } from "./data/vkCases";
import "./contact";
import { inWorkGroup, WORK_GROUPS, type WorkGroup } from "./data/workFilter";
import { animateDialog, closePopover, openPopover, settle, toggleDropdown, transitionPage } from "./motion";
import { mountStage, stageControls } from "./stage";

// Watchson and Ingrid lead, then newest first
const ORDER = ["watchson", "ingrid", "athos-commerce", "whirl", "rho-studio", "liliworld", "pewee-diary", "blindspot", "plywood"];
const list = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p));

const SITE_TITLE = "Viktor Dopke – Product Designer";

const main = document.querySelector<HTMLElement>("#main")!;
const about = document.querySelector<HTMLDialogElement>("#about")!;
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
    <video data-autoplay muted loop playsinline preload="none" poster="${card.poster}" width="${card.width ?? 1280}" height="${card.height ?? 664}" aria-hidden="true">
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

// ─── Landing page and case studies: text beside a big stage ──────────────────

// What a project shows on the stage: its recording or image, filling the frame
const slideMedia = (p: Project) => {
  const card = VK_CARDS[p.slug];
  if (card)
    return `
    <div class="media-stage media-stage--${p.slug}">
      <video muted loop playsinline preload="none" poster="${card.poster}" width="1280" height="664" aria-hidden="true">
        <source src="${card.video}.webm" type="video/webm" />
        <source src="${card.video}.mp4" type="video/mp4" />
      </video>
    </div>`;
  if (CARD_VIDEOS[p.slug]) return cardVideo(p.slug).replace(" data-autoplay", "");
  if (CARD_IMAGES[p.slug]) return cardImage(p.slug);
  return cover(p);
};

// The same, still, for the small thumbnails under All Work
const thumbMedia = (p: Project) => {
  const card = VK_CARDS[p.slug];
  if (card) return `<span class="media-stage media-stage--${p.slug}"><img src="${card.poster}" alt="" loading="lazy" /></span>`;
  const video = CARD_VIDEOS[p.slug];
  if (video) return `<span class="cover cover--fill"><img src="${video.poster}" alt="" loading="lazy" /></span>`;
  if (CARD_IMAGES[p.slug]) return cardImage(p.slug).replace("<img ", '<img loading="lazy" ');
  return cover(p);
};

const headline = (p: Project) => STORIES[p.slug]?.title ?? p.tagline;

// The project the landing page shows first: the one the visitor last came back from
let featured = list[0].slug;

function homePage() {
  const start = Math.max(0, list.findIndex((p) => p.slug === featured));
  const first = list[start];
  return `
    <div class="split split--home">
      <div class="split__intro">
        <button type="button" class="split__avatar" data-about aria-label="About Viktor"><img src="/avatar.png" alt="" width="70" height="70" /></button>
        <h1 class="split__title"><span>I'm Vik, multidisciplinary designer</span> driving design strategy for B2B&nbsp;SaaS, Startups and&nbsp;Games</h1>
        <p class="split__bio">I'm a product designer and builder with a love for games. I take inspiration from tabletop, virtual and offline games to understand how people adopt flows.</p>
        <div class="split__now">
          <p class="split__label">Currently</p>
          <p class="split__now-value"><span class="split__live" aria-hidden="true"></span>Designing Athos Commerce from Brazil</p>
        </div>
        <div class="split__actions">
          <button type="button" class="pill pill--dark" data-contact>Lets Talk</button>
          <a class="pill pill--light" href="/Viktor-Dopke-Resume.pdf" download="Viktor-Dopke-Resume.pdf" data-external>Resume <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12m0 0-4-4m4 4 4-4" /><path d="M4 20h16" /></svg></a>
        </div>
      </div>

      <section class="split__work" aria-label="All work">
        <p class="split__label"><span>All Work</span><span>${list.length} projects</span></p>
        <ul class="thumbs">${list
          .map(
            (p, i) => `
          <li><button type="button" class="thumb" data-goto="${i}" aria-pressed="${i === start}" aria-label="Show ${esc(p.name)}">${thumbMedia(p)}</button></li>`,
          )
          .join("")}
        </ul>
      </section>

      <div class="split__main">
        <div class="stage" data-stage="timer" data-start="${start}" aria-roledescription="carousel" aria-label="Projects">
          <div class="stage__frame">
            ${list
              .map(
                (p, i) => `
            <div class="stage__slide" data-slug="${esc(p.slug)}" data-tags="${esc(p.tags.slice(0, 3).join("|"))}" data-headline="${esc(headline(p))}" aria-roledescription="slide" aria-label="${i + 1} of ${list.length}: ${esc(p.name)}">${slideMedia(p)}</div>`,
              )
              .join("")}
            <div class="stage__bar">
              <div class="stage__info" aria-live="polite">
                <p class="stage__tags">${first.tags.slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join("")}</p>
                <p class="stage__headline">${esc(headline(first))}</p>
              </div>
              <a class="pill pill--dark" href="/work/${esc(first.slug)}/" data-details>Project Details</a>
            </div>
          </div>
          ${stageControls(list.length, "Pause")}
        </div>
      </div>
    </div>`;
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

// A case study's slides: its cover, then the media each paragraph talks about
const sceneMedia = (m: StoryMedia) => {
  if ("stage" in m) {
    // Without a poster, the recording loads enough to show its first frame
    const video = `<video muted loop playsinline ${m.poster ? `preload="none" poster="${m.poster}"` : `preload="metadata"`} width="${m.width}" height="${m.height}" aria-label="${esc(m.label)}">
        <source src="${m.video}.webm" type="video/webm" />
        <source src="${m.video}.mp4" type="video/mp4" />
      </video>`;
    return m.stage === "native" ? `<span class="cover cover--scene">${video}</span>` : `<div class="media-stage media-stage--${m.stage}">${video}</div>`;
  }
  // A full composition stands on a stretched copy of itself, so it never crops
  const fill = m.backdrop ?? (m.full ? m.src : "");
  const backdrop = fill ? ` style="background-image:url('${esc(fill)}')"` : "";
  return `<span class="cover cover--scene${m.backdrop ? " cover--backdrop" : ""}${m.full ? " cover--full" : ""}"${backdrop}><img src="${esc(m.src)}" alt="${esc(m.alt)}" loading="lazy" /></span>`;
};

// One section under its label: every headline and paragraph that shares it
const caseSection = (section: StoryBlock[], scene: number, end = "") => `
  <section class="case-side__block" data-scene="${scene}">
    ${section[0].label ? `<p class="case-side__label">${esc(section[0].label)}</p>` : ""}
    ${section.map(caseBlock).join("")}
    ${end}
  </section>`;

const caseBlock = (b: StoryBlock) => `
    <h2>${esc(b.headline)}</h2>
    ${b.text ? `<p>${esc(b.text)}</p>` : ""}
    ${b.points ? `<ul>${b.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` : ""}
    ${b.versus ? b.versus.map((v) => `<p><strong>${esc(v.label)}.</strong> ${esc(v.text)}</p>`).join("") : ""}
    ${b.stats ? `<dl class="case-side__stats">${b.stats.map((st) => `<div><dt>${esc(st.value)}</dt><dd>${esc(st.label)}</dd></div>`).join("")}</dl>` : ""}`;

function casePage(p: Project) {
  const next = list[(list.indexOf(p) + 1) % list.length];
  const story = STORIES[p.slug];
  const blocks = story?.blocks ?? [];

  // Headlines without a label continue the section before them, so a section is
  // read, scrolled to and swiped to as one
  const sections: StoryBlock[][] = [];
  blocks.forEach((b) => (b.label || !sections.length ? sections.push([b]) : sections[sections.length - 1].push(b)));

  // Slide 0 is the same image the landing page showed, so opening the project keeps
  // it in place; each section with media of its own adds the next one, and a
  // section without keeps the slide before it
  const scenes = [slideMedia(p)];
  const sceneOf = sections.map((section) => {
    const b = section.find((x) => x.media?.length || x.compare);
    const media: StoryMedia | undefined = b?.media?.[0] ?? (b?.compare ? { src: b.compare.after, alt: b.compare.afterAlt } : undefined);
    if (media) scenes.push(sceneMedia(media));
    return scenes.length - 1;
  });
  const nextLink = nextProject(next);
  const facts = story?.facts ?? [{ label: "Role", value: p.role }, { label: "Year", value: p.year }];

  return `
    <div class="split split--case">
      <div class="split__main">
        <div class="stage" data-stage="scroll">
          <div class="stage__frame${story?.panorama ? " stage__frame--panorama" : ""}">
            ${story?.panorama ? `<img class="stage__panorama" src="${esc(story.panorama)}" alt="" aria-hidden="true" />` : ""}
            ${scenes.map((media) => `<div class="stage__slide">${media}</div>`).join("")}
            <a class="pill pill--dark stage__back" href="/" data-back><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg> Back to Main</a>
          </div>
          ${stageControls(scenes.length, "Fix this image while scrolling")}
        </div>
      </div>

      <article class="split__side case-side">
        <section class="case-side__intro">
        <p class="case-side__crumb"><a href="/work/">Work</a> / ${esc(p.name)}</p>
        <h1>${esc(story?.title ?? p.tagline)}</h1>
        <p class="case-side__summary">${esc(story?.summary ?? p.overview)}</p>
        ${story?.note ? `<p class="case-side__note">${esc(story.note)}</p>` : ""}
        ${story?.link ? `<a href="${esc(story.link.href)}" class="pill pill--dark" target="_blank" rel="noopener" data-external>${esc(story.link.label)}</a>` : ""}
        <dl class="case-side__facts">${facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>
        </section>
        ${sections.map((section, i) => caseSection(section, sceneOf[i], i === sections.length - 1 ? nextLink : "")).join("")}
        ${sections.length ? "" : nextLink}
      </article>
    </div>`;
}

// The way on to the next project closes the last section, on the same screen as it
const nextProject = (next: Project) => `
        <footer class="case-side__next">
          <p>Next Project</p>
          <p>${esc(next.name)}</p>
          <a class="pill pill--dark pill--wide" href="/work/${esc(next.slug)}/">Go to Next Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
        </footer>`;

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

// The stage on screen, and how to stop it before the page changes
let activeStage: { go: (index: number) => void; stop: () => void } | undefined;

function mountSplit() {
  const root = main.querySelector<HTMLElement>("[data-stage]");
  if (!root) return;
  if (root.dataset.stage === "scroll") {
    activeStage = mountStage(root, { mode: "scroll" });
    return;
  }
  // The bar over the slide and the thumbnails follow the project in front
  const info = root.querySelector<HTMLElement>(".stage__info")!;
  const details = root.querySelector<HTMLAnchorElement>("[data-details]")!;
  const thumbs = main.querySelectorAll<HTMLElement>("[data-goto]");
  let first = true;
  activeStage = mountStage(root, {
    mode: "timer",
    start: Number(root.dataset.start),
    onChange(index) {
      const slide = root.querySelectorAll<HTMLElement>(".stage__slide")[index];
      featured = slide.dataset.slug!;
      details.href = `/work/${featured}/`;
      thumbs.forEach((thumb, i) => thumb.setAttribute("aria-pressed", String(i === index)));
      info.querySelector(".stage__tags")!.innerHTML = slide.dataset.tags!.split("|").map((t) => `<span>${esc(t)}</span>`).join("");
      info.querySelector(".stage__headline")!.textContent = slide.dataset.headline!;
      if (!first) settle(info.children);
      first = false;
    },
  });
}

function render() {
  activeStage?.stop();
  activeStage = undefined;
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
  // The landing page and the case studies bring their own header
  document.body.classList.toggle("is-split", Boolean(main.querySelector(".split")));
  playVideos();
  mountSplit();
  shownSlug = currentSlug();
}

function setMenu(open: boolean) {
  toggleDropdown(navLinks, open, navToggle);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => setMenu(navToggle.getAttribute("aria-expanded") !== "true"));

// The project media that carries across pages: a card or tile's, or the stage
const PAGE_MEDIA = ".media-stage, .cover, video, img";
const stageFrame = () => main.querySelector(".stage__frame");
const cardMedia = (slug: string) => main.querySelector(`a[href="/work/${slug}/"]`)?.querySelector(PAGE_MEDIA) ?? null;
const currentSlug = () => location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  // The avatar opens a short About, grown out of it
  const avatar = target.closest<HTMLElement>("[data-about]");
  if (avatar) {
    openPopover(about, avatar);
    return;
  }

  // A thumbnail brings its project onto the stage
  const thumb = target.closest<HTMLElement>("[data-goto]");
  if (thumb) {
    activeStage?.go(Number(thumb.dataset.goto));
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
  // Between the landing page and the case studies the stage carries over, moving
  // across the screen with the same image in it
  const before = stageFrame() ?? (toCase ? link.querySelector(PAGE_MEDIA) : null);
  transitionPage(
    () => {
      history.pushState(null, "", href);
      render();
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    before,
    () => stageFrame(),
  );
});


animateDialog(about);
about.addEventListener("click", (e) => {
  if (e.target === about || (e.target as HTMLElement).closest(".contact__close")) closePopover(about);
});

// Going back, the stage moves back too, or a case study's media returns to its card
let shownSlug = currentSlug();
addEventListener("popstate", () => {
  const from = shownSlug;
  const before = stageFrame();
  transitionPage(render, before, () => stageFrame() ?? (from && !currentSlug() ? cardMedia(from) : null));
});

render();
