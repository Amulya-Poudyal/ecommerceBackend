import type { Metadata } from "next";
import Link from "next/link";
import { serverData } from "@/lib/server-data";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE_NAME } from "@/lib/constants";
import styles from "./HomePage.module.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Premium Fashion Store`,
  description: "Discover premium clothing for men and women. Free shipping on orders over NPR 2,000.",
};

export const revalidate = 60;

export default async function HomePage() {
  const [newArrivals, categories] = await Promise.all([
    serverData.getProducts({ limit: 8, page: 1 }).catch(() => []),
    serverData.getCategories().catch(() => []),
  ]);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>New Season Arrivals</span>
          <h1 className={styles.heroTitle}>
            Fashion That<br />
            <span className={styles.heroAccent}>Moves With You</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Premium clothing crafted for comfort and style. Discover the latest collections.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.heroCta}>Shop Now</Link>
            <Link href="/products?gender=Women" className={styles.heroCtaOutline}>Women&apos;s Collection</Link>
          </div>
        </div>
        <div className={styles.heroStats}>
          {[
            { num: "500+", label: "Products" },
            { num: "50+", label: "Brands" },
            { num: "10K+", label: "Happy Customers" },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className={`section ${styles.categories}`}>
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you&apos;re looking for</p>
            <div className={styles.categoryGrid}>
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`} className={styles.categoryCard}>
                  <span className={styles.categoryName}>{cat.name}</span>
                  {cat.description && <span className={styles.categoryDesc}>{cat.description}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">Fresh styles added this week</p>
            </div>
            <Link href="/products" className={styles.viewAll}>View All →</Link>
          </div>
          <div className={styles.productsGrid}>
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className={styles.trust}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders over NPR 2,000" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns" },
              { icon: "🔒", title: "Secure Payment", desc: "Your data is always safe" },
              { icon: "💬", title: "24/7 Support", desc: "We're here to help" },
            ].map((b) => (
              <div key={b.title} className={styles.trustCard}>
                <span className={styles.trustIcon}>{b.icon}</span>
                <div>
                  <p className={styles.trustTitle}>{b.title}</p>
                  <p className={styles.trustDesc}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
