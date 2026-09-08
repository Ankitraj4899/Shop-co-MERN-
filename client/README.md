# SHOP.CO MERN storefront

# SHOP.CO MERN storefront

The client is a React/Vite storefront backed by the Express API in the repository root. It includes customer shopping flows and a protected admin workspace.

## Run locally

From the repository root:

```bash
npm install
node server.js
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The API runs on `http://localhost:3000` and the client runs on `http://localhost:5173`.

## Features

- JWT authentication with HTTP-only cookies and bcrypt password hashing.
- Customer pages for home, categories, product details, cart, checkout, profile, orders, and order details.
- Debounced backend search, category filtering, price range, availability, sorting, and pagination.
- Server-side inventory validation, order totals, coupon validation, stock reduction, and cart clearing.
- Admin dashboard with product/category CRUD, inventory visibility, order status updates, and low-stock metrics.

## Inventory and coupons

Products with quantity `0` are out of stock. Products with quantity from `1` through `5` are considered low stock in the admin dashboard. The backend enforces quantity limits during cart updates and checkout, so client-side manipulation cannot bypass inventory validation.

The supported checkout coupons are `SAVE10` and `SAVE20`. The backend calculates the discount and final order total; the client only previews the values.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
