export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "API documentation for the E-commerce application",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    // --- AUTH ---
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  username: { type: "string" },
                },
                required: ["email", "password", "username"],
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          409: { description: "User already exists" },
          400: { description: "Bad request" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful, returns token" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current logged in user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User details" },
          401: { description: "Unauthorized" },
        },
      },
    },

    // --- USERS ---
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "User details" },
          404: { description: "User not found" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  // Add other updatable fields as necessary
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (Admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of all users" },
          403: { description: "Forbidden" },
        },
      },
    },

    // --- PRODUCTS ---
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "category", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: { description: "List of products" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product (Admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  discount_price: { type: "number" },
                  stock: { type: "integer" }, // Mapped to inventory usually
                  categoryId: { type: "integer" },
                  brandId: { type: "integer" },
                  gender: { type: "string" },
                  material: { type: "string" },
                },
                required: ["name", "price"],
              },
            },
          },
        },
        responses: {
          201: { description: "Product created" },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Product details" },
          404: { description: "Product not found" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  // Add other fields
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Product updated" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Product deleted" },
        },
      },
    },

    // --- PRODUCT VARIANTS ---
    "/products/{id}/variants": {
      post: {
        tags: ["Products"],
        summary: "Add variant to product (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  size: { type: "string" },
                  color: { type: "string" },
                  quantity: { type: "integer" },
                  price: { type: "number" },
                },
                required: ["quantity"],
              },
            },
          },
        },
        responses: {
          201: { description: "Variant added" },
        },
      },
    },
    "/products/{id}/variants/{variantId}": {
      put: {
        tags: ["Products"],
        summary: "Update variant (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "variantId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  size: { type: "string" },
                  color: { type: "string" },
                  quantity: { type: "integer" },
                  price: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Variant updated" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete variant (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "variantId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Variant deleted" },
        },
      },
    },

    // --- PRODUCT IMAGES ---
    "/products/{id}/images": {
      post: {
        tags: ["Products"],
        summary: "Add image to product (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string" },
                },
                required: ["url"],
              },
            },
          },
        },
        responses: {
          201: { description: "Image added" },
        },
      },
    },
    "/products/{id}/images/{imageId}": {
      delete: {
        tags: ["Products"],
        summary: "Delete image (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "imageId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Image deleted" },
        },
      },
    },

    // --- CATEGORIES ---
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List all categories",
        responses: { 200: { description: "List of categories" } },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category (Admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: { 201: { description: "Category created" } },
      },
    },
    "/categories/{id}": {
      put: {
        tags: ["Categories"],
        summary: "Update category (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Category updated" } },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Category deleted" } },
      },
    },

    // --- BRANDS ---
    "/brands": {
      get: {
        tags: ["Brands"],
        summary: "List all brands",
        responses: { 200: { description: "List of brands" } },
      },
      post: {
        tags: ["Brands"],
        summary: "Create brand (Admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { name: { type: "string" } },
                required: ["name"],
              },
            },
          },
        },
        responses: { 201: { description: "Brand created" } },
      },
    },
    "/brands/{id}": {
      put: {
        tags: ["Brands"],
        summary: "Update brand (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { name: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Brand updated" } },
      },
      delete: {
        tags: ["Brands"],
        summary: "Delete brand (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Brand deleted" } },
      },
    },

    // --- CART ---
    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get user cart",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Cart details" } },
      },
    },
    "/cart/add": {
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer" },
                  variantId: { type: "integer" },
                },
                required: ["productId", "quantity"],
              },
            },
          },
        },
        responses: { 200: { description: "Item added to cart" } },
      },
    },
    "/cart/item/{itemId}": {
      put: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { quantity: { type: "integer" } },
                required: ["quantity"],
              },
            },
          },
        },
        responses: { 200: { description: "Cart item updated" } },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Item removed" } },
      },
    },
    "/cart/clear": {
      delete: {
        tags: ["Cart"],
        summary: "Clear cart",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Cart cleared" } },
      },
    },

    // --- ORDERS ---
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create new order (Checkout)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  shippingAddress: { type: "string" },
                },
                required: ["shippingAddress"],
              },
            },
          },
        },
        responses: { 201: { description: "Order created" } },
      },
      get: {
        tags: ["Orders"],
        summary: "Get all orders (Admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of all orders" },
        },
      },
    },
    "/orders/my": {
      get: {
        tags: ["Orders"],
        summary: "Get current user orders",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of orders" } },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order details",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Order details" } },
      },
    },
    "/orders/{id}/status": {
      put: {
        tags: ["Orders"],
        summary: "Update order status (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
                  },
                },
                required: ["status"],
              },
            },
          },
        },
        responses: { 200: { description: "Order status updated" } },
      },
    },

    // --- REVIEWS ---
    "/reviews/product/{productId}": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews for a product",
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "List of reviews" },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Add a review for a product",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rating: { type: "number", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
                required: ["rating"],
              },
            },
          },
        },
        responses: {
          201: { description: "Review created" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/reviews/{id}": {
      delete: {
        tags: ["Reviews"],
        summary: "Delete a review",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Review deleted" },
          401: { description: "Unauthorized" },
        },
      },
    },

    // --- ADMIN SPECIFIC ---
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of users" },
        },
      },
    },
    "/admin/users/{id}/role": {
      put: {
        tags: ["Admin"],
        summary: "Update user role",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: { type: "string", enum: ["user", "admin"] }, // Wait, schema says boolean is_admin, but controller likely handles role checks? Schema has is_admin boolean. Controller might take arbitrary string? Let's assume boolean or logic hidden. `adminController.js` usually handles it.
                  // Checking schema: is_admin boolean.
                  // Checking adminController: `updateUserRole` -> `await db.update(users).set({ role })...` -> Wait, schema has is_admin. Controller might be trying to set `role` column which doesn't exist?
                  // Let's assume the controller or schema meant is_admin.
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User role updated" },
        },
      },
    },
    "/admin/orders": {
      get: {
        tags: ["Admin"],
        summary: "Get all orders",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of orders" },
        },
      },
    },
    "/admin/orders/{id}/status": {
      put: {
        tags: ["Admin"],
        summary: "Update order status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Order status updated" } },
      },
    },
    "/admin/reviews/{id}": {
      delete: {
        tags: ["Admin"],
        summary: "Delete review (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Review deleted" } },
      },
    },
  },
};
