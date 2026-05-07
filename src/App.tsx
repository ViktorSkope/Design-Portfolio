import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkList from "./components/WorkList";
import FeaturedCards from "./components/FeaturedCards";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f9fbff]">
      <Navbar />

      {/* Main content: two-column layout */}
      <main className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-0">
          {/* Left column: bio text */}
          <div className="lg:w-[55%] lg:pr-16">
            <Hero />
          </div>

          {/* Right column: work list */}
          <div className="lg:w-[45%] lg:pt-16">
            <WorkList />
          </div>
        </div>

        {/* Featured work cards — full width below */}
        <FeaturedCards />
      </main>
    </div>
  );
}
