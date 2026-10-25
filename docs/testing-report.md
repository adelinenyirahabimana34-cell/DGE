# D&G E-Commerce — Software Testing Report

**Project:** D&G E-Commerce Mobile Application  
**Target Business:** D&G Retail Store, Rwamagana, Rwanda  
**Technology Stack:** React Native CLI (TypeScript), Node.js / Express REST API, Neon PostgreSQL  
**Date:** October 2026  
**Environment:** Android Emulator (API 34), Windows 11, Node.js v24  

---

## 1. Executive Summary

This testing report documents the verification and validation activities conducted on the D&G E-Commerce mobile application and its corresponding backend services. With the implementation of the **Product-First Welcome Screen architecture**, all core test cases across unauthenticated guest browsing, guest cart persistence, checkout authentication gating, client purchasing workflows, seller administration, and role separation have passed with zero fatal defects.

| Test Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|---|---|---|---|---|---|
| 1. Product-First Architecture & Guest Experience | 9 | 9 | 0 | 0 | 100% |
| 2. Authentication & Role Separation | 6 | 6 | 0 | 0 | 100% |
| 3. Client Product Browsing & Search | 5 | 5 | 0 | 0 | 100% |
| 4. Shopping Cart Management & Persistence | 5 | 5 | 0 | 0 | 100% |
| 5. Checkout & Order Placement | 5 | 5 | 0 | 0 | 100% |
| 6. Order Tracking & History | 4 | 4 | 0 | 0 | 100% |
| 7. Seller Inventory Management | 6 | 6 | 0 | 0 | 100% |
| 8. Seller Order Fulfillment | 4 | 4 | 0 | 0 | 100% |
| 9. Seller Dashboard & Analytics | 3 | 3 | 0 | 0 | 100% |
| 10. Database & Security Architecture | 4 | 4 | 0 | 0 | 100% |
| **Total** | **51** | **51** | **0** | **0** | **100%** |

---

## 2. Detailed Test Cases and Results

### Category 1: Product-First Architecture & Guest Experience

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **PFW-01** | App Launch to Public Catalog | 1. Launch app without stored auth token. | App opens directly to Home screen with D&G logo, search bar, category chips, and 2-column product grid. | Public catalog displayed immediately; no login barrier. | **PASS** |
| **PFW-02** | Guest Product Details View | 1. Tap product card as unauthenticated user. | Product details screen opens with image, description, stock status, and quantity picker. | Detail screen opens smoothly without requiring login. | **PASS** |
| **PFW-03** | Guest Add-to-Cart | 1. Select quantity.<br>2. Tap "Add to Cart" as guest. | Item added to CartContext `@dg_cart` in AsyncStorage; cart tab badge increments. | Badge displays item count; confirmation dialog shown. | **PASS** |
| **PFW-04** | Guest Cart Banner & Summary | 1. Navigate to Cart tab as guest. | Cart displays notice banner ("Shopping as Guest"), line items, and "Sign In & Checkout" button. | Banner and totals rendered correctly; CTA leads to auth. | **PASS** |
| **PFW-05** | Checkout Login Redirection | 1. Tap "Sign In & Checkout" in guest cart. | Navigates to Login screen with parameter `returnTo: 'Checkout'`. | Login screen opens with checkout notice badge. | **PASS** |
| **PFW-06** | Post-Login Return to Checkout | 1. Enter client credentials on Login screen.<br>2. Submit. | User is authenticated and returned directly to Checkout with cart items preserved and profile pre-filled. | Smooth navigation to Checkout with user info and cart intact. | **PASS** |
| **PFW-07** | Protected My Orders Tab for Guests | 1. Tap "My Orders" tab while logged out. | Displays friendly authentication prompt screen with "Sign In to View Orders" button (`returnTo: 'Orders'`). | Protected state shown cleanly with clear sign-in CTAs. | **PASS** |
| **PFW-08** | Guest Account Screen & Seller Portal | 1. Tap "Account" tab while logged out. | Shows guest welcome, Sign In, Create Account, and dedicated "Store & Seller Portal" card. | Prominent Seller Login portal accessible from Account tab. | **PASS** |
| **PFW-09** | Logout Return to Public Home | 1. Log out from Profile screen. | User token cleared; app navigates immediately to public Home catalog. | Returns directly to public catalog in guest state. | **PASS** |

---

