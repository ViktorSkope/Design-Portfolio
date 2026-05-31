import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isAbout = pathname === "/about";

  const activeClass = "text-[#00a223] text-[11px] font-semibold uppercase tracking-[0.14em] hover:opacity-60 transition-opacity duration-200";
  const inactiveClass = "text-[#737373] text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-[#222841] transition-colors duration-200";

  return (
    <header className="flex items-center justify-between py-10">
      {/* Left: name + title */}
      <div className="flex flex-col gap-[5px]">
        <span className="text-[#222841] text-[11px] font-semibold uppercase tracking-[0.14em]">
          Viktor Dopke
        </span>
        <span className="text-[#737373] text-[11px] font-semibold uppercase tracking-[0.14em]">
          Product Designer
        </span>
      </div>

      {/* Right: nav */}
      <nav className="flex items-center gap-10">
        <Link
          to="/#work"
          className={isAbout ? inactiveClass : activeClass}
        >
          Work
        </Link>
        <Link
          to="/about"
          className={isAbout ? activeClass : inactiveClass}
        >
          About
        </Link>
        <a
          href="/Viktor-Dopke-Resume.pdf"
          download="Viktor-Dopke-Resume.pdf"
          className="flex items-center gap-[6px] text-[#737373] text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-[#222841] transition-colors duration-200"
        >
          Resume
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4v12m0 0-4-4m4 4 4-4" />
            <path d="M4 20h16" />
          </svg>
        </a>
      </nav>
    </header>
  );
}
