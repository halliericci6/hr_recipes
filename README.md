# HR Recipes — Baking Inventory

A personal inventory of baking recipes from my cookbook collection. Browse, search, and filter recipes across cookies, breads, pastries, cakes, and more.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Data:** JSON file with sample baking recipes

## Getting Started

Install dependencies for both apps:

```bash
npm run install:all
```

Start the backend (port 3001) and frontend (port 5173) in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | List all recipes (supports `?search=`, `?category=`, `?difficulty=`, `?tag=`) |
| GET | `/api/recipes/:id` | Get a single recipe |
| GET | `/api/categories` | List all categories |
| GET | `/api/stats` | Recipe counts by category and difficulty |

## Sample Recipes

The inventory ships with 10 sample baking recipes:

- Classic Chocolate Chip Cookies
- Sourdough Country Loaf
- Banana Bread
- Fudgy Brownies
- Lemon Pound Cake
- Cinnamon Rolls
- French Macarons
- Blueberry Muffins
- Apple Pie
- Croissants