### Category 2: Authentication & Authorization

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **AUTH-01** | Client Registration with Valid Data | 1. Open app -> Account -> Create Account.<br>2. Enter Name, Email, Password, Phone, Address.<br>3. Submit. | Account created in Neon DB with hashed password (`bcryptjs`), JWT token returned, auto logged in. | New client created and redirected to Client Home screen. | **PASS** |
| **AUTH-02** | Client Registration Validation | 1. Leave fields empty or enter invalid email.<br>2. Submit form. | Inline error messages displayed; network call blocked. | Required field warnings displayed; no invalid submissions. | **PASS** |
| **AUTH-03** | Client Login Success | 1. Enter `client@dg.rw` / `client123`.<br>2. Tap Login. | Authenticated successfully; token stored in AsyncStorage; routed to ClientTabs. | Client authenticated and redirected to ClientTabs. | **PASS** |
| **AUTH-04** | Seller Login Success | 1. Enter `seller@dg.rw` / `seller123`.<br>2. Tap Login. | Authenticated with role `seller`; routed to SellerTabs dashboard. | Seller authenticated and redirected to Seller Dashboard. | **PASS** |
| **AUTH-05** | Invalid Login Credentials | 1. Enter wrong password or unverified email.<br>2. Submit. | 401 Unauthorized returned from API; error message shown to user. | Alert: "Invalid email or password" displayed cleanly. | **PASS** |
| **AUTH-06** | Session Persistence | 1. Log in.<br>2. Restart/reload the application. | App checks AsyncStorage on startup; user session remains active. | User remains logged in without re-entering credentials. | **PASS** |

---

### Category 3: Client Product Browsing & Search

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **PROD-01** | Fetch & Display Products | 1. Open Client Home screen. | Products fetched from Neon DB via `GET /api/products`; rendered in responsive grid. | 14 seeded products rendered across Clothes, Shoes, Bags, Household, Jewellery, Cosmetics. | **PASS** |
| **PROD-02** | Category Filtering | 1. Tap category chip (e.g., "Clothes", "Shoes", "Bags"). | Only products matching selected category are shown. | Filtered list displayed instantaneously. | **PASS** |
| **PROD-03** | Real-Time Search | 1. Type "Kitenge" or "Leather" into search bar. | Live filtering by product title and description. | Products matching query rendered correctly. | **PASS** |
| **PROD-04** | Empty Search Results | 1. Type non-existent query (e.g., "xyz999"). | Friendly empty state displayed with prompt to clear filter. | "No products found" message and icon shown. | **PASS** |
| **PROD-05** | Product Detail View | 1. Tap any product card. | Full detail screen opens with large image, full description, stock status, and quantity picker. | Detail screen opens smoothly with accurate data. | **PASS** |

---

### Category 4: Shopping Cart Management & Persistence

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **CART-01** | Add Item to Cart | 1. Select qty 2 in detail screen.<br>2. Tap "Add to Cart". | Item added to CartContext; cart badge updates to 2; confirmation alert shown. | Cart badge shows count 2; stored in AsyncStorage. | **PASS** |
| **CART-02** | Prevent Over-Stock Quantity | 1. Attempt to add quantity exceeding product stock. | App restricts quantity up to `product.stock`. | Stepper button disabled at max stock limit. | **PASS** |
| **CART-03** | Update Item Quantity in Cart | 1. Go to Cart tab.<br>2. Tap `+` or `-` buttons on item. | Quantity updates; item subtotal and order total recalculated in RWF. | Totals recalculate immediately and accurately. | **PASS** |
| **CART-04** | Remove Item from Cart | 1. Tap trash icon or decrement qty to 0. | Item removed from cart list and storage. | Item removed; total updated accordingly. | **PASS** |
| **CART-05** | Cart Persistence across Restarts | 1. Add items to cart.<br>2. Close and re-open app. | Cart items restored from AsyncStorage `@dg_cart`. | Cart items intact upon app relaunch. | **PASS** |

---

### Category 5: Checkout & Order Placement

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **CHK-01** | Delivery Form Auto-fill | 1. Proceed to Checkout from Cart. | Client's saved phone and address pre-populated in input fields. | User's profile address & phone automatically filled. | **PASS** |
| **CHK-02** | Field Validation | 1. Clear phone or address.<br>2. Tap "Confirm Order". | Form validation flags empty required fields; prevents network call. | Inline errors displayed under missing fields. | **PASS** |
| **CHK-03** | Atomic Order Creation in DB | 1. Fill valid address & phone.<br>2. Confirm Order. | `POST /api/orders` initiates SQL transaction; creates `orders` record and multiple `order_items` records atomically. | Order # created in Neon DB; stock decremented. | **PASS** |
| **CHK-04** | Post-Checkout Cart Reset | 1. Complete order successfully. | Cart is cleared; user navigated to Order Success / Order Tracking screen. | Cart emptied; routed to Order Details screen. | **PASS** |
| **CHK-05** | Currency Integrity | 1. Review checkout summary. | All amounts formatted in Rwandan Francs (`formatRWF`) e.g., "28,000 RWF". | Currency format consistent across breakdown and total. | **PASS** |

---

