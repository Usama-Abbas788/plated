# Plated

Plated is a React/Vite restaurant-management frontend. It currently uses mock data by default; no backend is required to run the UI.

## Development

```sh
npm install
npm run dev
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` to configure the data source. The default is `VITE_DATA_SOURCE=mock`.

## Project structure

- `src/pages/owner/` contains route-level screens.
- `src/components/atoms`, `molecules`, `organisms`, and `templates` contain shared UI, imported directly from component files.
- `src/stores/domain/` contains Zustand domain stores and shared store factories.
- `src/stores/` contains application-level stores.
- `src/data/mock/` contains the mock records and report/dashboard/settings fixtures.
- `src/services/api/` contains the HTTP client.
- `src/services/repositories/` selects mock or HTTP-backed data access.

Pages use stores; stores use repositories; repositories own data access. This keeps UI components independent of whether the data comes from the mock provider or a backend.

## Backend integration contract

Set `VITE_DATA_SOURCE=api` and configure `VITE_API_BASE_URL` when a backend is available. The current repository adapter expects JSON responses, either as the resource itself or wrapped in `{ "data": ... }`.

Collection endpoints currently used:

| Resource | Operations |
|---|---|
| `/products`, `/categories`, `/inventory`, `/employees`, `/roles`, `/orders`, `/payments` | `GET` list, `POST` create, `PATCH /:id` update, `DELETE /:id` remove |
| `/dashboard` | `GET` dashboard summary |
| `/reports?period=...` | `GET` report data for a period |
| `/settings` | `GET` settings, `PUT` updated settings |

Collection `GET` responses must be arrays or `{ "data": [] }`. Create/update responses should contain the saved record; settings, dashboard, and reports responses should contain their object or `{ "data": { ... } }`. Backend endpoints and payload shapes can be adjusted in `src/services/repositories/` without changing the page components.

Products reference categories by `categoryId` (a numeric ID in the mock data); category product counts are derived from products in the UI and are not submitted as category data. Customer-facing product records may also include `productType` (`"Food"` or `"Drink"`), an `ingredients` string array, and `sizes` entries shaped like `{ "id": "medium", "name": "Medium", "price": 2100 }`. Product `price` remains the lowest size price for summaries and sorting; product stock is shared across its sizes.

Orders may include an `items` array with `{ "productId": 1, "name": "...", "size": "Medium", "quantity": 1, "unitPrice": 2100 }` line items for order details. The UI also accepts `itemCount` (or a numeric `items` value) when itemization is unavailable. Order totals are displayed in PKR.

Refunding a completed payment changes its status to `Refunded` and updates the linked order's `paymentStatus`. The API integration should authorize both updates and ideally perform the refund and order-payment update atomically.

Reports are exported as a CSV file for the selected period, including summary metrics, sales data, and top products. The reports API should return those fields using the shapes in `src/data/mock/summaryData.js`.

The mock provider keeps changes in memory for the current page session; refreshing the browser restores the initial fixtures. The role chooser and route/action permission checks are frontend demo behavior only. Real authentication, server-side authorization, persistent storage, and a backend are not implemented yet.

## Demo access and authorization

The login screen provides role selection for the Owner, Manager, Cashier, Kitchen Staff, and Inventory Manager demo roles. Route access and sidebar links use each role's permission list. This is UI-only authorization for frontend review; it is not a secure login, does not persist across reloads, and must not replace backend authentication or server-side permission checks.

## Customer storefront

Customer order items now include the selected `size` and its `unitPrice`; the backend should verify both against the current product record.

The public storefront is available at `/`; the searchable, category-grouped full menu is at `/menu`; product details are at `/product/:productId`; the separate bag and checkout page is at `/bag`; staff can sign in at `/login`. The storefront category navigation follows the section currently in view. Customers can browse available products, view ingredients, choose an admin-managed size or drink volume, and add the selected priced option to the bag. The separate bag page supports quantity changes, removing items, clearing the bag, and submitting delivery contact details. The customer bag currently exists in browser memory and clears when the page is reloaded. Orders are submitted through `POST /orders` with customer, phone, address, order number, date, item (`productId`, `name`, `quantity`, `unitPrice`), item count, total, `paymentStatus: "Unpaid"`, and `status: "Pending"` fields. The backend must validate current product availability and prices when accepting an order. The customer bag currently exists in browser memory and clears when the page is reloaded.
