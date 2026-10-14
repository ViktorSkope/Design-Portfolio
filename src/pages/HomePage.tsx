import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProject from "../components/FeaturedProject";

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24 md:pb-28 bg-page">
      <div className="max-w-[1280px] mx-auto px-10 md:px-16">
        <Navbar />

        <main>
          <div className="flex flex-col gap-16 lg:gap-20 pt-[72px] pb-[86px]">
            <Hero />
          </div>

          {/* Newest first */}
          <FeaturedProject
            items={[
              { slug: "athos-commerce", title: "Athos Commerce redesign" },
              { slug: "rho-studio" },
              { slug: "watchson" },
              { slug: "liliworld" },
              { slug: "ingrid" },
              { slug: "pewee-diary" },
              { slug: "whirl" },
              { slug: "plywood" },
            ]}
          />
        </main>
      </div>
    </div>
  );
}
