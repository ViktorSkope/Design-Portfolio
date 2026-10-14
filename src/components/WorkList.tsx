import { Link } from "react-router-dom";
import { getHighlightedProject, projectCategories } from "../data/projects";

export default function WorkList() {
  return (
    <section
      id="work"
      className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 items-start"
    >
      {projectCategories.map((category) => {
        const item = getHighlightedProject(category);
        if (!item) return null;

        return (
          <div key={category}>
            {/* Section header */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[#737373] text-[10px] font-semibold uppercase tracking-[0.16em] shrink-0">
                {category}
              </span>
              <div className="flex-1 h-px bg-[#E6E0D8]" />
            </div>

            {/* Work item */}
            <Link
              to={`/work/${item.slug}`}
              className="flex flex-col gap-1.5 py-4 group cursor-pointer"
            >
              <p className="text-ink text-[14px] font-medium leading-snug group-hover:text-accent transition-colors duration-200">
                {item.name}
              </p>
              <p className="text-[#737373] text-[13px] font-normal leading-snug">
                {item.tagline}
              </p>
            </Link>
          </div>
        );
      })}
    </section>
  );
}
