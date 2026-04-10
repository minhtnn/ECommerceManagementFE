import { Banner1, Banner2 } from "@/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const banners = [
  { id: 1, image: Banner1 },
  { id: 2, image: Banner2 },
  // { id: 3, image: Banner3 },
];

const TOTAL = banners.length;
const INTERVAL_MS = 5000;

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  // Use ref for interval so we never recreate handlers on state change
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TOTAL);
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      // Reset interval on manual nav so it doesn't fire immediately after
      startInterval();
    },
    [startInterval],
  );

  const prev = useCallback(() => goTo((current - 1 + TOTAL) % TOTAL), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % TOTAL), [current, goTo]);

  return (
    <div className="relative overflow-hidden" style={{ contain: "layout style" }}>
      {/*
        KEY PERF FIX: Use transform3d on a single container instead of
        opacity-switching each slide. GPU composites one layer, not N layers.
        "contain: layout style" tells browser this element is isolated.
      */}
      <div
        className="flex"
        style={{
          transform: `translate3d(-${current * 100}%, 0, 0)`,
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="min-w-full relative h-[400px] md:h-[500px] flex-shrink-0"
            // Prevent invisible slides from painting
            aria-hidden={index !== current}
          >
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              // Only eagerly load the first banner; lazy-load others
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              fetchPriority={index === 0 ? "high" : "low"}
              className="absolute inset-0 w-full h-full object-cover"
              // Hint browser about image dimensions to avoid layout shift
              width={1200}
              height={500}
            />
          </div>
        ))}
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        aria-label="Ảnh trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/75 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors duration-150 shadow-md"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Ảnh tiếp"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/75 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors duration-150 shadow-md"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Chuyển đến banner ${index + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: index === current ? "2rem" : "0.5rem",
              // opacity transition instead of bg class swap
              background:
                index === current
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--primary-foreground) / 0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;