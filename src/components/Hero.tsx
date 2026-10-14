export default function Hero() {
  return (
    <section id="about">
      <div className="relative inline-block max-w-[880px]">
        <p className="text-ink text-[28px] md:text-[36px] lg:text-[40px] font-medium leading-[1.18] tracking-[-0.5px] text-balance">
          <span className="text-alt-2">Creative</span> product designer with 10+ yoe driving design strategy for{" "}
          <span className="text-alt-1">games</span>, <span className="text-tertiary">startups</span> and{" "}
          <span className="text-quaternary">b2b saas</span>.
        </p>

        {/* Floating avatar */}
        <div className="absolute -top-16 left-0 animate-[float_4s_ease-in-out_infinite]">
          <img
            src="/avatar.png"
            alt="Viktor Dopke"
            className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white"
          />
        </div>
      </div>
    </section>
  );
}
