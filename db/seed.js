import { db } from "./index.js";
import * as schema from "./schema.js";
import bcrypt from "bcrypt";

const seed = async () => {
  console.log("🌱 Seeding database...");

  // 1. Clear existing data (Order matters to avoid foreign key constraints)
  await db.delete(schema.order_items).execute();
  await db.delete(schema.orders).execute();
  await db.delete(schema.cart_items).execute();
  await db.delete(schema.carts).execute();
  await db.delete(schema.reviews).execute();
  await db.delete(schema.product_images).execute();
  await db.delete(schema.product_variants).execute();
  await db.delete(schema.products).execute();
  await db.delete(schema.categories).execute();
  await db.delete(schema.brands).execute();
  await db.delete(schema.coupons).execute();
  await db.delete(schema.users).execute();
  console.log("🧹 Cleared existing data.");

  // 2. Users
  const hashedPassword = await bcrypt.hash("password123", 10);
  const [adminUser] = await db
    .insert(schema.users)
    .values({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      is_admin: true,
    })
    .returning();

  const [regularUser] = await db
    .insert(schema.users)
    .values({
      username: "john_doe",
      email: "john@example.com",
      password: hashedPassword,
      is_admin: false,
    })
    .returning();
  console.log("👤 Users created.");

  // 3. Categories
  const [electronics] = await db
    .insert(schema.categories)
    .values({
      name: "Electronics",
      description: "Gadgets and devices",
    })
    .returning();

  const [clothing] = await db
    .insert(schema.categories)
    .values({
      name: "Clothing",
      description: "Men and Women fashion",
    })
    .returning();
  console.log("📂 Categories created.");

  // 4. Brands
  const [apple] = await db
    .insert(schema.brands)
    .values({
      name: "Apple",
      country: "USA",
    })
    .returning();

  const [nike] = await db
    .insert(schema.brands)
    .values({
      name: "Nike",
      country: "USA",
    })
    .returning();
  console.log("🏷️ Brands created.");

  // 5. Products
  const [iphone] = await db
    .insert(schema.products)
    .values({
      name: "iPhone 15 Pro",
      category_id: electronics.id,
      brand_id: apple.id,
      description: "The latest iPhone with titanium design.",
      price: 999.0,
      discount_price: 949.0,
      gender: "Unisex",
      material: "Titanium",
    })
    .returning();

  const [tshirt] = await db                                                                                                                                                                                                                                       
  
    .insert(schema.products)
    .values({
      name: "Nike Dri-FIT T-Shirt",
      category_id: clothing.id,
      brand_id: nike.id,
      description: "Comfortable running t-shirt.",
      price: 35.0,
      discount_price: 29.99,
      gender: "Men",
      material: "Polyester",
    })
    .returning();
  console.log("📦 Products created.");

  // 6. Product Variants
  await db.insert(schema.product_variants).values([
    {
      product_id: iphone.id,
      size: "256GB",
      color: "Natural Titanium",
      quantity: 50,
      price: 999.0,
    },
    {
      product_id: iphone.id,
      size: "512GB",
      color: "Black Titanium",
      quantity: 30,
      price: 1199.0,
    },
    { product_id: tshirt.id, size: "M", color: "Black", quantity: 100 },
    { product_id: tshirt.id, size: "L", color: "White", quantity: 80 },
  ]);
  console.log("🎨 Variants added.");

  // 7. Product Images
  await db.insert(schema.product_images).values([
    {
      product_id: iphone.id,
      url: "https://via.placeholder.com/300x300?text=iPhone+15",
    },
    {
      product_id: tshirt.id,
      url: "https://via.placeholder.com/300x300?text=Nike+Shirt",
    },
  ]);
  console.log("🖼️ Images added.");

  // 8. Reviews
  await db.insert(schema.reviews).values({
    product_id: iphone.id,
    user_id: regularUser.id,
    rating: 5,
    comment: "Amazing phone! worth the price.",
  });
  console.log("⭐ Reviews added.");

  // 9. Carts
  const [cart] = await db
    .insert(schema.carts)
    .values({
      user_id: regularUser.id,
    })
    .returning();

  await db.insert(schema.cart_items).values({
    cart_id: cart.id,
    product_id: tshirt.id,
    quantity: 2,
  });
  console.log("🛒 Cart created.");

  // 10. Orders
  const [order] = await db
    .insert(schema.orders)
    .values({
      user_id: regularUser.id,
      total_amount: 1069.0,
      status: "Shipped",
      payment_status: "Paid",
      shipping_address: "123 Main St, Springfield",
    })
    .returning();

  await db.insert(schema.order_items).values([
    { order_id: order.id, product_id: iphone.id, quantity: 1, price: 999.0 },
    { order_id: order.id, product_id: tshirt.id, quantity: 2, price: 35.0 },
  ]);
  console.log("🚚 Orders created.");

  // 11. Coupons
  await db.insert(schema.coupons).values({
    code: "WELCOME10",
    discount_percentage: 10,
    usage_limit: 100,
  });
  console.log("🎟️ Coupons created.");

  console.log("✅ Database seeded successfully!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
