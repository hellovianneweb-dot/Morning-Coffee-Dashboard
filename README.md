# Morning Coffee & Tea : Admin Dashboard

## Setup

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

---

## Pages

- `/` — Order Tracking
- `/inventory` — Inventory Overview
- `/suppliers` — Supplier List
- `/reports` — Report Summary

---

## Main Files

### Components

- `src/components/layout/AppSidebar.vue`
- `src/components/layout/AppHeader.vue`
- `src/components/layout/header/SearchBar.vue`

### Views

Located in:

```txt
src/views/MorningCoffee/
```

- `OrderTracking.vue`
- `InventoryOverview.vue`
- `SupplierList.vue`
- `ReportSummary.vue`

### Config

- `src/router/index.ts`
- `src/composables/useSidebar.ts`

### Styles

- `src/assets/main.css`

---

## Stack

- Vue 3
- Vite
- CSS
- Vue Router
- TypeScript

---

## Troubleshooting

If the project does not run:

```bash
npm install
npm run dev
```

If dependencies are broken:

```bash
rm -rf node_modules
npm install
npm run dev
```

Node.js 18+ recommended.
