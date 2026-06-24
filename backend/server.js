const express = require('express');
const cors = require('cors');
const recipes = require('./data/recipes.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/recipes', (req, res) => {
  const { category, difficulty, search, tag } = req.query;
  let results = [...recipes];

  if (category) {
    results = results.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (difficulty) {
    results = results.filter(
      (r) => r.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  if (tag) {
    results = results.filter((r) =>
      r.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id, 10));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

app.get('/api/categories', (_req, res) => {
  const categories = [...new Set(recipes.map((r) => r.category))].sort();
  res.json(categories);
});

app.get('/api/stats', (_req, res) => {
  const byCategory = recipes.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const byDifficulty = recipes.reduce((acc, r) => {
    acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
    return acc;
  }, {});

  res.json({
    total: recipes.length,
    byCategory,
    byDifficulty,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Baking recipe API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
