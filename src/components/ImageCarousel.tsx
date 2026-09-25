import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselItem {
  src: string;
  alt: string;
  caption: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  onOpenImage?: (src: string, alt: string) => void;
}

export default function ImageCarousel({ items, onOpenImage }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track the slide closest to the left edge as the user scrolls or swipes
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let minDistance = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    });
    setActive(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    setActive(index);
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const buttonClass =
    "flex h-9 w-9 items-center justify-center border border-[#e4e8f0] dark:border-[#1a1f2e] text-[#222841] dark:text-[#c8cfe8] transition-colors hover:border-[#222841] dark:hover:border-[#c8cfe8] disabled:opacity-30 disabled:hover:border-[#e4e8f0] dark:disabled:hover:border-[#1a1f2e] disabled:cursor-default";

  return (
    <div className="flex flex-col gap-5" aria-roledescription="carousel">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <figure
            key={item.src}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="snap-start shrink-0 w-[85%] md:w-[70%] flex flex-col gap-3"
          >
            <button
              type="button"
              onClick={() => onOpenImage?.(item.src, item.alt)}
              className="group block w-full aspect-[16/10] overflow-hidden bg-white dark:bg-[#131827] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.06)] cursor-zoom-in"
              aria-label={`Enlarge image: ${item.alt}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </button>
            <figcaption className="text-[13px] leading-[1.6] text-[#737373] dark:text-[#4d5570] max-w-[560px]">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] tabular-nums tracking-[0.12em] text-[#737373] dark:text-[#3d4560]">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          <button type="button" className={buttonClass} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous image">
            ←
          </button>
          <button type="button" className={buttonClass} onClick={() => goTo(active + 1)} disabled={active === items.length - 1} aria-label="Next image">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
