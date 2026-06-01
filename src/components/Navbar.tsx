import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const isAbout = pathname === "/about";

  const activeClass = "text-[#00a223] text-[11px] font-semibold uppercase tracking-[0.14em] hover:opacity-60 transition-opacity duration-200";
  const inactiveClass = "text-[#737373] dark:text-[#5a6080] text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-[#222841] dark:hover:text-[#c8cfe8] transition-colors duration-200";

  return (
    <header className="flex items-center justify-between py-10">
      {/* Left: name + title */}
      <div className="flex flex-col gap-[5px]">
        <span className="text-[#222841] dark:text-[#c8cfe8] text-[11px] font-semibold uppercase tracking-[0.14em]">
          Viktor Dopke
        </span>
        <span className="text-[#737373] dark:text-[#5a6080] text-[11px] font-semibold uppercase tracking-[0.14em]">
          Product Designer
        </span>
      </div>

      {/* Right: nav */}
      <nav className="flex items-center gap-8">
        <Link to="/#work" className={isAbout ? inactiveClass : activeClass}>
          Work
        </Link>
        <Link to="/about" className={isAbout ? activeClass : inactiveClass}>
          About
        </Link>
        <a
          href="/Viktor-Dopke-Resume.pdf"
          download="Viktor-Dopke-Resume.pdf"
          className={`flex items-center gap-[6px] ${inactiveClass}`}
        >
          Resume
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v12m0 0-4-4m4 4 4-4" />
            <path d="M4 20h16" />
          </svg>
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle colour scheme"
          className="flex items-center justify-center w-7 h-7 text-[#737373] dark:text-[#5a6080] hover:text-[#222841] dark:hover:text-[#c8cfe8] border border-[#e4e8f0] dark:border-[#1e2535] hover:border-[#222841] dark:hover:border-[#c8cfe8] transition-colors duration-200"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}
