# PROMPT FOR ANTIGRAVITY: D&G E-COMMERCE MOBILE APPLICATION

## 1. Project Overview

Act as an experienced React Native mobile application developer and help me build a cross-platform e-commerce mobile application called **D&G E-Commerce** for a retail business located in Rwamagana, Rwanda.

The application must run on both Android and iOS using **React Native CLI (Bare React Native), JavaScript or TypeScript, and NOT Expo**.

I am a student, so keep the project simple, understandable, well-organized, and easy to demonstrate during an academic project presentation.

Do not make the application unnecessarily large. Implement only the essential features required for a functional e-commerce system.

## 2. Mandatory Technical Requirements

Use the following technologies:

- React Native CLI, not Expo.
- TypeScript for application code.
- React Navigation for navigation.
- Axios or Fetch API for backend communication.
- React Context API for simple state management.
- React Native StyleSheet for styling.
- AsyncStorage for appropriate local persistence, such as the shopping cart.
- A suitable icon library compatible with React Native CLI.
- A compatible internationalization library only if multilingual support can be implemented simply.

Important restrictions:

1. Do not use Expo, Expo Go, `create-expo-app`, Expo Router, or Expo-specific packages.
2. Do not initialize an Expo project.
3. Do not use web technologies such as HTML, CSS, or browser-based React components to build the mobile interface.
4. Use native React Native components, including `View`, `Text`, `TextInput`, `Image`, `ScrollView`, `FlatList`, `TouchableOpacity`, and `Pressable`.
5. Ensure the project can be built and run using standard React Native CLI commands and native Android/iOS tooling.
6. Use compatible versions of all libraries.
7. Do not replace real backend integration with permanent mock data. Mock data may be used temporarily during development if the API is unavailable, but the application must be prepared for real API integration.

## 3. User Roles and Responsibilities

The application must have exactly two user roles.

### A. Client

The client is responsible for purchasing products.

Implement only these features:

1. **Register and log in:** Create an account, sign in, and log out.
2. **Browse products:** View available products, search by name, and filter by category.
3. **View product details:** See the product image, name, price in Rwandan francs (RWF), description, and available stock if provided by the API.
4. **Manage shopping cart:** Add products, change quantities, remove items, and view the total price.
5. **Place orders:** Enter the necessary delivery information and submit an order through the backend API.
6. **Track orders:** View previous orders and their current statuses, such as Pending, Confirmed, Shipped, and Delivered, where supported by the backend.

Clients must not access seller management screens or modify product listings.

### B. Seller

The seller is responsible for managing products and customer orders.

Implement only these features:

1. **Log in and log out:** Authenticate using the backend's supported seller authentication mechanism.
2. **Manage products:** View products, add a product, edit its information, and delete a product if the API supports these operations.
3. **Manage stock:** Enter or update product prices and available quantities when supported by the API.
4. **Manage orders:** View customer orders and update their statuses using the operations supported by the backend.
5. **View a simple sales summary:** Display the number of orders and total sales using reliable data returned by the API, if supported.

Sellers must not access client-only checkout functionality.

Do not create additional user roles, such as administrator, delivery agent, or warehouse manager.

## 4. Authentication and Access Control

Create a separate authentication module.

Required screens:

- Welcome screen.
- Login screen.
- Registration screen for clients.
- Forgot-password screen only if the backend supports password recovery.
- Role-based navigation for clients and sellers.

Requirements:

- Authenticate users through the provided backend API.
- Determine the user's role using trusted API responses, not a role value that the user can freely change in the interface.
- Display the appropriate screens based on the authenticated role.
- Prevent clients from accessing seller screens.
- Prevent sellers from accessing client checkout screens.
- Store authentication tokens securely using a suitable storage solution if tokens are issued by the API.
- Never hardcode real passwords, secret keys, or production credentials.
- Provide logout functionality and clear authentication state when logging out.
- Validate forms and display helpful error messages.

Do not invent backend authentication endpoints or assume that the API supports features it does not provide.

## 5. Main Screens

Keep the application focused on the following screens.

