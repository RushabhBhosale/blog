"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

function PhotoGallery({ story }: { story: any }) {
  const photos = story.gallery;
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const open = useCallback((i: number) => {
    setCurrentIndex(i);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const prev = useCallback(
    () => setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1)),
    [photos.length]
  );
  const next = useCallback(
    () => setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1)),
    [photos.length]
  );

  // keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, next, prev, close]);

  return (
    <section className="mt-12 space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-foreground">
          Photo gallery
        </h2>
        <p className="text-sm text-muted-foreground">
          A handful of frames that capture the mood.
        </p>
      </header>

      {/* Masonry (no crop, no clipping) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {photos.map((image: any, index: number) => (
          <figure
            key={image.src}
            title={image.alt}
            onClick={() => open(index)}
            className="mb-4 break-inside-avoid cursor-pointer rounded-2xl bg-muted/20 p-0"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={2000}
              height={1333}
              className="w-full h-auto object-contain rounded-2xl"
              sizes="(min-width:1024px) 32vw, (min-width:640px) 48vw, 96vw"
              loading="lazy"
            />
          </figure>
        ))}
      </div>

      {/* Lightbox with 70–80vh constraint, no crop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Close
          </button>

          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 select-none text-4xl text-white/90 hover:text-white"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 select-none text-4xl text-white/90 hover:text-white"
            aria-label="Next photo"
          >
            ›
          </button>

          <div className="relative mx-auto w-full max-w-6xl px-4 rounded-2xl">
            <Image
              src={photos[currentIndex].src}
              alt={photos[currentIndex].alt}
              width={3000}
              height={2000}
              priority
              className="mx-auto max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
            />
            <p className="mt-3 text-center text-sm text-gray-300">
              {currentIndex + 1} / {photos.length} — {photos[currentIndex].alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default PhotoGallery;
