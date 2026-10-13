import { useState, type CSSProperties } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface SliderStageProps {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}

const DAWN_BLUE = "#2253C6";
const GLOW_GREY = "#d3d7e0";

// Hyperbolic ease: crawls at first, then rushes as progress nears 1.
// f(0) = 0 and f(1) = 1, with the curve bending harder as `a` approaches 1.
const A = 0.96;
const hyperbolic = (t: number) => (1 / (1 - A * t) - 1) / (1 / (1 - A) - 1);

// The padded backdrop behind a before/after slider. Sliding toward the new
// design brings in a dawn: the brand blue arrives on the redesign side while a
// light grey glow travels left to right with the handle. Sliding back returns
// to the soft blue-grey.
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
      color-mix(in srgb, ${DAWN_BLUE} var(--t), var(--from)) 0%,
      color-mix(in srgb, ${GLOW_GREY} var(--g), color-mix(in srgb, ${DAWN_BLUE} calc((var(--f) + var(--t)) / 2), var(--from))) ${position.toFixed(2)}%,
      color-mix(in srgb, ${DAWN_BLUE} var(--f), var(--from)) 100%)`,
  } as CSSProperties;

  return (
    <div
      className="px-[10%] py-10 md:py-14 rounded-lg [--from:#f0f3fa] dark:[--from:#0a0e1a]"
      style={style}
    >
      <div className="w-full bg-white dark:bg-[#131827] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.07)] dark:shadow-[0px_4px_64px_0px_rgba(0,0,0,0.5)] overflow-hidden">
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
