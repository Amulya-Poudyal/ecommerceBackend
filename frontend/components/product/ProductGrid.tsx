import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ShoppingBag } from "lucide-react";
import styles from "./ProductGrid.module.css";

interface Props {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({ products, loading = false, skeletonCount = 8 }: Props) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={48} />
        <h3>No products found</h3>
        <p>Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
