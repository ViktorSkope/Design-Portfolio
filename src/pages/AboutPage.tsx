import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const socials = [
  {
    label: "Behance",
    href: "https://www.behance.net/vikdopke",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.5 11.25c1.24 0 2.25-1.01 2.25-2.25S8.74 6.75 7.5 6.75H3v4.5h4.5zm0 1.5H3V18h4.75c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.75-2.75-2.75zM1.5 5.25h6c2.07 0 3.75 1.68 3.75 3.75 0 1.05-.43 2-.11 2.66C12.32 12.5 13.5 14 13.5 15.5c0 2.35-1.9 4.25-4.25 4.25H1.5V5.25zM16.5 9c-2.76 0-5 2.24-5 5s2.24 5 5 5c1.83 0 3.43-.98 4.28-2.45l-1.5-.87C18.78 16.4 17.7 17 16.5 17c-1.55 0-2.84-1.05-3.24-2.48H22v-.52c0-2.76-2.24-5-5.5-5zm-3.2 3.75c.4-1.43 1.7-2.48 3.2-2.48s2.8 1.05 3.2 2.48h-6.4zM14.25 6h4.5v1.5h-4.5V6z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/viktor-dopke/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5H4.5V23H.5V8.5zm7.5 0H12v2h.05C12.67 9.38 14.25 8 16.5 8 21 8 22 10.92 22 14.74V23h-4v-7.5c0-1.79-.03-4.09-2.5-4.09-2.5 0-2.88 1.95-2.88 3.96V23H8V8.5z" />
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@vikdpk",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f9fbff] dark:bg-[#0d1017]">
      <div className="max-w-[1280px] mx-auto px-10 md:px-16 pb-24">
        <Navbar />

        <main className="pt-12">
          <Link
            to="/"
            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560] hover:text-[#222841] dark:hover:text-[#c8cfe8] transition-colors"
          >
            ← Back
          </Link>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16 lg:gap-24 items-start">

            {/* Photo */}
            <div className="w-full overflow-hidden">
              <img
                src="/about-photo.png"
                alt="Viktor Dopke"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-10 pt-2">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
                  About
                </span>
                <h1 className="text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.03em] text-[#222841] dark:text-[#c8cfe8] font-medium">
                  Viktor Dopke
                </h1>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#adb5c8] dark:text-[#2e3650]">
                  Product Designer · Curitiba, Brazil
                </p>
              </div>

              <div className="flex flex-col gap-4 max-w-[560px]">
                <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591]">
                  I design digital products with a focus on clarity, usefulness, and the kind of detail that makes things feel considered. My work spans B2B platforms, consumer apps, and internal tools, usually somewhere between the mess of discovery and the satisfaction of shipping something that works.
                </p>
                <p className="text-[15px] leading-[1.8] text-[#3a3f55] dark:text-[#6b7591]">
                  I care about understanding problems before solving them, working closely with engineers and product teams, and making sure the people actually using a product are never an afterthought. When I am not designing I am probably reading about things I have no practical use for, or spending too much time on a side project nobody asked for.
                </p>
              </div>

              {/* Socials */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
                  Find me on
                </span>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#e4e8f0] dark:border-[#1a1f2e] text-[12px] font-medium text-[#3a3f55] dark:text-[#6b7591] hover:border-[#222841] dark:hover:border-[#c8cfe8] hover:text-[#222841] dark:hover:text-[#c8cfe8] transition-colors"
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-3 pt-2 border-t border-[#e4e8f0] dark:border-[#1a1f2e]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
                  Get in touch
                </span>
                <a
                  href="mailto:vikdopke@gmail.com"
                  className="text-[15px] text-[#222841] dark:text-[#c8cfe8] font-medium hover:text-[#00a223] dark:hover:text-[#00a223] transition-colors"
                >
                  vikdopke@gmail.com
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
