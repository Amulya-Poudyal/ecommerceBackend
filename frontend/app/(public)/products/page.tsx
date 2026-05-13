"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { brandsApi } from "@/lib/api/brands";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product, Category, Brand, ProductFilters } from "@/types";
import { GENDER_OPTIONS, PRODUCTS_PER_PAGE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { debounce } from "@/lib/utils";
import styles from "./ProductsPage.module.css";

function ProductsContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: ProductFilters = {
    category: params.get("category") ?? undefined,
    brand: params.get("brand") ?? undefined,
    gender: params.get("gender") ?? undefined,
    minPrice: params.get("minPrice") ?? undefined,
    maxPrice: params.get("maxPrice") ?? undefined,
    search: params.get("search") ?? undefined,
    page: parseInt(params.get("page") ?? "1"),
    limit: PRODUCTS_PER_PAGE,
  };

  const setFilter = (key: string, value: string | undefined) => {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    sp.delete("page");
    router.push(`/products?${sp.toString()}`);
  };

  const clearFilters = () => router.push("/products");
  const hasFilters = !!(filters.category || filters.brand || filters.gender || filters.minPrice || filters.maxPrice || filters.search);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    productsApi.getAllClient(filters).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  useEffect(() => {
    categoriesApi.getAllClient().then(setCategories).catch(() => []);
    brandsApi.getAllClient().then(setBrands).catch(() => []);
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((v: string) => setFilter("search", v || undefined), 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>
            {filters.search ? `Results for "${filters.search}"` : filters.gender ? `${filters.gender}'s Collection` : "All Products"}
          </h1>
          {!loading && <p className={styles.count}>{products.length} products</p>}
        </div>
        <Button variant="secondary" size="sm" leftIcon={<SlidersHorizontal size={15} />} onClick={() => setFiltersOpen((v) => !v)}>
          Filters
        </Button>
      </div>

      <div className={styles.layout}>
        <aside className={[styles.sidebar, filtersOpen ? styles.sidebarOpen : ""].join(" ")}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Filters</span>
            {hasFilters && <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>}
            <button className={styles.sidebarClose} onClick={() => setFiltersOpen(false)}><X size={16} /></button>
          </div>
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Search</p>
            <input className={styles.filterInput} placeholder="Search products…" defaultValue={filters.search ?? ""} onChange={(e) => debouncedSearch(e.target.value)} />
          </div>
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Gender</p>
            <div className={styles.filterOptions}>
              {GENDER_OPTIONS.map((g) => (
                <button key={g} className={[styles.filterChip, filters.gender === g ? styles.chipActive : ""].join(" ")} onClick={() => setFilter("gender", filters.gender === g ? undefined : g)}>{g}</button>
              ))}
            </div>
          </div>
          {categories.length > 0 && (
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Category</p>
              <div className={styles.filterList}>
                {categories.map((c) => (
                  <button key={c.id} className={[styles.filterListItem, filters.category === String(c.id) ? styles.listItemActive : ""].join(" ")} onClick={() => setFilter("category", filters.category === String(c.id) ? undefined : String(c.id))}>{c.name}</button>
                ))}
              </div>
            </div>
          )}
          {brands.length > 0 && (
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Brand</p>
              <div className={styles.filterList}>
                {brands.map((b) => (
                  <button key={b.id} className={[styles.filterListItem, filters.brand === String(b.id) ? styles.listItemActive : ""].join(" ")} onClick={() => setFilter("brand", filters.brand === String(b.id) ? undefined : String(b.id))}>{b.name}</button>
                ))}
              </div>
            </div>
          )}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Price Range</p>
            <div className={styles.priceInputs}>
              <input className={styles.filterInput} placeholder="Min" type="number" defaultValue={filters.minPrice ?? ""} onBlur={(e) => setFilter("minPrice", e.target.value || undefined)} />
              <span>—</span>
              <input className={styles.filterInput} placeholder="Max" type="number" defaultValue={filters.maxPrice ?? ""} onBlur={(e) => setFilter("maxPrice", e.target.value || undefined)} />
            </div>
          </div>
        </aside>

        <div className={styles.gridWrap}>
          {hasFilters && (
            <div className={styles.activeTags}>
              {filters.gender && <span className={styles.tag}>{filters.gender} <button onClick={() => setFilter("gender", undefined)}>×</button></span>}
              {filters.search && <span className={styles.tag}>&quot;{filters.search}&quot; <button onClick={() => setFilter("search", undefined)}>×</button></span>}
              {filters.category && <span className={styles.tag}>Category #{filters.category} <button onClick={() => setFilter("category", undefined)}>×</button></span>}
              {filters.brand && <span className={styles.tag}>Brand #{filters.brand} <button onClick={() => setFilter("brand", undefined)}>×</button></span>}
            </div>
          )}
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingBlock: "var(--space-10)" }}><p>Loading products…</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
