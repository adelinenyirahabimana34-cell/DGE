# D&G E-Commerce — Academic Submission Screenshot Guide & Checklist

This checklist outlines the screenshots captured directly from the live Android emulator (`emulator-5554`) for your final academic project report, presentation slides, and demonstration video.

---

## 📸 Updated Sequence: Product-First Welcome Architecture

The application now launches directly into the **Public Product Catalog (Home Screen)** without forcing the user to sign in or register first. Guests can browse, search, filter categories, and add items to cart freely. Authentication is requested only when placing an order or tracking account history.

| Screenshot Filename | Screen / State | Description & Key UI Elements |
|---|---|---|
| [`01_product_first_home.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/01_product_first_home.png) | **Public Home Catalog (App Launch)** | Launch screen: D&G logo, store header ("Rwamagana · Eastern Province"), search bar, category chips (Clothes, Shoes, Bags, Household Equipment, Jewellery, Cosmetics), responsive 2-column product grid with RWF pricing. |
| [`02_product_detail_guest.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/02_product_detail_guest.png) | **Guest Product Detail View** | High-res product photo (Kitenge African Print Dress), unit price in RWF (28,000 RWF), stock badge, quantity stepper, and "Add to Cart" button available without sign in. |
| [`03_added_to_cart_alert.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/03_added_to_cart_alert.png) | **Guest Add-to-Cart Confirmation** | Native confirmation modal confirming item added to guest cart with options to "Keep Shopping" or "View Cart". |
| [`04_guest_cart.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/04_guest_cart.png) | **Guest Shopping Cart** | Cart tab displaying guest notice banner (*"Shopping as Guest · Sign in required at checkout"*), item rows, quantity selectors, subtotal calculation, and "Sign In & Checkout" call to action. |
| [`05_checkout_login_redirect.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/05_checkout_login_redirect.png) | **Checkout Authentication Gate** | Login screen opened with `returnTo: 'Checkout'` parameter, informing user to sign in to finalize their delivery and payment. |
| [`06_returned_to_checkout.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/06_returned_to_checkout.png) | **Seamless Post-Login Checkout** | Automatically returned to Checkout screen with customer name, phone number, and Rwamagana delivery address pre-filled, cart intact. |
| [`07_order_placed_alert.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/07_order_placed_alert.png) | **Atomic Order Confirmation** | Success dialog with Order ID created directly in Neon PostgreSQL and cart reset. |
| [`08_order_detail_tracking.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/08_order_detail_tracking.png) | **Order Tracking Stepper** | 4-stage visual progress stepper (`Pending` → `Confirmed` → `Shipped` → `Delivered`), order breakdown, and delivery details. |
| [`09_tabs_home.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/09_tabs_home.png) | **Client Tab Navigation** | Public bottom tabs: Home, Cart, My Orders, Account. |
| [`10_client_orders_tab.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/10_client_orders_tab.png) | **Client Orders History** | Orders tab displaying past customer orders with real-time status badges. |
| [`11_client_profile_tab.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/11_client_profile_tab.png) | **Client Account Tab (English)** | Authenticated customer profile with initials avatar, order history shortcut, and bilingual language selector. |
| [`12_logout_confirm.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/12_logout_confirm.png) | **Sign Out Confirmation** | Modal confirming user sign-out. |
| [`13_after_logout_public_home.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/13_after_logout_public_home.png) | **Post-Logout Public Catalog** | Immediate redirect back to the public Home screen upon sign-out with empty guest state. |
| [`14_guest_account_screen.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/14_guest_account_screen.png) | **Guest Account & Seller Portal** | Account tab for unauthenticated guests showing "Sign In", "Create Account", and dedicated **"Store & Seller Portal"** card. |
| [`15_seller_login_screen.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/15_seller_login_screen.png) | **Store Seller Login Portal** | Dedicated Seller Login interface accessed from Account screen, pre-selecting the Store Seller tab. |
| [`16_seller_dashboard_live.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/16_seller_dashboard_live.png) | **Seller Administration Dashboard** | Live seller interface: Total Orders, Revenue (243,000 RWF), 14 products in catalog, 322 items in stock, and recent orders table. |

---

## 📸 Supplementary Screenshots Checklist

### 1. Additional Authentication & Registration
- [x] **Client Registration Form** — [`client_register.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/client_register.png)
  - Full Name, Email, Password, Phone Number, Delivery Address fields, validation error handlers.
- [x] **General Login Screen** — [`login_screen.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/login_screen.png)
  - Quick demo shortcuts for `client@dg.rw` and `seller@dg.rw`.

### 2. Localization (Kinyarwanda)
- [x] **Client Profile (Ikinyarwanda)** — [`client_profile_kinyarwanda.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/client_profile_kinyarwanda.png)
  - Complete localized interface in Kinyarwanda (`Ikinyarwanda`, `Komande zanjye`, `Sohoka`).

### 3. Seller Management & Inventory Workflows
- [x] **Seller Inventory List** — [`seller_products.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/seller_products.png)
  - Product stock badges, edit & delete buttons, filter by category.
- [x] **Add / Edit Product Form** — [`seller_add_product.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/seller_add_product.png)
  - Fields for Title, Category, RWF Price, Stock count, Description, and live Image preview.
- [x] **Seller Customer Orders List** — [`seller_orders.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/seller_orders.png)
  - Order filter tabs (`ALL`, `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- [x] **Order Fulfillment Status Change** — [`seller_order_detail.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/seller_order_detail.png) & [`seller_order_shipped.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/seller_order_shipped.png)
  - Status transition from `Confirmed` to `Shipped` updating both seller and client views.
- [x] **Seller Profile Tab** — [`seller_profile.png`](file:///c:/Users/user/Desktop/DGECommerce/docs/screenshots/seller_profile.png)
  - Store manager profile, role badge (`seller`), store contact info.

---

## 💡 How to Capture Future Screenshots on Android Emulator

1. **Via Windows Command Prompt / ADB:**
   ```cmd
   cmd /c "adb exec-out screencap -p > docs/screenshots/new_screen.png"
   ```
   *(Note: Running this command through `cmd /c` prevents PowerShell from corrupting the PNG header via UTF-16LE encoding).*

2. **Via Android Emulator Toolbar:**
   - Click the camera icon in the emulator right-hand control toolbar.
   - Move the saved image to `docs/screenshots/`.
