export default function Navbar() {
  return (
    <header className="w-full px-8 pt-8 pb-0 flex items-start justify-between">
      {/* Left: name + title stacked vertically */}
      <div className="flex flex-col gap-1">
        <span className="text-[#222841] text-xs font-semibold uppercase tracking-widest">
          Viktor Dopke
        </span>
        <span className="text-[#737373] text-xs font-semibold uppercase tracking-widest">
          Product Designer
        </span>
      </div>

      {/* Right: navigation links */}
      <nav className="flex items-center gap-8">
        <a
          href="#work"
          className="text-[#00a223] text-xs font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          Work
        </a>
        <a
          href="#about"
          className="text-[#737373] text-xs font-semibold uppercase tracking-widest hover:text-[#222841] transition-colors"
        >
          About
        </a>
        <a
          href="#resume"
          className="text-[#737373] text-xs font-semibold uppercase tracking-widest hover:text-[#222841] transition-colors"
        >
          Resume
        </a>
      </nav>
    </header>
  );
}
