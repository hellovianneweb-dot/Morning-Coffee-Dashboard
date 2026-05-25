# Morning Coffee & Tea :Dashboard

## Project Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open in browser:

```txt
http://localhost:5173
```

---

## Sitemap

### Pages

- `/` — Order Tracking
- `/inventory` — Inventory
- `/suppliers` — Suppliers
- `/reports` — Reports

---

## Components

- `src/components/layout/AppSidebar.vue` — Sidebar navigation
- `src/components/layout/AppHeader.vue` — Top header bar

---

## Views

- `src/views/MorningCoffee/` — Main dashboard views

---

## Assets

- `src/assets/main.css` — Global styles

---

## Config

- `src/router/index.ts` — Route definitions
- `src/composables/useSidebar.ts` — Sidebar state

---

## Tech Stack

- Vue 3
- Vite
- Tailwind CSS
- Vue Router

---

## Troubleshooting

If the project does not load:

```bash
rm -rf node_modules
npm install
npm run dev
```

Make sure Node.js version is 18 or higher.