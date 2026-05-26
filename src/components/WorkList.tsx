import { Link } from "react-router-dom";
import { getProjectsByCategory, projectCategories } from "../data/projects";

export default function WorkList() {
  return (
    <section id="work" className="flex flex-col gap-12">
      {projectCategories.map((category, categoryIdx) => {
        const items = getProjectsByCategory(category);

        return (
          <div key={category}>
          {/* Section header */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[#737373] text-[10px] font-semibold uppercase tracking-[0.16em] shrink-0">
              {category}
            </span>
            <div className="flex-1 h-px bg-[#e4e8f0]" />
          </div>

          {/* Work items */}
          <div className="flex flex-col">
            {items.map((item, itemIdx) => (
              <div key={item.slug}>
                <Link
                  to={`/work/${item.slug}`}
                  className="grid grid-cols-[1fr_1.4fr] gap-6 py-4 group cursor-pointer"
                >
                  <p className="text-[#222841] text-[14px] font-medium leading-snug group-hover:text-[#00a223] transition-colors duration-200">
                    {item.name}
                  </p>
                  <p className="text-[#737373] text-[13px] font-normal leading-snug">
                    {item.tagline}
                  </p>
                </Link>
                {/* Row divider — skip after the last item in each section */}
                {itemIdx < items.length - 1 && (
                  <div className="h-px bg-[#eef0f5]" />
                )}
              </div>
            ))}
          </div>

          {/* Add bottom border after the last section for closure */}
          {categoryIdx === projectCategories.length - 1 && (
            <div className="h-px bg-[#e4e8f0] mt-0" />
          )}
          </div>
        );
      })}
    </section>
  );
}
