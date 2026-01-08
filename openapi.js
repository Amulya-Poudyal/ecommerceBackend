export const openApiSpec = {
    openapi: '3.1.0',
    info: {
        title: 'E-commerce API',
        version: '1.0.0',
        description: 'API documentation for the E-commerce application',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local Development Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        // --- AUTH ---
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                    fullName: { type: 'string' },
                                },
                                required: ['email', 'password', 'fullName'],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'User registered successfully' },
                    400: { description: 'Bad request' },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Login successful, returns token' },
                    401: { description: 'Invalid credentials' },
                },
            },
        },

        // --- USERS ---
        '/users/profile': {
            get: {
                tags: ['Users'],
                summary: 'Get current user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'User profile data' },
                    401: { description: 'Unauthorized' },
                },
            },
            put: {
                tags: ['Users'],
                summary: 'Update user profile',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string' },
                                    phone: { type: 'string' },
                                    address: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Profile updated' },
                },
            },
        },

        // --- PRODUCTS ---
        '/products': {
            get: {
                tags: ['Products'],
                summary: 'Get all products',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'category', in: 'query', schema: { type: 'string' } },
                ],
                responses: {
                    200: { description: 'List of products' },
                },
            },
            post: {
                tags: ['Products'],
                summary: 'Create a product (Admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    stock: { type: 'integer' },
                                    categoryId: { type: 'string' },
                                    brandId: { type: 'string' },
                                },
                                required: ['name', 'price'],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Product created' },
                },
            },
        },
        '/products/{id}': {
            get: {
                tags: ['Products'],
                summary: 'Get product by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Product details' },
                    404: { description: 'Product not found' },
                },
            },
            put: {
                tags: ['Products'],
                summary: 'Update product (Admin)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    price: { type: 'number' },
                                    stock: { type: 'integer' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Product updated' },
                },
            },
            delete: {
                tags: ['Products'],
                summary: 'Delete product (Admin)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Product deleted' },
                },
            },
        },

        // --- CATEGORIES ---
        '/categories': {
            get: {
                tags: ['Categories'],
                summary: 'List all categories',
                responses: { 200: { description: 'List of categories' } },
            },
            post: {
                tags: ['Categories'],
                summary: 'Create category (Admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: { name: { type: 'string' }, description: { type: 'string' } },
                                required: ['name'],
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Category created' } },
            },
        },

        // --- BRANDS ---
        '/brands': {
            get: {
                tags: ['Brands'],
                summary: 'List all brands',
                responses: { 200: { description: 'List of brands' } },
            },
            post: {
                tags: ['Brands'],
                summary: 'Create brand (Admin)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: { name: { type: 'string' } },
                                required: ['name'],
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Brand created' } },
            },
        },

        // --- CART ---
        '/cart': {
            get: {
                tags: ['Cart'],
                summary: 'Get user cart',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Cart details' } },
            },
            post: {
                tags: ['Cart'],
                summary: 'Add item to cart',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: { productId: { type: 'string' }, quantity: { type: 'integer' } },
                                required: ['productId', 'quantity'],
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Item added to cart' } },
            },
        },
        '/cart/{itemId}': {
            delete: {
                tags: ['Cart'],
                summary: 'Remove item from cart',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Item removed' } },
            },
        },

        // --- ORDERS ---
        '/orders': {
            post: {
                tags: ['Orders'],
                summary: 'Create new order',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    items: { type: 'array', items: { type: 'object' } },
                                    shippingAddress: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Order created' } },
            },
        },
        '/orders/my-orders': {
            get: {
                tags: ['Orders'],
                summary: 'Get current user orders',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'List of orders' } },
            },
        },
        '/orders/{id}': {
            get: {
                tags: ['Orders'],
                summary: 'Get order details',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Order details' } },
            },
        },

        // Reviews
        '/reviews/product/{productId}': {
            get: {
                tags: ['Reviews'],
                summary: 'Get reviews for a product',
                parameters: [
                    {
                        name: 'productId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: { description: 'List of reviews' },
                },
            },
            post: {
                tags: ['Reviews'],
                summary: 'Add a review for a product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'productId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    rating: { type: 'number', minimum: 1, maximum: 5 },
                                    comment: { type: 'string' },
                                },
                                required: ['rating'],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Review created' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/reviews/{id}': {
            delete: {
                tags: ['Reviews'],
                summary: 'Delete a review',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: { description: 'Review deleted' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        // Admin
        '/admin/users': {
            get: {
                tags: ['Admin'],
                summary: 'Get all users',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'List of users' },
                    403: { description: 'Forbidden - Admin only' },
                },
            },
        },
        '/admin/users/{id}/role': {
            put: {
                tags: ['Admin'],
                summary: 'Update user role',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    role: { type: 'string', enum: ['user', 'admin'] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'User role updated' },
                },
            },
        },
        '/admin/orders': {
            get: {
                tags: ['Admin'],
                summary: 'Get all orders',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'List of orders' },
                },
            },
        },
        '/admin/orders/{id}/status': {
            put: {
                tags: ['Admin'],
                summary: 'Update order status',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Order status updated' },
                },
            },
        },
        '/admin/reviews/{id}': {
            delete: {
                tags: ['Admin'],
                summary: 'Delete a review as Admin',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: { description: 'Review deleted' },
                },
            },
        },
    },
};