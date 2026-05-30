import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getNextProject, getProjectBySlug, type CaseStudySection, type CardColumn } from "../data/projects";

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
    <div
      className={`w-full ${aspectClass} bg-[#f0f2f7] border border-dashed border-[#cdd3e0] flex flex-col items-center justify-center gap-2`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#adb5c8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && (
        <span className="text-[10px] text-[#adb5c8] uppercase tracking-[0.12em] text-center px-4 leading-relaxed">
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Impact / Challenge card grid ────────────────────────────────────────────

function CardGrid({ columns }: { columns: CardColumn[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {columns.map((col) => (
        <div key={col.label} className="flex flex-col gap-3">
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
              col.variant === "positive" ? "text-[#2d7a3a]" : "text-[#a63030]"
            }`}
          >
            {col.label}
          </span>
          <div className="flex flex-col gap-2">
            {col.items.map((item) => (
              <div
                key={item}
                className={`px-4 py-3 text-[13px] leading-[1.6] ${
                  col.variant === "positive"
                    ? "bg-[#edf7ef] text-[#1e4d27] border border-[#c3e6cb]"
                    : "bg-[#fdf0f0] text-[#5a1f1f] border border-[#f5c6c6]"
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
}

function SectionBlock({ section, index }: SectionBlockProps) {
  return (
    <div className="py-12 border-t border-[#e4e8f0]">
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
        {/* Section label */}
        <div className="mb-6 lg:mb-0 pt-[2px]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 text-[13px] font-medium text-[#222841] leading-snug">
            {section.title}
          </p>
        </div>

        {/* Section content */}
        <div className="flex flex-col gap-8">
          <p className="text-[15px] leading-[1.8] text-[#3a3f55] max-w-[680px]">
            {section.body}
          </p>

          {section.cardColumns && section.cardColumns.length > 0 && (
            <CardGrid columns={section.cardColumns} />
          )}

          {!section.cardColumns && section.imageLayout === "single" && (
            section.image ? (
              <img
                src={section.image}
                alt={section.imageMeta ?? section.title}
                className="w-full h-auto object-cover"
              />
            ) : (
              <PlaceholderImage label={section.imageMeta} aspect="wide" />
            )
          )}

          {!section.cardColumns && section.imageLayout === "double" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.image ? (
                <img
                  src={section.image}
                  alt={section.imageMeta ?? section.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <PlaceholderImage label={section.imageMeta} aspect="wide" />
              )}
              <PlaceholderImage label={section.imageMeta} aspect="wide" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const project = getProjectBySlug(slug);
  if (!project) {
    return <Navigate to="/" replace />;
  }

  const nextProject = getNextProject(project.slug);
  const isCaseStudy = Boolean(project.challenge || project.sections?.length);

  return (
    <div className="min-h-screen bg-[#f9fbff]">
      <div className="max-w-[1280px] mx-auto px-10 md:px-16 pb-24">
        <Navbar />

        <main className="pt-12">
          {/* Back nav */}
          <Link
            to="/#work"
            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] hover:text-[#222841] transition-colors"
          >
            ← Back to Work
          </Link>

          {/* Hero */}
          <section className="pt-8 pb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
              {project.category}
            </p>
            <h1 className="mt-3 text-[40px] md:text-[56px] leading-[1.02] tracking-[-0.03em] text-[#222841] font-medium">
              {project.name}
            </h1>
            <p className="mt-4 text-[18px] md:text-[20px] leading-[1.4] text-[#3a3f55] max-w-[640px] font-normal">
              {project.tagline}
            </p>

            {/* Meta strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#adb5c8]">
                  Role
                </span>
                <span className="text-[13px] text-[#222841]">{project.role}</span>
              </div>
              <div className="w-px h-8 bg-[#e4e8f0] hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#adb5c8]">
                  Year
                </span>
                <span className="text-[13px] text-[#222841]">{project.year}</span>
              </div>
              {project.platform && (
                <>
                  <div className="w-px h-8 bg-[#e4e8f0] hidden sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#adb5c8]">
                      Platform
                    </span>
                    <span className="text-[13px] text-[#222841]">{project.platform}</span>
                  </div>
                </>
              )}
              {project.duration && (
                <>
                  <div className="w-px h-8 bg-[#e4e8f0] hidden sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#adb5c8]">
                      Duration
                    </span>
                    <span className="text-[13px] text-[#222841]">{project.duration}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Cover image */}
          <section className="pb-12">
            <div className="w-full bg-white shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.coverImageAlt}
                className="w-full h-auto object-cover"
              />
            </div>
          </section>

          {/* ── Case study content ─────────────────────────────────── */}
          {isCaseStudy ? (
            <>
              {/* Overview */}
              <section className="py-12 border-t border-[#e4e8f0]">
                <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
                  <div className="mb-6 lg:mb-0 pt-[2px]">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                      Overview
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.8] text-[#3a3f55] max-w-[680px]">
                    {project.overview}
                  </p>
                </div>
              </section>

              {/* Challenge */}
              {project.challenge && (
                <section className="py-12 border-t border-[#e4e8f0]">
                  <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
                    <div className="mb-6 lg:mb-0 pt-[2px]">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                        The Challenge
                      </span>
                    </div>
                    <p className="text-[15px] leading-[1.8] text-[#3a3f55] max-w-[680px]">
                      {project.challenge}
                    </p>
                  </div>
                </section>
              )}

              {/* Approach */}
              {project.approach && (
                <section className="py-12 border-t border-[#e4e8f0]">
                  <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
                    <div className="mb-6 lg:mb-0 pt-[2px]">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                        My Approach
                      </span>
                    </div>
                    <p className="text-[15px] leading-[1.8] text-[#3a3f55] max-w-[680px]">
                      {project.approach}
                    </p>
                  </div>
                </section>
              )}

              {/* Process sections */}
              {project.sections && project.sections.length > 0 && (
                <div>
                  <div className="border-t border-[#e4e8f0] pt-12 pb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                      Process
                    </span>
                  </div>
                  {project.sections.map((section, i) => (
                    <SectionBlock key={section.title} section={section} index={i} />
                  ))}
                </div>
              )}

              {/* Outcome */}
              {project.outcome && (
                <section className="py-12 border-t border-[#e4e8f0]">
                  <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
                    <div className="mb-6 lg:mb-0 pt-[2px]">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                        Outcome
                      </span>
                    </div>
                    <div className="flex flex-col gap-8 max-w-[680px]">
                      <p className="text-[15px] leading-[1.8] text-[#3a3f55]">
                        {project.outcome}
                      </p>

                      {project.outcomeStats && project.outcomeStats.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#e4e8f0] border border-[#e4e8f0]">
                          {project.outcomeStats.map((stat) => (
                            <div
                              key={stat.label}
                              className="bg-[#f9fbff] px-6 py-5 flex flex-col gap-1"
                            >
                              <span className="text-[26px] font-medium tracking-[-0.02em] text-[#222841] leading-none">
                                {stat.value}
                              </span>
                              <span className="text-[11px] text-[#737373] uppercase tracking-[0.12em]">
                                {stat.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </>
          ) : (
            /* ── Simple layout for non-case-study projects ─────────── */
            <>
              <div className="border-t border-[#e4e8f0]" />
              <section className="py-12 max-w-[860px]">
                <p className="text-[16px] leading-[1.75] text-[#222841]">
                  {project.overview}
                </p>
              </section>

              {project.images.length > 0 && (
                <section className="pb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {project.images.map((imagePath) => (
                      <div
                        key={imagePath}
                        className="bg-white shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] overflow-hidden"
                      >
                        <img
                          src={imagePath}
                          alt={`${project.name} project detail`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Footer: tags + next project */}
          <div className="border-t border-[#e4e8f0]" />
          <section className="py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-[#737373] uppercase tracking-[0.14em] px-3 py-2 border border-[#e4e8f0]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              to={`/work/${nextProject.slug}`}
              className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#222841] hover:text-[#00a223] transition-colors shrink-0"
            >
              Next: {nextProject.name} →
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
