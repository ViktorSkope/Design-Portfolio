export default function Hero() {
  return (
    <section id="about">
      <div className="relative inline-block max-w-[880px]">
        <p className="text-[#222841] dark:text-[#c8cfe8] text-[28px] md:text-[36px] lg:text-[40px] font-medium leading-[1.18] tracking-[-0.5px] text-balance">
          Creative Product Designer and Project Lead with 10+ years of
          experience driving design strategy across small businesses,{" "}
          <span className="whitespace-nowrap">VC-backed</span> startups, and
          private equity B2B SaaS platforms.
        </p>

        {/* Floating avatar */}
        <div className="absolute -top-16 left-0 animate-[float_4s_ease-in-out_infinite]">
          <img
            src="/avatar.png"
            alt="Viktor Dopke"
            className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white dark:ring-[#0d1017]"
          />
        </div>
      </div>
    </section>
  );
}
