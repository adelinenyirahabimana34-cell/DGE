# D&G E-Commerce Mobile Application

[![React Native CLI](https://img.shields.io/badge/React%20Native%20CLI-0.88-61DAFB?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?logo=postgresql)](https://neon.tech)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-339933?logo=node.js)](https://nodejs.org)

An academic mobile e-commerce platform designed and built for **D&G Retail Store** located in **Rwamagana, Rwanda**. Built strictly using **React Native CLI (TypeScript)** without Expo, paired with an Express.js REST API and a live **Neon PostgreSQL** serverless cloud database.

---

## 🌟 Key Features & Architecture

### 🛍️ Product-First Welcome Screen (New Launch Flow)
- **Direct Catalog Launch**: When the app opens, users land directly on the **Home / Product Listing screen** — NOT a login or registration barrier.
- **Unauthenticated Browsing**: Anyone can browse products, search by keyword, view full details, and filter by categories:
  - 👗 **Clothes**
  - 👟 **Shoes**
  - 👜 **Bags**
  - 🍳 **Household Equipment**
  - 💍 **Jewellery**
  - 💄 **Cosmetics**
  - 🛒 **Groceries & Fresh Produce**
- **Guest Shopping Cart**: Guests can add items to their cart, adjust quantities, and have their cart safely preserved in `@dg_cart` (AsyncStorage) without being signed in.
- **Protected Checkout Flow**: When an unauthenticated shopper taps **"Proceed to Checkout"**, they are smoothly redirected to the Login screen with `returnTo: 'Checkout'`. Upon signing in, they are immediately returned to Checkout with their cart intact and customer details pre-filled.
- **Protected My Orders**: Guests tapping the "My Orders" tab are presented with a friendly sign-in prompt (`returnTo: 'Orders'`). Once authenticated, their order history and live delivery tracking are displayed.
- **Account & Seller Portal**: Unauthenticated visitors on the "Account" tab have options to Sign In, Create Account, or access the dedicated **Store & Seller Portal**.

### 📱 Client Bottom Tab Navigation
1. **Home**: Browse, search, filter categories, view product grid in Rwandan Francs (RWF).
2. **Cart**: Real-time quantity adjustments, price calculations, and checkout button (with active badge counter).
3. **My Orders**: Past orders and 4-step delivery tracking (`Pending` → `Confirmed` → `Shipped` → `Delivered`).
4. **Account**: Profile management, English/Kinyarwanda language toggle, order history shortcut, and logout (returns immediately to the public Home screen).

### 🏪 Seller (Store Admin) Experience
- **Strict Role Separation**: When logging in as a seller (`seller@dg.rw`), the navigation system automatically switches to the dedicated `SellerRoot` stack.
- **Merchant Analytics Dashboard**: Real-time KPIs for Total Orders, Total Revenue in RWF, Total Products, Total Stock, and recent orders.
- **Inventory Management**: View all catalog items with stock warning badges, real-time edit form, and item deletion.
- **Add Product**: Support for Title, Category chips, Price in RWF, Stock count, Description, and image URL preview.
- **Order Fulfillment**: Filter orders by status (`ALL`, `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`) and perform 1-tap status updates with customer delivery information.

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────┐
                    │     Android / iOS       │
                    │   React Native CLI App  │
                    │      (TypeScript)       │
                    └────────────┬────────────┘
                                 │ HTTP / JSON
                                 │ JWT Auth Header
                                 ▼
                    ┌─────────────────────────┐
                    │  Node.js / Express API  │
                    │    (Port 5000 / REST)   │
                    │  ├── /api/auth          │
                    │  ├── /api/products      │
                    │  ├── /api/orders        │
                    │  └── /api/seller        │
                    └────────────┬────────────┘
                                 │ SSL Connection Pool
                                 │ (pg library)
                                 ▼
                    ┌─────────────────────────┐
                    │   Neon PostgreSQL DB    │
                    │  (Cloud Serverless SQL) │
                    └─────────────────────────┘
```

---

## 🔑 Pre-Seeded Demo Accounts

You can test the application immediately using the pre-seeded credentials:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Seller** | `seller@dg.rw` | `seller123` | Store Dashboard, Inventory Management, Add/Edit/Delete Products, Order Fulfillment |
| **Client** | `client@dg.rw` | `client123` | Catalog Browsing, Search, Cart, Checkout, Order Tracking |

*New client accounts can also be registered directly from the app.*

---

## 📂 Project Structure

```
DGECommerce/
├── android/                   # Native Android project configuration
├── ios/                       # Native iOS project configuration
├── server/                    # Node.js / Express REST API
│   ├── middleware/            # JWT authentication & role checking
│   ├── routes/                # Express route controllers (auth, products, orders, seller)
│   ├── scripts/               # Category update and database migration utilities
│   ├── db.js                  # Neon PostgreSQL connection pool
│   ├── initDb.js              # Database schema migration & sample data seed script
│   ├── index.js               # Express application entry point
│   ├── package.json           # Server dependencies
│   └── .env                   # Database connection string and environment variables
├── src/                       # React Native application source code
│   ├── components/            # Reusable UI components (Button, Input, ProductCard, StatusBadge, etc.)
│   ├── constants/             # Colors, API endpoints, formatRWF utility
│   ├── context/               # React Context providers (AuthContext, CartContext)
│   ├── navigation/            # RootNavigator, ClientTabs, SellerTabs
│   ├── screens/
│   │   ├── auth/              # Login (with client/seller tabs), Register
│   │   ├── client/            # Home, ProductDetail, Cart, Checkout, Orders, OrderDetail, Profile
│   │   └── seller/            # SellerDashboard, SellerProducts, AddEditProduct, SellerOrders, SellerOrderDetail, SellerProfile
│   ├── services/              # Axios API service layer (authService, productService, orderService)
│   └── types/                 # TypeScript interfaces and data models
├── docs/
│   ├── screenshots/           # High-resolution screenshots from live Android emulator
│   ├── screenshot-guide.md    # Complete screenshot catalog and mapping
│   ├── testing-report.md      # Full 51-case testing report (100% pass)
│   └── final-report-outline.md# Complete academic report outline
├── App.tsx                    # Top-level application setup and providers
├── index.js                   # React Native app registry entry
└── package.json               # Mobile app dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0 or newer (tested on Node v24)
- **JDK**: Java Development Kit 17 or 21
- **Android Studio**: Android SDK (API Level 34) & Android Emulator configured

---

### Step 1: Start the Backend API

Open a terminal and start the Express REST API:

```bash
cd server
npm install
node index.js
```

The server connects to the live Neon PostgreSQL database and listens on `http://localhost:5000`.

*(Optional: Run `node scripts/updateCategories.js` in `server/` to refresh categories and seed items across Clothes, Shoes, Bags, Household, Jewellery, and Cosmetics).*

---

### Step 2: Start the Metro Bundler

In a second terminal window at the project root (`DGECommerce`):

```bash
npm start
```

---

### Step 3: Run the Application on Android

In a third terminal window at the project root:

```bash
npm run android
```

Metro will compile the JavaScript bundle and launch the app in your active Android emulator (`10.0.2.2:5000` is pre-configured to seamlessly route Android emulator traffic to host machine's port 5000).

---

## 🧪 Testing & Validation

The codebase has undergone comprehensive verification:
- **TypeScript Static Analysis**: `npx tsc --noEmit` completes with **0 errors**.
- **Metro Bundler Compilation**: Bundle generated successfully with **0 packaging errors**.
- **Test Matrix**: 51 comprehensive test cases across all guest, client, and seller workflows documented in [docs/testing-report.md](file:///c:/Users/user/Desktop/DGECommerce/docs/testing-report.md).
- **Screenshot Catalog**: 16 end-to-end verified workflow screenshots documented in [docs/screenshot-guide.md](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshot-guide.md).

---

## 📄 Academic Documentation

- Comprehensive Software Testing Report: [docs/testing-report.md](file:///c:/Users/user/Desktop/DGECommerce/docs/testing-report.md)
- Academic Screenshot Guide & Checklist: [docs/screenshot-guide.md](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshot-guide.md)
- Final Project Report Structure & Academic Outline: [docs/final-report-outline.md](file:///c:/Users/user/Desktop/DGECommerce/docs/final-report-outline.md)
