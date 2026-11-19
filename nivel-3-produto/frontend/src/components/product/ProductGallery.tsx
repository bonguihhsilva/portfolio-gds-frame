"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-deep">
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={clsx(
                "relative h-20 w-16 shrink-0 overflow-hidden bg-ivory-deep transition-opacity",
                index === activeIndex ? "opacity-100 ring-1 ring-graphite" : "opacity-60 hover:opacity-90",
              )}
              aria-label={`Ver imagem ${index + 1} de ${alt}`}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
