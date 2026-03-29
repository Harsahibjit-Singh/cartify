# Cartify 🛒 | Flipkart-Inspired Full-Stack E-Commerce

🔗 # **Live Demo:** https://cartify-beryl.vercel.app

Cartify is a high-fidelity, full-stack e-commerce web application designed to replicate the core user experience and UI patterns of Flipkart. This project was built from the ground up to demonstrate proficiency in complex state management, relational database architecture, and custom authentication flows.

## 🚀 Tech Stack

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
* **State Management:** TanStack Query (React Query)
* **Backend:** Next.js Route Handlers (RESTful APIs), Node.js
* **Database:** Supabase (PostgreSQL)
* **Authentication:** Custom JWT (JSON Web Tokens) via HTTP-only cookies, Bcrypt
* **Utilities:** Nodemailer (Order Confirmation Emails)

---

## ✨ Exhaustive Feature List

### 1. Dynamic Home & Product Listing (PLP)
* **Smart Layout Switching:** The homepage uses a dynamic layout. By default, it acts as a "Dashboard" with promotional banners and horizontal scrolling deal sliders. If a user searches or clicks a category, it instantly transforms into a CSS Grid-based Product Listing Page.
* **URL-Driven Search:** The Navbar search bar updates the URL parameters (`/?search=term`). The homepage listens to these parameters to filter products globally.
* **Category Filtering:** Users can filter the grid by specific product categories.
* **Empty States:** Custom "No Results Found" UI that matches Flipkart's exact visual design.

### 2. Product Detail Page (PDP)
* **Interactive Media:** Image carousel with vertical thumbnail navigation.
* **Dynamic Pricing:** Real-time calculation of discount percentages based on original vs. selling price.
* **Dual Call-to-Actions:** * **Add to Cart:** Drops the item into the cart and updates global state.
  * **Buy Now:** Skips the cart entirely and drops the user directly into the checkout flow.
* **Wishlist Integration:** Flipkart-style "Heart" icon that toggles the item in the database and updates the Navbar counter instantly.

### 3. Global Cart & Wishlist System
* **React Query Caching:** Cart and Wishlist counts in the Navbar are bound to the React Query cache. When an item is added on the Product page, the Navbar badges update instantly without a page refresh.
* **Real-time Cart Updates:** Users can increment/decrement quantities or remove items. The "Price Details" sidebar recalculates totals, discounts, and delivery charges instantly.

### 4. Checkout & Order Flow
* **Multi-Step Accordion Checkout:** Replicates Flipkart's 4-step checkout process (Login -> Delivery Address -> Order Summary -> Payment Options).
* **Transactional Integrity:** Placing an order creates an entry in the `orders` table, moves items to `order_items` (preserving the `price_at_time`), and clears the user's `cart_items` in a synchronized flow.
* **Email Notifications:** Integrated Nodemailer to automatically send an HTML-formatted "Order Confirmed" email to the user upon successful checkout.

### 5. Custom Authentication
* **Dedicated Profiles Table:** Bypassed standard BaaS auth to build a custom `profiles` table with `bcrypt` password hashing to avoid naming collisions and demonstrate backend security fundamentals.
* **Protected Routes:** API routes use a centralized `getAuthUserId()` helper to decode JWTs and ensure users can only modify their own cart, orders, and wishlist.

---

## 🧠 Architectural Decisions & Assumptions

To keep the project scope manageable while maximizing UI fidelity, I made several deliberate engineering decisions:

1. **Placeholders & Dummy Data (UI Fidelity):**
   * *Why:* Flipkart's UI relies heavily on curated promotional banners and top-level category icons.
   * *Implementation:* I hardcoded dummy image arrays for the Hero Banners and Category Strip. This allowed me to achieve the dense, rich look of a real e-commerce site without needing to build a complex, admin-facing Content Management System (CMS).
2. **Simplified Payment Gateway:**
   * *Why:* Integrating Stripe or Razorpay introduces third-party webhook complexity that distracts from core full-stack mechanics.
   * *Implementation:* The checkout process locks the user into "Cash on Delivery" (COD). The focus is placed entirely on relational database updates and UI state management rather than payment processing.
3. **Database Schema (Price History):**
   * *Why:* Product prices change over time. If an order relies on the `products` table for its price, past orders would suddenly display the wrong totals.
   * *Implementation:* I created an `order_items` table with a specific `price_at_time` column. This preserves the historical financial record of the transaction.
4. **Unique Constraints (Data Integrity):**
   * *Why:* A user double-clicking "Add to Wishlist" could cause duplicate database rows and UI bugs.
   * *Implementation:* I enforced a composite `UNIQUE(user_id, product_id)` constraint directly in PostgreSQL so the database automatically rejects duplicates, keeping the frontend clean.

---

## 🤖 AI Workflow Note

**This application does not feature integrated AI tools.** However, I utilized AI (LLMs) as a pair-programming partner during the development lifecycle. As the sole developer, I was responsible for the core architecture: designing the PostgreSQL schema, structuring the JWT auth flow, and implementing the complex React Query cache invalidation logic. 

I leveraged AI to accelerate boilerplate generation (like Tailwind CSS styling and dummy data creation) and to assist in debugging syntax. This modern development workflow allowed me to execute a high-fidelity, feature-dense clone in a highly compressed timeframe.

---

## 🛠️ Local Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Harsahibjit-Singh/cartify.git
   cd cartify
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables:**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_custom_jwt_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   \`\`\`

4. **Set up the Database:**
   Run the provided SQL setup scripts in your Supabase SQL Editor to generate the `profiles`, `products`, `cart_items`, `wishlist`, `orders`, and `order_items` tables.

5. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.