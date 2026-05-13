"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ProductImage } from "@/types";
import styles from "./ProductImageGallery.module.css";

interface Props {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <ZoomIn size={48} />
        <p>No images available</p>
      </div>
    );
  }

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          src={images[active].url}
          alt={`${productName} - image ${active + 1}`}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className={styles.mainImage}
        />
        {images.length > 1 && (
          <>
            <button className={[styles.arrow, styles.prev].join(" ")} onClick={prev} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button className={[styles.arrow, styles.next].join(" ")} onClick={next} aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={img.id}
              className={[styles.thumb, i === active ? styles.thumbActive : ""].join(" ")}
              onClick={() => setActive(i)}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
