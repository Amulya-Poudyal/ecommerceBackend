import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverData } from "@/lib/server-data";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { StarRating } from "@/components/product/StarRating";
import { AddToCartSection } from "./AddToCartSection";
import { formatPrice, effectivePrice, discountPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import styles from "./ProductDetail.module.css";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await serverData.getProductById(id).catch(() => null);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? `Buy ${product.name} at KritimStore`,
    openGraph: { images: product.images?.[0]?.url ? [product.images[0].url] : [] },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, reviews] = await Promise.all([
    serverData.getProductById(id).catch(() => null),
    serverData.getReviews(id).catch(() => []),
  ]);

  if (!product) notFound();

  const price = effectivePrice(product.price, product.discount_price);
  const pct = product.discount_price ? discountPercent(product.price, product.discount_price) : 0;
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.grid}>
        <div className={styles.galleryCol}>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>
        <div className={styles.detailCol}>
          <div className={styles.badges}>
            {product.gender && <Badge variant="default">{product.gender}</Badge>}
            {pct > 0 && <Badge variant="error">-{pct}% OFF</Badge>}
          </div>
          <h1 className={styles.name}>{product.name}</h1>
          {reviews.length > 0 && (
            <div className={styles.rating}>
              <StarRating rating={avgRating} showValue />
              <span className={styles.ratingCount}>({reviews.length} reviews)</span>
            </div>
          )}
          <div className={styles.pricing}>
            <span className={styles.price}>{formatPrice(price)}</span>
            {product.discount_price && (
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            )}
          </div>
          {product.description && <p className={styles.description}>{product.description}</p>}
          {product.variants.length > 0 && <AddToCartSection product={product} />}
          <div className={styles.meta}>
            {product.material && <p><span>Material:</span> {product.material}</p>}
          </div>
        </div>
      </div>

      <section className={styles.reviews}>
        <h2 className={styles.reviewsTitle}>
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Purchase this product to leave a review.</p>
        ) : (
          <div className={styles.reviewList}>
            {reviews.map((r) => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <StarRating rating={r.rating} size={14} />
                  <span className={styles.reviewDate}>
                    {new Date(r.created_at).toLocaleDateString("en-NP")}
                  </span>
                </div>
                {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
