import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getNextProject, getProjectBySlug } from "../data/projects";

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

  return (
    <div className="min-h-screen bg-[#f9fbff]">
      <div className="max-w-[1280px] mx-auto px-10 md:px-16 pb-24">
        <Navbar />

        <main className="pt-12">
          <Link
            to="/#work"
            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] hover:text-[#222841] transition-colors"
          >
            ← Back to Work
          </Link>

          <section className="pt-8 pb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
              {project.category}
            </p>
            <h1 className="mt-3 text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.03em] text-[#222841] font-medium">
              {project.name}
            </h1>
            <p className="mt-4 text-[14px] text-[#737373]">
              {project.role} · {project.year}
            </p>
          </section>

          <div className="border-t border-[#e4e8f0]" />

          <section className="py-12 max-w-[860px]">
            <p className="text-[16px] leading-[1.75] text-[#222841]">
              {project.overview}
            </p>
          </section>

          <section className="pb-12">
            <div className="w-full bg-white shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.coverImageAlt}
                className="w-full h-auto object-cover"
              />
            </div>
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
              className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#222841] hover:text-[#00a223] transition-colors"
            >
              Next project →
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
