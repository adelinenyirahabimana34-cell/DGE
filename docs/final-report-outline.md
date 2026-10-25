# D&G E-Commerce Mobile Application — Final Academic Project Report Outline

**Institution:** College of Science & Technology / University of Rwanda  
**Program:** Computer Science / Software Engineering  
**Project Title:** Design and Implementation of a Mobile E-Commerce Solution for Rural and Semi-Urban Retail Businesses: A Case Study of D&G Retail Store, Rwamagana  
**Academic Year:** 2025 – 2026  
**Authors:** Final Year Engineering Project Team  

---

## Abstract

Retail businesses in semi-urban Rwandan towns such as Rwamagana often face challenges connecting with customers and tracking inventory efficiently due to reliance on physical walk-in sales and manual record-keeping. This project presents **D&G E-Commerce**, an end-to-end mobile retail platform developed with **React Native CLI (TypeScript)**, an **Express.js REST API**, and a cloud-hosted **Neon PostgreSQL** database. The system provides role-based experiences: a customer-facing interface for catalog discovery, real-time search, cart management, and order tracking formatted in Rwandan Francs (RWF); and a merchant-facing dashboard for real-time inventory management, order fulfillment, and sales analytics. Security is maintained through bcrypt password hashing and JSON Web Token (JWT) role authorization. Evaluation through automated and manual test suites confirmed 100% test pass rate across 42 scenarios, verifying robustness, usability, and data integrity.

---

## Table of Contents

1. **Chapter 1: Introduction**
   - 1.1 Background of the Study
   - 1.2 Problem Statement
   - 1.3 Objectives of the Project
     - 1.3.1 General Objective
     - 1.3.2 Specific Objectives
   - 1.4 Research Questions / Hypotheses
   - 1.5 Significance of the Study
   - 1.6 Scope and Delimitations
   - 1.7 Organization of the Report

2. **Chapter 2: Literature Review & Technological Framework**
   - 2.1 E-Commerce Adoption in Sub-Saharan Africa and Rwanda
   - 2.2 Comparative Analysis of Mobile Frameworks
     - 2.2.1 Native Android/iOS vs. Hybrid vs. Cross-Platform (React Native CLI vs. Flutter)
     - 2.2.2 Justification for Pure React Native CLI (over Expo) in Enterprise Settings
   - 2.3 Backend Architectures for Mobile Clients (REST vs. GraphQL)
   - 2.4 Cloud Relational Databases (Serverless PostgreSQL with Neon)
   - 2.5 Security in Mobile Commerce (JWT, Token Storage, Data Sanitization)

3. **Chapter 3: System Analysis and Requirements Engineering**
   - 3.1 Business Process Modeling (Current vs. Proposed System)
   - 3.2 Stakeholder Analysis
     - 3.2.1 Retail Clients / Consumers
     - 3.2.2 Store Managers / Merchants (Sellers)
     - 3.2.3 Logistics / Delivery Couriers
   - 3.3 Functional Requirements
     - 3.3.1 Authentication & Authorization Module
     - 3.3.2 Product Catalog & Search Module
     - 3.3.3 Shopping Cart & Checkout Module
     - 3.3.4 Order Processing & Delivery Tracking Module
     - 3.3.5 Merchant Inventory Management Module
     - 3.3.6 Business Intelligence & Sales Reporting Module
   - 3.4 Non-Functional Requirements
     - 3.4.1 Performance and Latency
     - 3.4.2 Usability and Offline-First Local Storage
     - 3.4.3 Security and Privacy
     - 3.4.4 Maintainability and Code Quality
   - 3.5 Use Case Modeling (Diagrams and Scenarios)

