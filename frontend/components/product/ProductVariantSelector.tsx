"use client";

import { useState } from "react";
import { ProductVariant } from "@/types";
import styles from "./ProductVariantSelector.module.css";

interface Props {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant | null) => void;
}

export function ProductVariantSelector({ variants, onSelect }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[];

  const match = variants.find(
    (v) =>
      (sizes.length === 0 || v.size === selectedSize) &&
      (colors.length === 0 || v.color === selectedColor)
  );

  const handleSize = (size: string) => {
    const next = selectedSize === size ? null : size;
    setSelectedSize(next);
    const found = variants.find(
      (v) => v.size === next && (colors.length === 0 || v.color === selectedColor)
    );
    onSelect(found ?? null);
  };

  const handleColor = (color: string) => {
    const next = selectedColor === color ? null : color;
    setSelectedColor(next);
    const found = variants.find(
      (v) => v.color === next && (sizes.length === 0 || v.size === selectedSize)
    );
    onSelect(found ?? null);
  };

  const isOutOfStock = (v: ProductVariant) => v.quantity <= 0;

  return (
    <div className={styles.selector}>
      {colors.length > 0 && (
        <div className={styles.group}>
          <p className={styles.label}>
            Color <span className={styles.selected}>{selectedColor ?? "—"}</span>
          </p>
          <div className={styles.colors}>
            {colors.map((color) => {
              const v = variants.find((v) => v.color === color);
              const oos = v ? isOutOfStock(v) : false;
              return (
                <button
                  key={color}
                  title={color}
                  className={[
                    styles.colorBtn,
                    selectedColor === color ? styles.colorActive : "",
                    oos ? styles.oos : "",
                  ].join(" ")}
                  onClick={() => handleColor(color)}
                  style={{
                    background:
                      color.toLowerCase() === "white" ? "#eee" :
                      color.toLowerCase() === "black" ? "#222" :
                      color,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className={styles.group}>
          <p className={styles.label}>Size</p>
          <div className={styles.sizes}>
            {sizes.map((size) => {
              const v = variants.find((v) => v.size === size && (colors.length === 0 || v.color === selectedColor));
              const oos = v ? isOutOfStock(v) : false;
              return (
                <button
                  key={size}
                  className={[
                    styles.sizeBtn,
                    selectedSize === size ? styles.sizeActive : "",
                    oos ? styles.oos : "",
                  ].join(" ")}
                  onClick={() => handleSize(size)}
                  disabled={oos}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {match && (
        <p className={styles.stock}>
          {match.quantity > 0
            ? <span className={styles.inStock}>In stock ({match.quantity})</span>
            : <span className={styles.outOfStock}>Out of stock</span>}
        </p>
      )}
    </div>
  );
}
