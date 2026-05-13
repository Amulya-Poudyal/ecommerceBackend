"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./WishlistPage.module.css";

export default function WishlistPage() {
  const { ids, toggle, count, clear } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (ids.length > 0) {
      setLoading(true);
      // Fetch products in wishlist.
      productsApi.getAllClient({ ids: ids.join(",") } as Record<string, string>)
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [ids]);

  if (!mounted) return null;

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Wishlist <span className={styles.count}>({count})</span></h1>
        {count > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<Trash2 size={14} />} onClick={clear}>
            Clear Wishlist
          </Button>
        )}
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="350px" />)}
        </div>
      ) : count === 0 ? (
        <div className="empty-state">
          <Heart size={64} className={styles.emptyIcon} />
          <h3>Your wishlist is empty</h3>
          <p>Save items you love here to find them easily later.</p>
          <Link href="/products"><Button variant="primary">Explore Products</Button></Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <div key={p.id} className={styles.itemWrap}>
              <ProductCard product={p} />
              <button className={styles.removeBtn} onClick={() => toggle(p.id)} title="Remove from wishlist">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {count > 0 && (
        <div className={styles.footer}>
          <Link href="/products">
            <Button variant="outline" leftIcon={<ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
