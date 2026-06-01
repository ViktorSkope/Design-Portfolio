import { useState } from "react";
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAbout = pathname === "/about";

  const activeClass =
    "text-[#00a223] text-[11px] font-semibold uppercase tracking-[0.14em] hover:opacity-60 transition-opacity duration-200";
  const inactiveClass =
    "text-[#737373] dark:text-[#5a6080] text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-[#222841] dark:hover:text-[#c8cfe8] transition-colors duration-200";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative py-8 md:py-10">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Left: name + title */}
        <div className="flex flex-col gap-[5px]">
          <span className="text-[#222841] dark:text-[#c8cfe8] text-[11px] font-semibold uppercase tracking-[0.14em]">
            Viktor Dopke
          </span>
          <span className="text-[#737373] dark:text-[#5a6080] text-[11px] font-semibold uppercase tracking-[0.14em]">
            Product Designer
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
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
          <button
            onClick={toggle}
            aria-label="Toggle colour scheme"
            className="flex items-center justify-center w-7 h-7 text-[#737373] dark:text-[#5a6080] hover:text-[#222841] dark:hover:text-[#c8cfe8] border border-[#e4e8f0] dark:border-[#1e2535] hover:border-[#222841] dark:hover:border-[#c8cfe8] transition-colors duration-200"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle colour scheme"
            className="flex items-center justify-center w-8 h-8 text-[#737373] dark:text-[#5a6080] hover:text-[#222841] dark:hover:text-[#c8cfe8] border border-[#e4e8f0] dark:border-[#1e2535] hover:border-[#222841] dark:hover:border-[#c8cfe8] transition-colors duration-200"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-8 h-8 text-[#737373] dark:text-[#5a6080] hover:text-[#222841] dark:hover:text-[#c8cfe8] transition-colors duration-200"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {menuOpen && (
        <nav className="md:hidden absolute left-0 right-0 top-full z-40 bg-[#f9fbff] dark:bg-[#0d1017] border-t border-[#e4e8f0] dark:border-[#1a1f2e] shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col py-2">
            <Link
              to="/#work"
              onClick={closeMenu}
              className={`px-6 py-4 ${isAbout ? inactiveClass : activeClass}`}
            >
              Work
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className={`px-6 py-4 ${isAbout ? activeClass : inactiveClass}`}
            >
              About
            </Link>
            <a
              href="/Viktor-Dopke-Resume.pdf"
              download="Viktor-Dopke-Resume.pdf"
              onClick={closeMenu}
              className={`px-6 py-4 flex items-center gap-2 ${inactiveClass}`}
            >
              Resume
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v12m0 0-4-4m4 4 4-4" />
                <path d="M4 20h16" />
              </svg>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
