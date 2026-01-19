// controllers/product.controller.js
import { db } from "../db/index.js";
import {
  products,
  product_variants,
  product_images,
  categories,
  brands,
} from "../db/schema.js";
import { eq, like, and, gte, lte } from "drizzle-orm";

// GET all products (with optional filters)
export const getAllProducts = async (req, res) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    gender,
    search,
    page = 1,
    limit = 12,
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const conditions = [];

  if (category) {
    const categoryId = parseInt(category);
    if (!isNaN(categoryId)) {
      conditions.push(eq(products.category_id, categoryId));
    }
  }

  if (brand) {
    const brandId = parseInt(brand);
    if (!isNaN(brandId)) {
      conditions.push(eq(products.brand_id, brandId));
    }
  }

  if (gender) {
    conditions.push(eq(products.gender, gender));
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      conditions.push(gte(products.price, min));
    }
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      conditions.push(lte(products.price, max));
    }
  }

  if (search) {
    conditions.push(like(products.name, `%${search}%`));
  }

  const result = await db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      images: true,
      variants: true,
    },
    limit: limitNumber,
    offset: offset,
  });

  res.json(result);
};

// GET single product by ID
export const getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));
  if (product.length === 0)
    return res.status(404).json({ message: "Product not found" });

  const variants = await db
    .select()
    .from(product_variants)
    .where(eq(product_variants.product_id, productId));
  const images = await db
    .select()
    .from(product_images)
    .where(eq(product_images.product_id, productId));

  res.json({ ...product[0], variants, images });
};

// CREATE product (admin)
export const createProduct = async (req, res) => {
  const {
    name,
    category_id,
    brand_id,
    description,
    price,
    discount_price,
    sku,
    gender,
    material,
  } = req.body;

  const newProduct = await db
    .insert(products)
    .values({
      name,
      category_id,
      brand_id,
      description,
      price,
      discount_price,
      sku,
      gender,
      material,
    })
    .returning();

  res.status(201).json({ message: "Product created", product: newProduct[0] });
};

// UPDATE product (admin)
export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  const {
    name,
    category_id,
    brand_id,
    description,
    price,
    discount_price,
    gender,
    material,
  } = req.body;

  const updated = await db
    .update(products)
    .set({
      name,
      category_id,
      brand_id,
      description,
      price,
      discount_price,
      gender,
      material,
    })
    .where(eq(products.id, productId))
    .returning();

  res.json({ message: "Product updated", product: updated[0] });
};

// DELETE product (admin)
export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  await db.delete(products).where(eq(products.id, productId));
  res.json({ message: "Product deleted" });
};
