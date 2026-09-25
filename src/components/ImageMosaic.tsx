export interface MosaicItem {
  src: string;
  alt: string;
  title: string;
}

interface ImageMosaicProps {
  items: MosaicItem[];
  onOpenImage?: (src: string, alt: string) => void;
}

// Even two-up grid that spans the full content width. Tiles share one aspect
// ratio so rows line up and the grid stays stable before images load.
export default function ImageMosaic({ items, onOpenImage }: ImageMosaicProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {items.map((item) => (
        <button
          key={item.src}
          type="button"
          onClick={() => onOpenImage?.(item.src, item.alt)}
          aria-label={`Enlarge image: ${item.title}`}
          className="group relative block aspect-[16/10] overflow-hidden bg-white dark:bg-[#131827] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.06)] cursor-zoom-in"
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-[#222841]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
            {item.title}
          </span>
        </button>
      ))}
    </div>
  );
}
