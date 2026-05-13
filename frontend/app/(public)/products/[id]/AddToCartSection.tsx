"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/types";
import styles from "./AddToCartSection.module.css";

export function AddToCartSection({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  );
  const [qty, setQty] = useState(1);
  const { addItem, isLoading } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { success, error } = useToast();

  const handleAddToCart = async () => {
    if (!selectedVariant) { error("Please select a variant"); return; }
    try {
      await addItem(product.id, selectedVariant.id, qty);
      success(`${product.name} added to cart`);
    } catch (err: unknown) {
      const e = err as ApiError;
      error(e.message ?? "Sign in to add to cart");
    }
  };

  return (
    <div className={styles.section}>
      <ProductVariantSelector
        variants={product.variants}
        onSelect={setSelectedVariant}
      />

      <div className={styles.qtyRow}>
        <span className={styles.qtyLabel}>Quantity</span>
        <div className={styles.qty}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
            <Minus size={14} />
          </button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          size="lg"
          fullWidth
          leftIcon={<ShoppingBag size={18} />}
          loading={isLoading}
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.quantity <= 0}
        >
          {selectedVariant?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <button
          className={[styles.wishlistBtn, isWishlisted(product.id) ? styles.wishlisted : ""].join(" ")}
          onClick={() => { toggle(product.id); success(isWishlisted(product.id) ? "Removed from wishlist" : "Added to wishlist"); }}
          aria-label="Wishlist"
        >
          <Heart size={20} fill={isWishlisted(product.id) ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