### Shared screens

- Welcome screen.
- Login screen.
- Registration screen for clients.
- Forgot-password screen, if supported.

### Client screens

- Home/Product Listing.
- Product Details.
- Shopping Cart.
- Checkout.
- My Orders.
- Order Details/Tracking.
- Profile/Logout.

### Seller screens

- Seller Dashboard.
- Product Management.
- Add/Edit Product.
- Customer Orders.
- Order Details.
- Simple Sales Summary, if supported.
- Profile/Logout.

Use bottom-tab navigation for the main client screens and a simple navigation structure for the seller screens. Use a stack navigator for details and forms.

Keep the number of screens and navigation complexity reasonable.

## 6. User Interface and Design

Create a clean, modern, professional mobile interface suitable for a small Rwandan retail business.

Design requirements:

- Application name: D&G E-Commerce.
- Use a consistent color palette, such as dark green, white, and light grey, with a restrained accent color.
- Create a professional logo area displaying D&G.
- Use product cards with images, names, and prices.
- Use clear buttons, readable text, appropriate spacing, and consistent styling.
- Make forms simple and user-friendly.
- Display loading indicators when retrieving data.
- Display useful messages when a request fails or no products are available.
- Show confirmation messages for important actions.
- Support Android and iOS screen sizes.
- Avoid unnecessary animations, complicated dashboards, and excessive decorative elements.

The client home screen should prioritize product browsing. The seller dashboard should prioritize product management and customer orders.

## 7. Backend API Integration

A backend API has already been provided for this project.

Before implementing API calls, inspect the existing project files and identify the API documentation, base URL, authentication mechanism, available endpoints, request formats, response formats, and supported operations.

If I provide the API URL or documentation, use it as the source of truth.

Create a centralized API service, for example:

`src/services/api.ts`

Organize API functions into manageable modules, such as:

- `authService.ts`
- `productService.ts`
- `orderService.ts`

Integrate the following capabilities when supported by the actual API:

- Client registration and login.
- Seller login.
- Product listing and product details.
- Product searching and category filtering.
- Product creation, updating, and deletion.
- Shopping order submission.
- Customer order history.
- Order details and status updates.
- Sales summaries.

Requirements:

- Use the actual endpoint paths and HTTP methods defined by the backend.
- Configure the API base URL in one place.
- Handle loading, successful responses, validation errors, authentication failures, server errors, and network failures.
- Avoid duplicating API request logic throughout the application.
- Use environment configuration where appropriate.
- Do not expose private credentials or production secrets in source code.
- Do not assume that the backend supports a feature without checking its documentation or responses.

If an endpoint is missing or the API is unavailable, clearly identify the limitation and implement the rest of the application without pretending that the unavailable operation works.

## 8. Shopping Cart and Checkout

Implement a simple shopping cart.

The cart must allow clients to:

- Add products.
- Increase or decrease quantities.
- Remove products.
- View item prices and subtotals.
- View the total cost.
- Proceed to checkout.

Checkout should collect only the information required by the backend, such as the customer's name, phone number, and delivery address.

Calculate the total from product prices and quantities. Revalidate prices and stock with the backend where supported. The backend must remain authoritative for final order totals and order creation.

Do not implement payment gateway integration unless one is explicitly provided. If online payments are not supported, implement order submission according to the backend's supported payment or order workflow.

## 9. Language Support

Prepare the application for English and Kinyarwanda if this can be implemented without unnecessary complexity.

Provide a simple language switch in the interface and translate the main navigation labels, buttons, and common messages.

Do not translate product information returned by the backend automatically unless an appropriate translation mechanism is available.

If full multilingual support is too large for the first implementation, structure the application so it can be added later.

## 10. Testing and Error Handling

Test the essential workflows.

Client tests:

- Register and log in.
- Browse and search products.
- View product details.
- Add and remove cart items.
- Change quantities and calculate totals.
- Submit an order.
- View order history and status.

Seller tests:

- Log in as a seller.
- View and manage products.
- Update product information.
- View customer orders.
- Update order status.
- View sales information when supported.

