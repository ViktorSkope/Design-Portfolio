import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProject from "../components/FeaturedProject";

export default function HomePage() {
  return (
    <div id="home-page" className="min-h-screen pb-24 md:pb-28 bg-page">
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

          {/* A joke at the very end of the page, styled like the hint above the projects */}
          <p className="mx-auto flex max-w-[560px] flex-col items-center gap-3 pt-24 text-center text-[#737373] text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.16em]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 10.5L12 4l9 6.5V20H3v-9.5zM7 20v-6h10v6M7 16h10M7 18h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              Nothing to see down here. I’m saving some “real estate” for a garage in the future
            </span>
          </p>
        </main>
      </div>
    </div>
  );
}
