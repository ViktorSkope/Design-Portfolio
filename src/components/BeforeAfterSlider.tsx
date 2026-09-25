import { useCallback, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  initial?: number;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  initial = 50,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const draggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture is best-effort; dragging still works without it.
    }
    draggingRef.current = true;
    setDragging(true);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromPointer(e.clientX);
  };

  const stopDragging = () => {
    draggingRef.current = false;
    setDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const keys: Record<string, number> = {
      ArrowLeft: position - step,
      ArrowDown: position - step,
      ArrowRight: position + step,
      ArrowUp: position + step,
      Home: 0,
      End: 100,
    };
    if (e.key in keys) {
      e.preventDefault();
      setPosition(clamp(keys[e.key]));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none touch-pan-y overflow-hidden ${
        dragging ? "cursor-grabbing" : "cursor-ew-resize"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      {/* After (base layer, sets the height) */}
      <img
        src={after}
        alt={afterAlt}
        draggable={false}
        className="block w-full h-auto"
      />

      {/* Before (clipped to the left of the divider) */}
      <img
        src={before}
        alt={beforeAlt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Labels */}
      <span
        className="pointer-events-none absolute top-4 left-4 rounded-full bg-[#222841]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: position > 12 ? 1 : 0 }}
      >
        Before
      </span>
      <span
        className="pointer-events-none absolute top-4 right-4 rounded-full bg-[#00a223]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: position < 88 ? 1 : 0 }}
      >
        After
      </span>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Drag to compare the before and after designs"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% before design shown`}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#222841] shadow-[0_4px_16px_rgba(0,0,0,0.25)] outline-none transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#00a223] focus-visible:ring-offset-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
