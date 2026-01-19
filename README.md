# E-commerce Backend

This project is a RESTful API backend for an e-commerce platform, built with Node.js, Express, and PostgreSQL using Drizzle ORM. It includes authentication, product management, cart functionality, and order processing.

A comprehensive API reference is available via **Scalar**.

## 🚀 Features

- **Authentication**: User registration, login, and JWT-based protection.
- **Product Management**: CRUD operations for products, categories, and brands.
- **Shopping Experience**: Cart management, order placement, and reviews.
- **Admin Dashboard**: Dedicated routes for administrative tasks.
- **Documentation**: Interactive API docs powered by Scalar.

## 🛠 Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** database

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd ecommerceBackend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    DATABASE_URL=postgresql://user:password@localhost:5432/dbname
    JWT_SECRET=your_super_secret_jwt_key
    ```

## 🗄 Database Migration

This project uses **Drizzle ORM**. To push the schema changes to your database, run:

```bash
npm run db:push
```

## ▶️ Running the Server

To start the development server with hot-reloading (via Nodemailer):

```bash
npm run dev
```

> **Note:** If the `dev` script fails due to a path issue (e.g., cannot find `src/app.js`), update the `scripts` section in `package.json` to point to `app.js` in the root: `"dev": "nodemon app.js"`.

The server will typically start on `http://localhost:3000` (depending on your `PORT`).

## 📚 API Documentation

This project uses **Scalar** for API documentation. Once the server is running, you can access the interactive API reference at:

👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

This interface allows you to explore endpoints, view schemas, and test API requests directly from your browser.

## 📜 Available Scripts

- `npm run dev`: Starts the server in development mode.
- `npm run db:push`: Pushes the local Drizzle schema to the PostgreSQL database.