### Category 6: Order Tracking & History

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **ORD-01** | Client Order List | 1. Navigate to Orders tab. | `GET /api/orders` fetches user's past orders; displays status badge and date. | Order cards listed in chronological order. | **PASS** |
| **ORD-02** | Order Status Progress Tracker | 1. Open order detail. | Visual progress bar shows active step (Pending -> Confirmed -> Shipped -> Delivered). | Correct step highlighted based on order status. | **PASS** |
| **ORD-03** | Order Item Breakdown | 1. View items section in Order Detail. | Displays product image, title, unit price, quantity, and line total. | All line items rendered matching purchase data. | **PASS** |
| **ORD-04** | Pull-to-Refresh Orders | 1. Pull down on Orders list. | Refreshes data from Neon DB with native spinner. | Updated status fetched and rendered. | **PASS** |

---

### Category 7: Seller Inventory Management

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **SEL-01** | Seller Products View | 1. Log in as seller.<br>2. Open Products tab. | Lists all store products with stock badge and price. | Inventory list rendered with edit & delete controls. | **PASS** |
| **SEL-02** | Add New Product Success | 1. Tap "+ Add New".<br>2. Fill Title, Category, Price, Stock, Image URL.<br>3. Submit. | `POST /api/products` inserts row into Neon DB; returns to list. | Product created and immediately visible in inventory. | **PASS** |
| **SEL-03** | Add Product Validation | 1. Submit with empty title or price <= 0. | Validation catches invalid inputs before sending request. | Alerts shown for missing title/invalid price. | **PASS** |
| **SEL-04** | Edit Existing Product | 1. Tap Edit on product.<br>2. Change price and stock.<br>3. Save. | `PUT /api/products/:id` updates record in Neon DB. | Updated price/stock reflected immediately. | **PASS** |
| **SEL-05** | Delete Product with Confirmation | 1. Tap Delete.<br>2. Alert asks for confirmation.<br>3. Confirm. | `DELETE /api/products/:id` removes record; removed from list. | Product deleted successfully. | **PASS** |
| **SEL-06** | Out-of-Stock Highlighting | 1. Set product stock to 0. | Product displays red "Out of stock" badge. | Visual warning badge rendered appropriately. | **PASS** |

---

### Category 8: Seller Order Fulfillment

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **FUL-01** | View All Customer Orders | 1. Open Seller Orders tab. | All orders placed by customers displayed with customer names & addresses. | Full order list rendered with customer info. | **PASS** |
| **FUL-02** | Status Filter Tabs | 1. Tap "Pending", "Confirmed", etc. | Filter orders by status category. | Orders filtered accordingly. | **PASS** |
| **FUL-03** | Update Order Status | 1. Open order detail.<br>2. Tap "Shipped" status button.<br>3. Confirm. | `PUT /api/orders/:id/status` updates status in DB; updates badge. | Status changed to "shipped"; customer view now reflects shipped. | **PASS** |
| **FUL-04** | Customer Delivery Details | 1. Inspect delivery card. | Displays phone number, full address, and special delivery notes. | Complete delivery details clearly accessible to courier. | **PASS** |

---

### Category 9: Seller Dashboard & Analytics

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **DASH-01** | Sales & Revenue Metrics | 1. Open Seller Dashboard. | `GET /api/seller/summary` computes total revenue, total orders, product count. | KPI cards display accurate totals calculated by PostgreSQL. | **PASS** |
| **DASH-02** | Status Breakdown Chips | 1. Inspect "Orders by Status" section. | Shows count for Pending, Confirmed, Shipped, Delivered. | Status breakdown counts match database queries. | **PASS** |
| **DASH-03** | Quick Action Shortcuts | 1. Tap "Add Product" or "Orders" quick buttons. | Navigates directly to target screen. | Immediate navigation to relevant screen. | **PASS** |

---

### Category 10: Database & Security Architecture

| Test ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **SEC-01** | Password Hashing | 1. Query `users` table directly. | Password stored as bcrypt hash (`$2a$10$...`); plaintext never saved. | Verified in PostgreSQL schema; passwords securely hashed. | **PASS** |
| **SEC-02** | JWT Role Enforcement | 1. Attempt seller mutation without token or with client token. | Server returns `403 Forbidden` (`requireRole('seller')`). | Unauthorized access prevented on sensitive endpoints. | **PASS** |
| **SEC-03** | Client Isolation | 1. Client calls `GET /api/orders`. | Query filters by `WHERE client_id = req.user.id`. | Client only receives their own order records. | **PASS** |
| **SEC-04** | Foreign Key Cascades & Stock Safety | 1. Place order with multiple items. | SQL transaction rolls back if item creation fails or stock is violated. | Atomic transaction guarantees database consistency. | **PASS** |

---

## 3. Conclusion & Recommendations

The testing cycle verified that all requirements specified in the project specification have been met. The system demonstrates:
- Seamless **Product-First catalog browsing** for guests with no forced login barrier.
- **Guest shopping cart preservation** in AsyncStorage (`@dg_cart`) through authentication and checkout.
- Clear **role separation** between shoppers and store administrators.
- High database reliability and atomic consistency on Neon PostgreSQL.
- Modern mobile UX tailored to the retail environment of Rwamagana, Rwanda.
