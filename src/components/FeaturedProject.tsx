import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProjectBySlug, type Project } from "../data/projects";

export interface FeaturedItem {
  slug: string;
  title?: string;
}

interface FeaturedProjectProps {
  items: FeaturedItem[];
}

function FeaturedSlide({ project, title }: { project: Project; title?: string }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-14 items-center group cursor-pointer"
    >
      {/* Image */}
      <div className="w-full aspect-[16/10] bg-white dark:bg-[#131722] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] dark:shadow-[0px_4px_64px_0px_rgba(0,0,0,0.4)] overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.coverImageAlt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <span className="text-[#737373] dark:text-[#3d4560] text-[10px] font-semibold uppercase tracking-[0.16em]">
          {project.category} · {project.year}
        </span>

        <h3 className="text-[#222841] dark:text-[#c8cfe8] text-[24px] md:text-[28px] font-medium leading-[1.2] tracking-[-0.4px] text-balance group-hover:text-[#00a223] transition-colors duration-200">
          {title ?? project.name}
        </h3>

        <p className="text-[#737373] dark:text-[#4d5570] text-[15px] leading-relaxed">
          {project.tagline}
        </p>

        <dl className="flex flex-col gap-1 text-[13px]">
          <div className="flex gap-2">
            <dt className="text-[#737373] dark:text-[#3d4560]">Role</dt>
            <dd className="text-[#222841] dark:text-[#c8cfe8]">{project.role}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="text-[11px] text-[#4d5570] dark:text-[#8a93b0] border border-[#e4e8f0] dark:border-[#1a1f2e] rounded-full px-3 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>

        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-[#222841] dark:text-[#c8cfe8] group-hover:text-[#00a223] transition-colors duration-200">
          View case study
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedProject({ items }: FeaturedProjectProps) {
  const slides = items
    .map((item) => ({ project: getProjectBySlug(item.slug), title: item.title }))
    .filter((slide): slide is { project: Project; title: string | undefined } => Boolean(slide.project));

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track the slide closest to the left edge as the user scrolls or swipes
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    setActive(index);
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  if (slides.length === 0) return null;
  const isCarousel = slides.length > 1;

  const buttonClass =
    "flex h-9 w-9 items-center justify-center border border-[#e4e8f0] dark:border-[#1a1f2e] text-[#222841] dark:text-[#c8cfe8] transition-colors hover:border-[#222841] dark:hover:border-[#c8cfe8] disabled:opacity-30 disabled:hover:border-[#e4e8f0] dark:disabled:hover:border-[#1a1f2e] disabled:cursor-default";

  return (
    <section className="pb-24" aria-roledescription={isCarousel ? "carousel" : undefined} aria-label="Featured projects">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[#737373] dark:text-[#3d4560] text-[10px] font-semibold uppercase tracking-[0.16em] shrink-0">
          {isCarousel ? "Featured Projects" : "Featured Project"}
        </h2>
        <div className="flex-1 h-px bg-[#e4e8f0] dark:bg-[#1a1f2e]" />
        {isCarousel && (
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[11px] tabular-nums tracking-[0.12em] text-[#737373] dark:text-[#3d4560]">
              {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <button type="button" className={buttonClass} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous featured project">
                ←
              </button>
              <button type="button" className={buttonClass} onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label="Next featured project">
                →
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map(({ project, title }, i) => (
          <div
            key={project.slug}
            className="w-full shrink-0 snap-start"
            aria-roledescription={isCarousel ? "slide" : undefined}
            aria-label={isCarousel ? `${i + 1} of ${slides.length}` : undefined}
          >
            <FeaturedSlide project={project} title={title} />
          </div>
        ))}
      </div>
    </section>
  );
}
