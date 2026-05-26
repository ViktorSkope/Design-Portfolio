import { Link } from "react-router-dom";
import { getProjectsByCategory } from "../data/projects";

export default function FeaturedCards() {
  const featuredProjects = getProjectsByCategory("Featured Work");

  return (
    <section className="pb-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-10">
        {featuredProjects.map((project) => (
          <Link
            key={project.slug}
            to={`/work/${project.slug}`}
            className="flex flex-col gap-4 group cursor-pointer"
          >
            {/* Image card */}
            <div className="w-full aspect-[4/3] bg-white shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.coverImageAlt}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[#737373] text-[10px] font-semibold uppercase tracking-[0.16em]">
                Featured Work
              </span>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[#222841] text-[14px] font-medium leading-snug group-hover:text-[#00a223] transition-colors duration-200">
                  {project.name}
                </p>
                <p className="text-[#737373] text-[13px] font-normal shrink-0">
                  {project.year}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