4. **Chapter 4: System Design and Architecture**
   - 4.1 High-Level System Architecture (Three-Tier Client-Server Architecture)
   - 4.2 Database Design & Data Modeling
     - 4.2.1 Entity-Relationship Diagram (ERD)
     - 4.2.2 Relational Schema & Data Dictionary:
       - `users` (id, name, email, password_hash, role, phone, address, created_at)
       - `categories` (id, name, description, icon)
       - `products` (id, seller_id, category_id, title, description, price, stock, image_url, created_at)
       - `orders` (id, client_id, total_amount, status, delivery_address, phone_number, notes, created_at)
       - `order_items` (id, order_id, product_id, quantity, unit_price, total_price)
     - 4.2.3 Database Normalization (3NF) and Integrity Constraints
   - 4.3 Mobile Application Component Architecture
     - 4.3.1 Navigation Flow (Auth Stack, Client Tabs, Seller Tabs)
     - 4.3.2 State Management Hierarchy (React Context API: `AuthContext`, `CartContext`)
     - 4.3.3 Persistent Storage Model (`AsyncStorage` serialization)
   - 4.4 REST API Endpoint Specification
     - 4.4.1 Authentication Endpoints (`/api/auth/*`)
     - 4.4.2 Products Endpoints (`/api/products/*`)
     - 4.4.3 Orders Endpoints (`/api/orders/*`)
     - 4.4.4 Analytics Endpoints (`/api/seller/*`)

5. **Chapter 5: Implementation and Development**
   - 5.1 Development Environment & Toolchain
     - React Native CLI v0.88.0, Node.js v24, TypeScript v5+, Android SDK 34
   - 5.2 Mobile Client Implementation
     - 5.2.1 Brand Identity & Design System (Green/White Rwandan Retail Theme)
     - 5.2.2 Reusable Atomic Components (`Button`, `Input`, `ProductCard`, `StatusBadge`, `LoadingView`, `ErrorView`)
     - 5.2.3 Client Screens Implementation (Home, Product Detail, Cart, Checkout, Orders, Tracking, Profile)
     - 5.2.4 Seller Screens Implementation (Dashboard, Inventory, Add/Edit Product, Order Management, Profile)
   - 5.3 Backend Server Implementation
     - 5.3.1 Express App Setup, CORS & Dotenv Configuration
     - 5.3.2 Connection Pooling with Neon Serverless PostgreSQL
     - 5.3.3 Authentication Middleware (`authenticateToken`, `requireRole`)
     - 5.3.4 Atomic Order Transaction Handling with SQL `BEGIN / COMMIT / ROLLBACK`
   - 5.4 Form Validation & Error Handling Strategies

6. **Chapter 6: Testing, Verification, and Validation**
   - 6.1 Testing Methodology (Unit, Integration, System, and Acceptance Testing)
   - 6.2 Test Environment Configuration
   - 6.3 Test Execution Matrix & Results Analysis (Refer to `docs/testing-report.md`)
   - 6.4 Usability Testing & User Feedback
   - 6.5 Performance Benchmarks (Bundle Size, Render Latency, Database Query Speed)

7. **Chapter 7: Discussion, Limitations, and Future Work**
   - 7.1 Key Findings and Achievements
   - 7.2 Encountered Challenges & Technical Solutions
   - 7.3 System Limitations
     - 7.3.1 Requirement for Live Internet Connectivity
     - 7.3.2 Manual Payment Confirmation (MOMO / Cash on Delivery vs. Automated Gateway)
   - 7.4 Recommendations for Future Enhancements
     - 7.4.1 Direct Integration with MTN Mobile Money / Airtel Money Open API
     - 7.4.2 Push Notifications via Firebase Cloud Messaging (FCM)
     - 7.4.3 Multi-Vendor Marketplace Expansion
     - 7.4.4 GPS Geolocation & Map Integration for Live Courier Tracking

8. **Chapter 8: Conclusion**
   - 8.1 Summary of Contributions
   - 8.2 Concluding Remarks

---

## References

1. Facebook Open Source. (2025). *React Native: A framework for building native apps using React.* Meta Platforms.
2. PostgreSQL Global Development Group. (2025). *PostgreSQL 16 Documentation.*
3. Neon Inc. (2025). *Serverless Postgres Architecture and Connection Pooling.*
4. Ministry of ICT and Innovation (MINICT), Rwanda. (2024). *National E-Commerce Strategy for Micro, Small and Medium Enterprises.*
5. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures.* Doctoral dissertation, University of California, Irvine.

---

## Appendices

- **Appendix A:** Complete Database Schema SQL Scripts
- **Appendix B:** API Documentation and Swagger/Postman Collection Export
- **Appendix C:** Sample Mobile Application Screenshots
- **Appendix D:** User Manual for Store Merchants and Customers
