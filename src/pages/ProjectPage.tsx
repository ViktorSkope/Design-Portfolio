import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SliderStage from "../components/SliderStage";
import { getCoverBackground, getNextProject, getPreviousProject, getProjectBySlug, type Project } from "../data/projects";
import { getProjectPage } from "../data/projectPage";
import CaseStudyIntro, { BODY, HAIRLINE, LABEL, TWO_COLUMNS } from "../components/CaseStudyIntro";
import { arrive, beginCollapse, beginSlide, lockScroll, TRANSITION_MS } from "../lib/pageTransition";
import { rememberCoverBox } from "../lib/scrubTransition";
import { useEdgeScroll } from "../lib/edgeScroll";
import { DARK_TONES } from "../lib/darkTones";

// Shared geometry of the page: one content column, a cover card of fixed
// proportions, and two columns with a wide gutter for everything below it.
const COVER_ASPECT = 1.588;

// ─── Placeholder for images that have not arrived yet ────────────────────────

function PlaceholderImage() {
  return (
    <div className="flex aspect-[5/3] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#3a3a3a] bg-[#1e1e1e]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b6763" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="text-[10px] uppercase tracking-[0.12em] text-[#6b6763]">Image coming soon</span>
    </div>
  );
}

// ─── Image with click-to-enlarge ─────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-10" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-6 top-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
        aria-label="Close"
      >
        Close ✕
      </button>
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

