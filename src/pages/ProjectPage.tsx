import { useState, useEffect, useCallback } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import ImageCarousel from "../components/ImageCarousel";
import { getNextProject, getProjectBySlug, type CaseStudySection, type CardColumn, type Project } from "../data/projects";

// ─── Placeholder image block ─────────────────────────────────────────────────

interface PlaceholderProps {
  label?: string;
  aspect?: "wide" | "tall" | "square";
}

function PlaceholderImage({ label, aspect = "wide" }: PlaceholderProps) {
  const aspectClass =
    aspect === "tall"
      ? "aspect-[9/16]"
      : aspect === "square"
      ? "aspect-square"
      : "aspect-[16/9]";

  return (
    <div className={`w-full ${aspectClass} bg-[#f0f2f7] dark:bg-[#131827] border border-dashed border-[#cdd3e0] dark:border-[#1e2535] flex flex-col items-center justify-center gap-2`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#adb5c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && (
        <span className="text-[10px] text-[#adb5c8] dark:text-[#2e3650] uppercase tracking-[0.12em] text-center px-4 leading-relaxed">
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white/70 hover:text-white text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
        aria-label="Close"
      >
        Close ✕
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ─── Clickable image ──────────────────────────────────────────────────────────

function ZoomableImage({ src, alt, onOpen }: { src: string; alt: string; onOpen: (src: string, alt: string) => void }) {
  return (
    <div className="relative group cursor-zoom-in" onClick={() => onOpen(src, alt)}>
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-semibold uppercase tracking-[0.16em] bg-black/50 px-3 py-1.5">
          Expand
        </span>
      </div>
    </div>
  );
}

// ─── Impact / Challenge card grid ────────────────────────────────────────────

function CardGrid({ columns }: { columns: CardColumn[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {columns.map((col) => (
        <div key={col.label} className="flex flex-col gap-3">
          <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${col.variant === "positive" ? "text-[#2d7a3a] dark:text-[#4ade80]" : "text-[#a63030] dark:text-[#f87171]"}`}>
            {col.label}
          </span>
          <div className="flex flex-col gap-2">
            {col.items.map((item) => (
              <div
                key={item}
                className={`px-4 py-3 text-[13px] leading-[1.6] ${
                  col.variant === "positive"
                    ? "bg-[#edf7ef] dark:bg-[#0d1f10] text-[#1e4d27] dark:text-[#86efac] border border-[#c3e6cb] dark:border-[#14532d]"
                    : "bg-[#fdf0f0] dark:bg-[#1f0d0d] text-[#5a1f1f] dark:text-[#fca5a5] border border-[#f5c6c6] dark:border-[#7f1d1d]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Case study section block ────────────────────────────────────────────────

interface SectionBlockProps {
  section: CaseStudySection;
  index: number;
  onOpenImage: (src: string, alt: string) => void;
}

function SectionBlock({ section, index, onOpenImage }: SectionBlockProps) {
  return (
    <div className="py-12 border-t border-[#e4e8f0] dark:border-[#1a1f2e]">
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
        {/* Section label */}
        <div className="mb-6 lg:mb-0 pt-[2px]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 text-[13px] font-medium text-[#222841] dark:text-[#c8cfe8] leading-snug">
            {section.title}
          </p>
        </div>

        {/* Section content */}
        <div className="flex flex-col gap-8">
          <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591] max-w-[680px]">
            {section.body}
          </p>

          {section.cardColumns && section.cardColumns.length > 0 && (
            <CardGrid columns={section.cardColumns} />
          )}

          {!section.cardColumns && section.imageLayout === "single" && (
            section.image ? (
              <ZoomableImage src={section.image} alt={section.imageMeta ?? section.title} onOpen={onOpenImage} />
            ) : (
              <PlaceholderImage label={section.imageMeta} aspect="wide" />
            )
          )}

          {!section.cardColumns && section.imageLayout === "double" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.image ? (
                <ZoomableImage src={section.image} alt={section.imageMeta ?? section.title} onOpen={onOpenImage} />
              ) : (
                <PlaceholderImage label={section.imageMeta} aspect="wide" />
              )}
              {section.image2 ? (
                <ZoomableImage src={section.image2} alt={section.imageMeta ?? section.title} onOpen={onOpenImage} />
              ) : (
                <PlaceholderImage label={section.imageMeta} aspect="wide" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared label + body row ──────────────────────────────────────────────────

function ContentRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="py-12 border-t border-[#e4e8f0] dark:border-[#1a1f2e]">
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
        <div className="mb-6 lg:mb-0 pt-[2px]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
            {label}
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

function MyRole({ role }: { role: NonNullable<Project["myRole"]> }) {
  return (
    <ContentRow label="My Role">
      <div className="flex flex-col gap-6 max-w-[680px]">
        <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591]">
          {role.summary}
        </p>
        <ul className="flex flex-col border-t border-[#e4e8f0] dark:border-[#1a1f2e]">
          {role.points.map((point) => (
            <li
              key={point}
              className="flex gap-4 py-3 border-b border-[#e4e8f0] dark:border-[#1a1f2e] text-[15px] leading-[1.6] text-[#222841] dark:text-[#c8cfe8]"
            >
              <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a223]" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </ContentRow>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openImage = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);
  const closeImage = useCallback(() => setLightbox(null), []);

  if (!slug) return <Navigate to="/" replace />;
  const project = getProjectBySlug(slug);
  if (!project) return <Navigate to="/" replace />;

  const nextProject = getNextProject(project.slug);
  const isCaseStudy = Boolean(project.challenge || project.sections?.length);

  return (
    <div className="min-h-screen bg-[#f9fbff] dark:bg-[#0d1017]">
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeImage} />}
      <div className="max-w-[1280px] mx-auto px-10 md:px-16 pb-24">
        <Navbar />

        <main className="pt-12">
          {/* Back nav */}
          <Link
            to="/#work"
            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560] hover:text-[#222841] dark:hover:text-[#c8cfe8] transition-colors"
          >
            ← Back to Work
          </Link>

          {/* Hero */}
          <section className="pt-8 pb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
              {project.category}
            </p>
            <h1 className="mt-3 text-[40px] md:text-[56px] leading-[1.02] tracking-[-0.03em] text-[#222841] dark:text-[#c8cfe8] font-medium">
              {project.name}
            </h1>
            <p className="mt-4 text-[18px] md:text-[20px] leading-[1.4] text-[#3a3f55] dark:text-[#6b7591] max-w-[640px] font-normal">
              {project.tagline}
            </p>

            {/* Meta strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { label: "Role", value: project.role },
                { label: "Year", value: project.year },
                ...(project.platform ? [{ label: "Platform", value: project.platform }] : []),
                ...(project.duration ? [{ label: "Duration", value: project.duration }] : []),
              ].map((meta, i) => (
                <div key={meta.label} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-8 bg-[#e4e8f0] dark:bg-[#1a1f2e] hidden sm:block" />}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#adb5c8] dark:text-[#2e3650]">
                      {meta.label}
                    </span>
                    <span className="text-[13px] text-[#222841] dark:text-[#9ba3be]">{meta.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cover image */}
          <section className="pb-12">
            <div className="w-full bg-white dark:bg-[#131827] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] dark:shadow-[0px_4px_64px_0px_rgba(0,0,0,0.5)] overflow-hidden">
              {project.coverComparison ? (
                <BeforeAfterSlider
                  before={project.coverComparison.before}
                  after={project.coverComparison.after}
                  beforeAlt={project.coverComparison.beforeAlt}
                  afterAlt={project.coverComparison.afterAlt}
                />
              ) : (
                <img src={project.coverImage} alt={project.coverImageAlt} className="w-full h-auto object-cover" />
              )}
            </div>
            {project.coverComparison?.caption && (
              <p className="mt-4 text-[14px] leading-[1.7] text-[#3a3f55] dark:text-[#6b7591]">
                {project.coverComparison.caption}
              </p>
            )}
          </section>

          {/* ── Case study content ─────────────────────────────────── */}
          {isCaseStudy ? (
            <>
              <ContentRow label="Overview">
                <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591] max-w-[680px]">
                  {project.overview}
                </p>
              </ContentRow>

              {project.myRole && <MyRole role={project.myRole} />}

              {project.challenge && (
                <ContentRow label="The Challenge">
                  <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591] max-w-[680px]">
                    {project.challenge}
                  </p>
                </ContentRow>
              )}

              {project.approach && (
                <ContentRow label="My Approach">
                  <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591] max-w-[680px]">
                    {project.approach}
                  </p>
                </ContentRow>
              )}

              {project.sections && project.sections.length > 0 && (
                <div>
                  <div className="border-t border-[#e4e8f0] dark:border-[#1a1f2e] pt-12 pb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
                      Process
                    </span>
                  </div>
                  {project.sections.map((section, i) => (
                    <SectionBlock key={section.title} section={section} index={i} onOpenImage={openImage} />
                  ))}
                </div>
              )}

              {project.outcome && (
                <ContentRow label="Outcome">
                  <div className="flex flex-col gap-8 max-w-[680px]">
                    <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591]">
                      {project.outcome}
                    </p>
                    {project.outcomeStats && project.outcomeStats.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#e4e8f0] dark:bg-[#1a1f2e] border border-[#e4e8f0] dark:border-[#1a1f2e]">
                        {project.outcomeStats.map((stat) => (
                          <div key={stat.label} className="bg-[#f9fbff] dark:bg-[#0d1017] px-6 py-5 flex flex-col gap-1">
                            <span className="text-[26px] font-medium tracking-[-0.02em] text-[#222841] dark:text-[#c8cfe8] leading-none">
                              {stat.value}
                            </span>
                            <span className="text-[11px] text-[#737373] dark:text-[#3d4560] uppercase tracking-[0.12em]">
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ContentRow>
              )}
            </>
          ) : (
            <>
              {/* The overview is skipped when the cover caption already introduces the project */}
              {!project.coverComparison?.caption && (
                <>
                  <div className="border-t border-[#e4e8f0] dark:border-[#1a1f2e]" />
                  <section className="py-12 max-w-[860px]">
                    <p className="text-[16px] leading-[1.75] text-[#222841] dark:text-[#9ba3be]">
                      {project.overview}
                    </p>
                  </section>
                </>
              )}
              {project.myRole && <MyRole role={project.myRole} />}
              {project.images.length > 0 && (
                <section className="pb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {project.images.map((imagePath) => (
                      <div key={imagePath} className="bg-white dark:bg-[#131827] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] overflow-hidden">
                        <img src={imagePath} alt={`${project.name} project detail`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {project.gallery && (
            <ContentRow label={project.gallery.label}>
              <div className="flex flex-col gap-8 min-w-0">
                <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591] max-w-[680px]">
                  {project.gallery.description}
                </p>
                <ImageCarousel items={project.gallery.items} onOpenImage={openImage} />
              </div>
            </ContentRow>
          )}

          {/* Footer: tags + next project */}
          <div className="border-t border-[#e4e8f0] dark:border-[#1a1f2e]" />
          <section className="py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[11px] text-[#737373] dark:text-[#3d4560] uppercase tracking-[0.14em] px-3 py-2 border border-[#e4e8f0] dark:border-[#1a1f2e]">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to={`/work/${nextProject.slug}`}
              className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#222841] dark:text-[#c8cfe8] hover:text-[#00a223] dark:hover:text-[#00a223] transition-colors shrink-0"
            >
              Next: {nextProject.name} →
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
