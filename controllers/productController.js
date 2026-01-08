// controllers/product.controller.js
import { db } from '../db/index.ts';
import { products, product_variants, product_images, categories, brands } from '../db/schema.ts';
import { eq, like } from 'drizzle-orm';

// GET all products (with optional filters)
export const getAllProducts = async (req, res) => {
    const { category, brand, minPrice, maxPrice, gender, search } = req.query;

    let query = db.select().from(products);

    if (category) query = query.where(eq(products.category_id, parseInt(category)));
    if (brand) query = query.where(eq(products.brand_id, parseInt(brand)));
    if (gender) query = query.where(eq(products.gender, gender));
    if (minPrice) query = query.where(products.price.gte(parseFloat(minPrice)));
    if (maxPrice) query = query.where(products.price.lte(parseFloat(maxPrice)));
    if (search) query = query.where(like(products.name, `%${search}%`));

    const result = await query;

    res.json(result);
};

// GET single product by ID
export const getProductById = async (req, res) => {
    const productId = parseInt(req.params.id);

    const product = await db.select().from(products).where(eq(products.id, productId));
    if (product.length === 0) return res.status(404).json({ message: "Product not found" });

    const variants = await db.select().from(product_variants).where(eq(product_variants.product_id, productId));
    const images = await db.select().from(product_images).where(eq(product_images.product_id, productId));

    res.json({ ...product[0], variants, images });
};

// CREATE product (admin)
export const createProduct = async (req, res) => {
    const { name, category_id, brand_id, description, price, discount_price, sku, gender, material } = req.body;

    const newProduct = await db.insert(products)
        .values({ name, category_id, brand_id, description, price, discount_price, sku, gender, material })
        .returning();

    res.status(201).json({ message: "Product created", product: newProduct[0] });
};

// UPDATE product (admin)
export const updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, category_id, brand_id, description, price, discount_price, sku, gender, material } = req.body;

    const updated = await db.update(products)
        .set({ name, category_id, brand_id, description, price, discount_price, sku, gender, material })
        .where(eq(products.id, productId))
        .returning();

    res.json({ message: "Product updated", product: updated[0] });
};

// DELETE product (admin)
export const deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id);

    await db.delete(products).where(eq(products.id, productId));
    res.json({ message: "Product deleted" });
};
