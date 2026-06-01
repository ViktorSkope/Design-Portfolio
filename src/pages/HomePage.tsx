import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WorkList from "../components/WorkList";
import FeaturedCards from "../components/FeaturedCards";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f9fbff] dark:bg-[#0d1017]">
      <div className="max-w-[1280px] mx-auto px-10 md:px-16">
        <Navbar />

        <main>
          <div className="flex flex-col lg:grid lg:grid-cols-[46%_54%] lg:gap-20 pt-20 pb-24">
            <Hero />
            <WorkList />
          </div>

          <div className="border-t border-[#e4e8f0] dark:border-[#1a1f2e] mb-16" />
          <FeaturedCards />
        </main>
      </div>
    </div>
  );
}
