import ContactButton from "./ContactButton";

export default function Hero() {
  return (
    <section id="about">
      <div className="relative mx-auto block max-w-[1152px] text-center">
        <p className="text-ink text-[28px] md:text-[36px] lg:text-[42px] font-medium leading-[1.18] tracking-[-0.5px] text-balance">
          <span className="text-alt-2">Creative</span> product designer with 10+ yoe driving design strategy for{" "}
          <span className="text-alt-1">games</span>, <span className="text-tertiary">startups</span> and{" "}
          <span className="text-quaternary">b2b saas</span>.
        </p>

        {/* Avatar sits to the left of the Contact me button */}
        <div id="hero-contact" className="mt-[29px] flex items-center justify-center gap-4">
          <img
            src="/avatar.png"
            alt="Viktor Dopke"
            className="w-12 h-12 shrink-0 rounded-full object-cover shadow-md ring-2 ring-white animate-[float_4s_ease-in-out_infinite]"
          />
          <ContactButton variant="inline" />
        </div>
      </div>
    </section>
  );
}
