import { Link } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";

interface FeaturedProjectProps {
  slug: string;
  title?: string;
}

export default function FeaturedProject({ slug, title }: FeaturedProjectProps) {
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return (
    <section className="pb-24">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[#737373] dark:text-[#3d4560] text-[10px] font-semibold uppercase tracking-[0.16em] shrink-0">
          Featured Project
        </h2>
        <div className="flex-1 h-px bg-[#e4e8f0] dark:bg-[#1a1f2e]" />
      </div>

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
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </section>
  );
}