function ZoomableImage({ src, alt, position = "top", onOpen }: { src: string; alt: string; position?: "top" | "center"; onOpen: (src: string, alt: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(src, alt)}
      aria-label={`Enlarge image: ${alt}`}
      className="group relative block aspect-[5/3] w-full cursor-zoom-in overflow-hidden rounded-[14px] bg-white shadow-[0_4px_32px_rgba(0,0,0,0.06)]"
    >
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${position === "center" ? "object-center" : "object-top"} transition-transform duration-500 ease-out group-hover:scale-[1.02]`} />
    </button>
  );
}

// ─── Cover card (the big one and the side previews) ──────────────────────────

function CoverCard({ project, alt }: { project: Project; alt: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[24px]" style={{ background: getCoverBackground(project) }}>
      <img src={project.coverImage} alt={alt} draggable={false} className={`h-full w-full ${project.coverFill ? "object-cover" : "object-contain p-[1.5%]"}`} />
    </div>
  );
}

// A neighbouring project peeking in from the edge of the screen
function Peek({ project, side, onGo }: { project: Project; side: "left" | "right"; onGo: () => void }) {
  const left = side === "left";
  return (
    <Link
      to={`/work/${project.slug}`}
      onClick={(e) => {
        e.preventDefault();
        onGo();
      }}
      aria-label={`${left ? "Previous" : "Next"} project: ${project.name}`}
      className={`group/peek pointer-events-auto absolute top-0 hidden aspect-[1.588] w-full cursor-pointer md:block ${
        left ? "right-[calc(100%+32px)]" : "left-[calc(100%+32px)]"
      }`}
    >
      <span
        className={`absolute inset-0 block transition-transform duration-300 ease-out ${
          left ? "group-hover/peek:translate-x-3" : "group-hover/peek:-translate-x-3"
        }`}
      >
        <CoverCard project={project} alt="" />
      </span>
    </Link>
  );
}

// ─── Text blocks ─────────────────────────────────────────────────────────────

// ─── Page ────────────────────────────────────────────────────────────────────

function ProjectPageContent({ project }: { project: Project }) {
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const peeksRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  const content = getProjectPage(project);
  const previous = getPreviousProject(project.slug);
  const next = getNextProject(project.slug);

  // Finish whichever transition brought us here, before the first paint
  // Once per project: React runs effects twice in development, and a second pass
  // must not undo the first (it would scroll a handed-over page back to the top)
  const arrivedFor = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (arrivedFor.current === project.slug) return;
    arrivedFor.current = project.slug;
    window.scrollTo(0, 0);
    // The landing page aims its growing card (and lines up its text) by these
    if (coverRef.current && introRef.current) {
      rememberCoverBox(coverRef.current.getBoundingClientRect(), introRef.current.getBoundingClientRect().top);
    }
    const arrival = arrive(project.slug, { cover: coverRef.current, row: rowRef.current, strip: stripRef.current });
    const fade = (el: HTMLElement | null, delay: number, rise = 16, shift = 0) =>
      el?.animate(
        [
          { opacity: 0, transform: `translate(${shift}px, ${rise}px)` },
          { opacity: 1, transform: "translate(0, 0)" },
        ],
        { duration: 600, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
      );

    if (arrival.kind === "expand") {
      fade(headRef.current, 150, 8);
      fade(peeksRef.current, TRANSITION_MS * 0.7, 0);
      fade(bodyRef.current, TRANSITION_MS * 0.55);
    } else if (arrival.kind === "scrub") {
      // The cover and the opening text are already in place, exactly where the
      // landing page left them; only what follows the text rises in
      fade(headRef.current, 0, 8);
      fade(peeksRef.current, 100, 0);
      fade(restRef.current, 0, 24);
    } else if (arrival.kind === "slide") {
      // The covers travel as one strip; the text below arrives once the old text has gone
      fade(bodyRef.current, TRANSITION_MS * 0.35, 0, arrival.direction * 60);
    } else if (arrival.kind === "none") {
      fade(headRef.current, 0, 8);
      fade(peeksRef.current, 150, 0);
      fade(bodyRef.current, 100);
    }
  }, [project.slug]);

  // Neighbouring projects slide in sideways, like turning a carousel
  const slideTo = (target: Project, direction: 1 | -1) => {
    const go = () => {
      if (rowRef.current && bodyRef.current && coverRef.current) {
        beginSlide(target.slug, direction, {
          row: rowRef.current,
          body: bodyRef.current,
          pitch: coverRef.current.getBoundingClientRect().width + 32,
        });
      }
      navigate(`/work/${target.slug}`);
    };
    // From further down the page (the footer link), glide back to the covers first.
    // Either way the page stays put until the slide is over.
    if (window.scrollY > 8) {
      const wait = Math.min(600, 200 + window.scrollY * 0.25);
      lockScroll(wait + TRANSITION_MS + 700);
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(go, wait);
    } else {
      go();
    }
  };

  // Back to the landing page: the cover shrinks into this project's place in the carousel
  const goHome = () => {
    const cover = coverRef.current;
    if (cover) {
      const card = (cover.firstElementChild as HTMLElement | null) ?? cover;
      beginCollapse(
        project.slug,
        cover.getBoundingClientRect(),
        project.carouselImage ?? project.coverImage,
        getCoverBackground(project),
        getComputedStyle(card).borderTopLeftRadius,
        pageRef.current,
      );
    }
    navigate("/");
  };
  const backToWork = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    goHome();
  };
  // Scrolling up past the top of the case study goes back, the cover shrinking
  // into its place in the carousel. Wheel only: on phones that pull refreshes.
  useEdgeScroll("top", goHome, { touch: false });

  return (
    <div id="project-page" ref={pageRef} className="min-h-screen bg-(--bg) pb-24 [--cw:min(1000px,calc(100vw-40px))] md:pb-28" style={DARK_TONES}>
      {/* Header and way back. The header keeps the light page; the case study below is dark. */}
      <div ref={headRef} className="mx-auto w-[var(--cw)]">
        <div className="relative z-40 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-page">
          <Navbar />
        </div>
        <Link
          to="/#work"
          onClick={backToWork}
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--muted) transition-colors hover:text-(--ink)"
        >
          <span aria-hidden="true">←</span> Back to work
        </Link>
      </div>

      {/* Cover, with the neighbouring projects peeking in from both sides */}
      <div ref={rowRef} className="relative left-1/2 mt-[22px] w-screen -translate-x-1/2 overflow-x-clip">
        <div ref={stripRef} data-strip>
        <div className="relative mx-auto w-[var(--cw)]" style={{ aspectRatio: COVER_ASPECT }}>
          <div ref={coverRef} data-cover className="absolute inset-0">
            <CoverCard project={project} alt={project.coverImageAlt} />
          </div>
          <div ref={peeksRef} className="pointer-events-none absolute inset-0">
            <Peek project={previous} side="left" onGo={() => slideTo(previous, -1)} />
            <Peek project={next} side="right" onGo={() => slideTo(next, 1)} />
          </div>
        </div>
        </div>
      </div>

      <div ref={bodyRef} className="mx-auto w-[var(--cw)]">
        {/* Title, role and year, then the problem and my role */}
        <div ref={introRef} data-intro className="mt-[29px]">
          <CaseStudyIntro project={project} />
        </div>

        {/* Everything after the opening */}
        <div ref={restRef}>
        {/* Approach, process, findings… */}
        {content.sections.map((section) => (
          <section key={section.label} className="mt-[64px]">
            <p className={`${LABEL} border-b ${HAIRLINE} pb-3`}>{section.label}</p>
            <div className={`mt-7 flex flex-col gap-10 ${TWO_COLUMNS} md:gap-y-12`}>
              {section.items.map((item, i) => (
                <figure key={i}>
                  {item.image ? (
                    <ZoomableImage src={item.image.src} alt={item.image.alt} position={item.image.position} onOpen={(src, alt) => setLightbox({ src, alt })} />
                  ) : (
                    <PlaceholderImage />
                  )}
                  <figcaption className={`${BODY} mt-6`}>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}

        {/* The only before / after slider lives on the Athos page */}
        {content.beforeAfter && (
          <section className="mt-[64px]">
            <p className={`${LABEL} border-b ${HAIRLINE} pb-3`}>Before / After</p>
            <div className="mt-7">
              <SliderStage
                before={content.beforeAfter.before}
                after={content.beforeAfter.after}
                beforeAlt={content.beforeAfter.beforeAlt}
                afterAlt={content.beforeAfter.afterAlt}
              />
            </div>
          </section>
        )}

        {/* Tags and the next project */}
        <footer className="mt-[72px] flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-[3px] border border-(--hair) px-3 py-[7px] text-[9px] font-semibold uppercase tracking-[0.16em] text-(--muted)">
                {tag}
              </li>
            ))}
          </ul>
          <Link
            to={`/work/${next.slug}`}
            onClick={(e) => {
              e.preventDefault();
              slideTo(next, 1);
            }}
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-(--ink) transition-colors hover:text-accent"
          >
            Next: {next.name} <span aria-hidden="true">→</span>
          </Link>
        </footer>
        </div>
      </div>

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  if (!project) return <Navigate to="/" replace />;
  // A new key per project remounts the page, so each one introduces itself afresh
  return <ProjectPageContent key={project.slug} project={project} />;
}
