# Amazon Clone — Microservices E-Commerce Application

A **production-grade, full-stack Amazon-style e-commerce platform** built with a microservices architecture using **Node.js**, **Express**, **MongoDB**, and **React**.

---

## 🏗️ Architecture

```
amazon-clone/
├── shared/            → Common utilities (logger, JWT, error handling, rate limiter)
├── user-service/      → Auth, profiles, addresses            [Port 3001]
├── product-service/   → Products, categories, reviews        [Port 3002]
├── order-service/     → Cart, checkout, order tracking       [Port 3003]
├── payment-service/   → Payments, refunds, invoices          [Port 3004]
└── frontend/          → React + Vite SPA                     [Port 5173]
```

---

## 🚀 Features

### User Service
- ✅ Registration & Login with JWT
- ✅ Access & Refresh token management
- ✅ Password reset flow
- ✅ Role-based access (Admin / Customer)
- ✅ Profile & address management

### Product Service
- ✅ Product catalog with full-text search
- ✅ Category management
- ✅ Price, rating, and category filtering
- ✅ Product reviews & star ratings
- ✅ Image uploads (Multer)
- ✅ Inventory management

### Order Service
- ✅ Shopping cart (add, update, remove, clear)
- ✅ Checkout with stock verification
- ✅ Inter-service communication (Product + Payment)
- ✅ Order status machine (Pending → Confirmed → Shipped → Delivered)
- ✅ Stock rollback on payment failure or cancellation

### Payment Service
- ✅ Mock payment processing
- ✅ Refund processing
- ✅ Auto-generated invoice numbers
- ✅ Transaction history

### Frontend
- ✅ Amazon-style responsive UI
- ✅ Redux Toolkit state management
- ✅ 10 full pages with routing
- ✅ JWT auth with auto-refresh
- ✅ LocalStorage cart persistence
- ✅ Admin dashboard (products, categories, orders)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (Access + Refresh tokens) |
| Validation | Joi |
| Logging | Winston |
| Testing | Jest + Supertest |
| Uploads | Multer |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** running on `localhost:27017`

### 1. Install & Start All Services

```bash
# Clone the repo
git clone https://github.com/vkonga/amazon-clone.git
cd amazon-clone

# Install shared library
cd shared && npm install && cd ..

# Start each service in a separate terminal
cd user-service    && npm install && npm run dev   # → http://localhost:3001
cd product-service && npm install && npm run dev   # → http://localhost:3002
cd order-service   && npm install && npm run dev   # → http://localhost:3003
cd payment-service && npm install && npm run dev   # → http://localhost:3004

# Start frontend
cd frontend && npm install && npm run dev          # → http://localhost:5173
```

### 2. Environment Setup

Each service has a `.env.example` — copy it to `.env`:

```bash
# For each service:
cp user-service/.env.example user-service/.env
cp product-service/.env.example product-service/.env
cp order-service/.env.example order-service/.env
cp payment-service/.env.example payment-service/.env
```

### 3. First Steps

1. Open http://localhost:5173
2. Register an **Admin** account (set `role: "Admin"` via API or directly in MongoDB)
3. Login → navigate to **Admin Dashboard** (`/admin`)
4. Create **Categories** first
5. Add **Products**
6. Shop as a **Customer**!

---

## 📡 API Endpoints

### User Service (Port 3001)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/users/profile` | Get profile (auth) |
| PUT | `/api/users/profile` | Update profile (auth) |
| GET/POST | `/api/users/addresses` | Manage addresses (auth) |

### Product Service (Port 3002)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (search, filter, sort, paginate) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET/POST | `/api/categories` | Categories |
| GET/POST | `/api/products/:id/reviews` | Reviews |

### Order Service (Port 3003)
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/cart` | Get/add to cart |
| PUT | `/api/cart/items/:productId` | Update item qty |
| DELETE | `/api/cart/items/:productId` | Remove item |
| POST | `/api/orders` | Checkout & create order |
| GET | `/api/orders` | Get user orders |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Payment Service (Port 3004)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments` | Process payment |
| POST | `/api/payments/:id/refund` | Refund |
| GET | `/api/payments/history` | Transaction history |
| GET | `/api/payments/invoices/:orderId` | Get invoice |

---

## 🧪 Running Tests

```bash
cd user-service    && npm test
cd product-service && npm test
cd order-service   && npm test
cd payment-service && npm test
```

---

## 📁 Project Structure (each service)

```
service-name/
├── src/
│   ├── controllers/   → Route handlers
│   ├── services/      → Business logic
│   ├── repositories/  → Database abstraction
│   ├── routes/        → Express routers
│   ├── models/        → Mongoose schemas
│   ├── middleware/     → Auth, validation
│   ├── validators/    → Joi schemas
│   └── app.js         → Entry point
├── tests/             → Jest unit tests
├── .env.example       → Environment template
└── package.json
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT access tokens expire in **15 minutes**
- JWT refresh tokens expire in **7 days**
- Rate limiting on all endpoints
- Input validation on all routes with Joi
- `.env` files excluded from git

---

## 📝 License

MIT — feel free to use for learning and projects!
