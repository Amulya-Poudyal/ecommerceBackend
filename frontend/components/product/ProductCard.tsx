"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, effectivePrice, discountPercent } from "@/lib/utils";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useToast } from "@/components/ui/Toast";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem, isLoading } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { success, error } = useToast();
  const wishlisted = isWishlisted(product.id);

  const mainImage = product.images?.[0]?.url;
  const firstVariant = product.variants?.[0];
  const price = effectivePrice(product.price, product.discount_price);
  const pct = product.discount_price ? discountPercent(product.price, product.discount_price) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) { error("No variant available"); return; }
    try {
      await addItem(product.id, firstVariant.id, 1);
      success(`${product.name} added to cart`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please sign in to add items";
      error(msg);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <ShoppingBag size={32} />
          </div>
        )}
        {pct > 0 && <span className={styles.discountBadge}>-{pct}%</span>}
        <button
          className={[styles.wishlistBtn, wishlisted ? styles.wishlisted : ""].join(" ")}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <div className={styles.overlay}>
          <button
            className={styles.cartBtn}
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant}
          >
            <ShoppingBag size={16} />
            {firstVariant ? "Quick Add" : "Out of Stock"}
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.category}>
          {product.gender && <span>{product.gender}</span>}
        </p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(price)}</span>
          {product.discount_price && (
            <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
          )}
        </div>
        {product.variants && product.variants.length > 0 && (
          <div className={styles.colors}>
            {[...new Set(product.variants.map((v) => v.color).filter(Boolean))].slice(0, 4).map((color) => (
              <span
                key={color}
                className={styles.colorDot}
                title={color!}
                style={{ background: color?.toLowerCase() === "white" ? "#eee" : color?.toLowerCase() === "black" ? "#222" : color ?? "#888" }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
