import { useState } from "react";
import { Link, useLocation } from "react-router-dom";



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
  const [menuOpen, setMenuOpen] = useState(false);
  const isAbout = pathname === "/about";

  const activeClass =
    "text-accent text-[11px] font-semibold uppercase tracking-[0.14em] hover:opacity-60 transition-opacity duration-200";
  const inactiveClass =
    "text-[#737373] text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-ink transition-colors duration-200";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative py-8 md:py-10">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Left: name + title */}
        <div className="flex flex-col gap-[5px]">
          <span className="text-ink text-[11px] font-semibold uppercase tracking-[0.14em]">
            Viktor Dopke
          </span>
          <span className="text-[#737373] text-[11px] font-semibold uppercase tracking-[0.14em]">
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
        </nav>

        {/* Mobile: hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-8 h-8 text-[#737373] hover:text-ink transition-colors duration-200"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {menuOpen && (
        <nav className="md:hidden absolute left-0 right-0 top-full z-40 bg-page border-t border-[#E6E0D8] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
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
