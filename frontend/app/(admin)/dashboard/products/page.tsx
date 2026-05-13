"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { brandsApi } from "@/lib/api/brands";
import { Product, Category, Brand } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { GENDER_OPTIONS } from "@/lib/constants";
import styles from "./AdminProducts.module.css";

const empty = { name: "", price: "", discount_price: "", description: "", gender: "", material: "", category_id: "", brand_id: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageProductId, setImageProductId] = useState<number | null>(null);
  const { success, error } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([
      productsApi.getAllClient().catch(() => []),
      categoriesApi.getAllClient().catch(() => []),
      brandsApi.getAllClient().catch(() => []),
    ]).then(([p, c, b]) => { setProducts(p); setCategories(c); setBrands(b); }).finally(() => setLoading(false));
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, discount_price: p.discount_price ?? "", description: p.description ?? "", gender: p.gender ?? "", material: p.material ?? "", category_id: String(p.category_id ?? ""), brand_id: String(p.brand_id ?? "") });
    setModalOpen(true);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const payload = { ...form, category_id: form.category_id ? parseInt(form.category_id) : null, brand_id: form.brand_id ? parseInt(form.brand_id) : null };
      if (editing) { await productsApi.update(editing.id, payload as never); success("Product updated"); }
      else { await productsApi.create(payload as never); success("Product created"); }
      setModalOpen(false); load();
    } catch { error("Failed to save product"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try { await productsApi.delete(id); setProducts((p) => p.filter((x) => x.id !== id)); success("Product deleted"); }
    catch { error("Delete failed"); }
  };

  const handleAddImage = async () => {
    if (!imageProductId || !imageUrl.trim()) return;
    try { await productsApi.addImage(imageProductId, imageUrl); success("Image added"); setImageUrl(""); setImageProductId(null); load(); }
    catch { error("Failed to add image"); }
  };

  return (
    <div>
      <div className={styles.topBar}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Products</h1>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Add Product</Button>
      </div>

      <div className="table-wrapper" style={{ marginTop: "var(--space-4)" }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Gender</th><th>Images</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={7}><Skeleton height="36px" /></td></tr>)
              : products.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td className={styles.productName}>{p.name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{categories.find((c) => c.id === p.category_id)?.name ?? "—"}</td>
                  <td>{p.gender ?? "—"}</td>
                  <td>
                    <div className={styles.imageCell}>
                      <span className={styles.imageCount}>{p.images?.length ?? 0}</span>
                      <button className={styles.addImageBtn} onClick={() => { setImageProductId(p.id); }} title="Add image">
                        <ImageIcon size={13} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(p)}><Edit2 size={13} /></button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add image modal */}
      <Modal isOpen={imageProductId !== null} onClose={() => setImageProductId(null)} title="Add Product Image" size="sm">
        <div className={styles.imageForm}>
          <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
          <Button fullWidth onClick={handleAddImage} disabled={!imageUrl.trim()}>Add Image</Button>
        </div>
      </Modal>

      {/* Create / Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"} size="lg">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <Input label="Name" value={form.name} onChange={set("name")} required />
            <Input label="Price (NPR)" type="number" step="0.01" value={form.price} onChange={set("price")} required />
            <Input label="Discount Price" type="number" step="0.01" value={form.discount_price} onChange={set("discount_price")} />
            <Input label="Material" value={form.material} onChange={set("material")} />
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={form.category_id} onChange={set("category_id")}>
                <option value="">— Select —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Brand</label>
              <select className={styles.select} value={form.brand_id} onChange={set("brand_id")}>
                <option value="">— Select —</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Gender</label>
              <select className={styles.select} value={form.gender} onChange={set("gender")}>
                <option value="">— Select —</option>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} rows={3} value={form.description} onChange={set("description")} />
          </div>
          <Button type="submit" fullWidth loading={submitting}>{editing ? "Update Product" : "Create Product"}</Button>
        </form>
      </Modal>
    </div>
  );
}
