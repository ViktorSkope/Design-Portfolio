import { useState, type CSSProperties } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface SliderStageProps {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}

const DAWN_COLOR = "#283E57";
const GLOW_GREY = "#D9D3CA";

// Hyperbolic ease: crawls at first, then rushes as progress nears 1.
// f(0) = 0 and f(1) = 1, with the curve bending harder as `a` approaches 1.
const A = 0.96;
const hyperbolic = (t: number) => (1 / (1 - A * t) - 1) / (1 / (1 - A) - 1);

// The padded backdrop behind a before/after slider. Sliding toward the new
// design brings in a dawn: the deep blue arrives on the redesign side while a
// light grey glow travels left to right with the handle. Sliding back returns
// to the warm stone.
export default function SliderStage({ before, after, beforeAlt, afterAlt }: SliderStageProps) {
  const [position, setPosition] = useState(50);

  // 0 = original design fully shown, 1 = redesign fully shown
  const progress = 1 - position / 100;
  const f = hyperbolic(progress);
  const glow = 0.8 * Math.sin(Math.PI * f);
  // The original side trails the redesign side, so the blue sweeps across
  const trailing = f * f;

  const style = {
    "--f": `${(f * 100).toFixed(2)}%`,
    "--g": `${(glow * 100).toFixed(2)}%`,
    "--t": `${(trailing * 100).toFixed(2)}%`,
    background: `linear-gradient(to right,
      color-mix(in srgb, ${DAWN_COLOR} var(--t), var(--from)) 0%,
      color-mix(in srgb, ${GLOW_GREY} var(--g), color-mix(in srgb, ${DAWN_COLOR} calc((var(--f) + var(--t)) / 2), var(--from))) ${position.toFixed(2)}%,
      color-mix(in srgb, ${DAWN_COLOR} var(--f), var(--from)) 100%)`,
  } as CSSProperties;

  return (
    <div
      className="relative px-[10%] py-12 md:py-16 rounded-lg [--from:#EFEBE5]"
      style={style}
    >
      {/* Labels sit in the padding, outside the slider image */}
      <span
        className="pointer-events-none absolute top-4 left-[10%] rounded-full bg-[#151515] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity duration-200"
        style={{ opacity: position > 12 ? 1 : 0 }}
      >
        Before
      </span>
      <span
        className="pointer-events-none absolute top-4 right-[10%] rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#151515] border border-[#E6E0D8] shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-opacity duration-200"
        style={{ opacity: position < 88 ? 1 : 0 }}
      >
        After
      </span>
      <div className="w-full bg-white shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] overflow-hidden">
        <BeforeAfterSlider
          before={before}
          after={after}
          beforeAlt={beforeAlt}
          afterAlt={afterAlt}
          onPositionChange={setPosition}
        />
      </div>
    </div>
  );
}
