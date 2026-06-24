# Add Recipe Field — Reference

## File map

| Layer | Path |
|---|---|
| API + persistence | `backend/server.js` |
| Seed / runtime data | `backend/data/recipes.json` |
| Add form | `frontend/src/components/AddRecipeModal.jsx` + `.css` |
| Card display | `frontend/src/components/RecipeCard.jsx` + `.css` |
| Detail display | `frontend/src/components/RecipeDetail.jsx` + `.css` |
| Filters | `frontend/src/App.jsx`, `frontend/src/components/FilterBar.jsx` |
| Frontend fixtures | `frontend/src/test/fixtures.js` |
| Backend tests | `backend/server.test.js` |
| React conventions | `.cursor/rules/react-components.mdc` |

## POST handler location

`newRecipe` object: `backend/server.js` (~line 137).

## parseListField

Used for `ingredients`, `instructions`, `tags`. Accepts JSON string arrays or newline-separated strings. Reuse for new array fields.

## Display snippets (prepTime pattern)

**RecipeCard.jsx** — inside `recipe-card__times`:

```jsx
<span>Prep: {recipe.prepTime}</span>
```

**RecipeDetail.jsx** — inside `recipe-detail__info`:

```jsx
<span>{recipe.prepTime}</span>
```

## Search filter block

To include a field in text search, extend the `search` block in `GET /api/recipes`:

```js
if (search) {
  const q = search.toLowerCase();
  results = results.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      // add: r.newField.toLowerCase().includes(q)
  );
}
```

## Filter query param pattern

```js
if (difficulty) {
  results = results.filter(
    (r) => r.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
}
```

## App.jsx filter wiring

`filters` state drives `URLSearchParams` when calling `GET /api/recipes`. Mirror an existing param (e.g. `difficulty`) when adding a new one.