Security and reliability tests:

- Invalid login credentials.
- Empty required fields.
- Network failure.
- Expired or invalid authentication token.
- Client attempting to access seller functionality.
- Seller attempting to access client checkout.
- Empty product listings.
- Insufficient stock, where supported.

Create a simple testing report documenting the test case, expected result, actual result, and pass/fail status.

## 11. Project Structure

Organize the source code clearly. Use a structure similar to the following, adapting it to the existing React Native CLI project:

src/
- components/
- screens/
  - auth/
  - client/
  - seller/
- navigation/
- services/
- context/
- hooks/
- types/
- utils/
- constants/
- localization/

Keep components reusable and functions small. Use TypeScript interfaces or types for products, users, cart items, and orders.

Avoid putting the entire application into one file.

## 12. Development Workflow

Work step by step instead of generating the entire application in one large, unverified change.

### Step 1: Inspect the project

- Inspect the current directory and existing files.
- Determine whether a React Native CLI project already exists.
- Preserve useful existing work.
- Check the installed Node.js, React Native, Android, and iOS tooling where possible.
- Identify the provided backend API documentation and configuration.
- Do not overwrite an existing project unnecessarily.

### Step 2: Set up the application

- Initialize a bare React Native CLI project only if a suitable project does not already exist.
- Use TypeScript.
- Install only the necessary, compatible dependencies.
- Configure React Navigation and the native project correctly.
- Provide the exact commands needed to install and run the application.

### Step 3: Implement authentication

- Build login and client registration screens.
- Integrate the available authentication endpoints.
- Add role-based navigation.
- Test the authentication flow before proceeding.

### Step 4: Implement product browsing

- Connect the product listing to the backend.
- Build product cards and product details.
- Add search and category filtering.

### Step 5: Implement the client shopping flow

- Build cart management.
- Implement checkout and order submission.
- Display order history and tracking information.

### Step 6: Implement seller functionality

- Build the seller dashboard.
- Implement product management.
- Implement order management.
- Add a simple sales summary if the API supports it.

### Step 7: Improve and test

- Add loading states, validation, error messages, and empty states.
- Check navigation and access control.
- Test on an Android emulator or physical device.
- Prepare iOS configuration and testing instructions.

### Step 8: Document the project

Provide a README containing:

- Project description.
- Technologies used.
- Prerequisites.
- Installation instructions.
- Backend API configuration.
- Android run instructions.
- iOS run instructions.
- Application features.
- Testing instructions.
- Known limitations.

Also prepare a concise final project report outline and a checklist of screenshots to capture for submission.

After every major step, summarize the files created or modified, explain what has been implemented in simple English, and provide the command to test the result.

## 13. Important Rules

- Use React Native CLI only; Expo is strictly prohibited.
- Keep the project small and appropriate for a student assignment.
- Implement the two roles with clear, limited responsibilities.
- Prioritize a working application over unnecessary advanced features.
- Use the provided backend API instead of inventing a different backend.
- Do not claim a feature works unless it has been implemented and tested.
- Do not delete existing project files without a clear reason.
- Do not install unnecessary libraries.
- Do not generate large amounts of code before inspecting the project and API.
- If essential information is missing, ask me a specific question instead of making major assumptions.
- Explain important commands and errors in simple English so I can learn and maintain the project myself.

## 14. Expected Deliverables

At completion, provide:

1. A working React Native CLI mobile application for Android and iOS.
2. Client and seller authentication flows.
3. Client product browsing, search, cart, checkout, and order tracking.
4. Seller product and order management.
5. Integration with the provided backend API.
6. Appropriate validation and error handling.
7. A testing report.
8. Screenshots of the major screens.
9. Source code organized into clear modules.
10. Technical documentation and a final report outline.

**Start with Step 1: inspect my current project and the provided backend API. Do not use Expo or generate the entire application at once. Tell me what you find and what needs to be done next.**

postgresql://neondb_owner:npg_iGRo86zxKFbc@ep-nameless-sunset-b4acvha3-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

