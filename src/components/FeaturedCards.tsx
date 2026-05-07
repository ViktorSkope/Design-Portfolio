interface Project {
  title: string;
  year: string;
  image: string;
  alt: string;
}

const projects: Project[] = [
  {
    title: "Whirl — Where to go next",
    year: "2022",
    image: "/img-whirl.png",
    alt: "Whirl mobile app screens on yellow background",
  },
  {
    title: "Ingrid — Automated Surveillance",
    year: "2022",
    image: "/img-ingrid.png",
    alt: "Ingrid dashboard on a MacBook floating on dark background",
  },
  {
    title: "Watchson — Resourcing Tool",
    year: "2022",
    image: "/img-watchson.png",
    alt: "Blindspot app branding on purple background",
  },
];

export default function FeaturedCards() {
  return (
    <section className="px-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col gap-2 group cursor-pointer"
          >
            <div className="w-full aspect-[4/3] bg-white shadow-[0px_4px_80px_0px_rgba(0,0,0,0.08)] overflow-hidden">
              <img
                src={project.image}
                alt={project.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col gap-1 font-medium">
              <span className="text-[#737373] text-[11px] uppercase tracking-widest">
                Featured Work
              </span>
              <div className="flex items-center justify-between">
                <p className="text-[#222841] text-[15px] group-hover:text-[#00a223] transition-colors">
                  {project.title}
                </p>
                <p className="text-[#222841] text-[15px] shrink-0">
                  {project.year}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
