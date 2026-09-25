import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WorkList from "../components/WorkList";
import FeaturedProject from "../components/FeaturedProject";
import FeaturedCards from "../components/FeaturedCards";

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24 md:pb-28 bg-[#f9fbff] dark:bg-[#0d1017]">
      <div className="max-w-[1280px] mx-auto px-10 md:px-16">
        <Navbar />

        <main>
          <div className="flex flex-col gap-16 lg:gap-20 pt-20 pb-24">
            <Hero />
            <WorkList />
          </div>

          <FeaturedProject slug="athos-commerce" title="Athos Commerce redesign" />
          <FeaturedCards />
        </main>
      </div>
    </div>
  );
}
