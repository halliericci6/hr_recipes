---
name: add-recipe-field
description: Walks through adding a new recipe API field end-to-end in hr_recipes — backend POST handler, seed data, AddRecipeModal form, display components, fixtures, tests, and README. Use when adding, extending, or renaming recipe fields, updating the recipe schema, or wiring a new form input through the API.
---

# Add Recipe API Field

End-to-end workflow for a new recipe field in **hr_recipes** (Express + JSON backend, React frontend).

**Reference field:** `prepTime` — optional string, form input, displayed on cards/detail, persisted in JSON.

**Naming:** camelCase API keys (`prepTime`, `bakeTime`, `yield`). No ORM or migrations — schema lives in code + `backend/data/recipes.json`.

## Checklist

Copy and track progress:

```
- [ ] 1. Backend: accept field in POST handler (`backend/server.js`)
- [ ] 2. Seed data: add to sample recipes (`backend/data/recipes.json`)
- [ ] 3. Form: EMPTY_FORM, FormData append, JSX input (`AddRecipeModal.jsx`)
- [ ] 4. Display: card and/or detail views (if user-visible)
- [ ] 5. Fixtures: `frontend/src/test/fixtures.js`
- [ ] 6. Tests: backend POST + affected component tests
- [ ] 7. README: document field or new query param
- [ ] 8. Verify: `npm test` from repo root
```

---

## 1. Backend

**File:** `backend/server.js`

Add the field to the `newRecipe` object in `POST /api/recipes` (after required-field validation):

```js
prepTime: (body.prepTime || '').trim(),
```

| Field type | Pattern |
|---|---|
| Optional string | `(body.fieldName \|\| '').trim()` |
| Required string | trim, then `if (!field) missing.push('fieldName')` |
| Array (`ingredients`, `tags`) | `parseListField(body.fieldName).map(...).filter(Boolean)` |
| Enum with default | `(body.difficulty \|\| 'Easy').trim()` |
| File (`image`) | set from `req.file` after `upload.single('image')` |

**If required:** add to the `missing` array check (see `name`, `category`, `ingredients`, `instructions`).

**If filterable:** extend `GET /api/recipes` query handling (see `category`, `difficulty`, `tag` blocks).

**If searchable:** add to the `search` filter (currently scans `name`, `description`, `source`, `tags`).

---

## 2. Seed data

**File:** `backend/data/recipes.json`

Add the field to each recipe object. Match existing style:

```json
"prepTime": "15 min"
```

Backend tests snapshot/restore this file in `beforeEach`/`afterEach` — no separate backend fixture file.

---

## 3. Form

**File:** `frontend/src/components/AddRecipeModal.jsx`

Three touch points (mirror `prepTime`):

**a) `EMPTY_FORM`** — initial state:

```js
prepTime: '',
```

**b) `handleSubmit`** — append to FormData:

```js
data.append('prepTime', form.prepTime.trim());
```

**c) JSX** — labeled input in the form grid (`add-recipe__field`):

```jsx
<label className="add-recipe__field">
  <span>Prep time</span>
  <input name="prepTime" value={form.prepTime} onChange={handleField} placeholder="e.g. 15 min" />
</label>
```

| Field type | Form pattern |
|---|---|
| Optional string | `EMPTY_FORM` + `data.append` + `<input name="fieldName">` |
| Required string | client validation in `handleSubmit` + `*` in label |
| Array | separate state (`ingredients`) or comma-split (`tags`); `JSON.stringify` in FormData |
| Enum | `<select name="fieldName">` + constants array (see `DIFFICULTIES`) |
| File | `<input type="file">` + `data.append('image', file)` |

Follow BEM and modal a11y in `.cursor/rules/react-components.mdc`.

---

## 4. Display (if user-visible)

| Component | File | Notes |
|---|---|---|
| Card summary | `frontend/src/components/RecipeCard.jsx` | e.g. `recipe-card__times` |
| Detail view | `frontend/src/components/RecipeDetail.jsx` | e.g. `recipe-detail__info` grid |

Only add UI where the field belongs — not every field needs both card and detail.

---

## 5. Fixtures

**File:** `frontend/src/test/fixtures.js`

Add the field to `mockRecipe`:

```js
prepTime: '15 min',
```

Any test importing `mockRecipe` picks up the change automatically.

---

## 6. Tests

Run from repo root: `npm test`

### Backend — `backend/server.test.js`

Extend the POST success test with the new field:

```js
.field('prepTime', '15 min')
// ...
expect(res.body.prepTime).toBe('15 min');
```

For required fields, extend the 400 test. For new query filters, add GET filter tests (see `category`, `difficulty`, `tag` examples).

### Frontend

| File | When to update |
|---|---|
| `AddRecipeModal.test.jsx` | New label/input; submit flow |
| `RecipeCard.test.jsx` | Field shown on card |
| `RecipeDetail.test.jsx` | Field shown in detail |
| `FilterBar.test.jsx` | New filter control |
| `App.test.jsx` | New filter wired to fetch |

---

## 7. README

**File:** `README.md`

Update when the change affects public API surface:

- New **query param** on `GET /api/recipes` → add to the endpoints table (`?search=`, `?category=`, etc.)
- New **required field** on `POST /api/recipes` → note in API section
- User-facing concept worth documenting → brief mention under API or sample recipes

Optional fields like `prepTime` do not require README changes unless you add filtering/search.

---

## 8. Optional: filterable end-to-end

Only when the field should be filterable in the UI:

1. `backend/server.js` — query param handler in `GET /api/recipes`
2. `frontend/src/App.jsx` — `filters` state + `URLSearchParams` when fetching
3. `frontend/src/components/FilterBar.jsx` — new control
4. Tests in `FilterBar.test.jsx` and `backend/server.test.js`

`difficulty` is the existing recipe-field filter pattern.

---

## Worked example: `coolTime`

Hypothetical optional string field following `prepTime`:

| Step | Change |
|---|---|
| Backend | `coolTime: (body.coolTime \|\| '').trim()` in `newRecipe` |
| Seed | `"coolTime": "10 min"` in `recipes.json` |
| Form | `coolTime: ''`, `data.append('coolTime', ...)`, input in grid |
| Display | `<span>Cool: {recipe.coolTime}</span>` in `RecipeCard` / `RecipeDetail` |
| Fixtures | `coolTime: '10 min'` in `mockRecipe` |
| Tests | `.field('coolTime', '10 min')` + `expect(res.body.coolTime).toBe('10 min')` |

---

## Current schema quick reference

| Field | Type | Required on POST |
|---|---|---|
| `id` | number | auto (`max + 1`) |
| `name` | string | yes |
| `category` | string | yes |
| `ingredients` | string[] | yes |
| `instructions` | string[] | yes |
| `source`, `description` | string | no |
| `prepTime`, `bakeTime`, `yield` | string | no |
| `difficulty` | string | no (default `Easy`) |
| `tags` | string[] | no |
| `image` | string | no (upload only) |

For component CSS and modal patterns, see [reference.md](reference.md).
