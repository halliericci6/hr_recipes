const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_FILE = path.join(__dirname, 'data', 'recipes.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function loadRecipes() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveRecipes(recipes) {
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(recipes, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/recipes', (req, res) => {
  const { category, difficulty, search, tag } = req.query;
  let results = loadRecipes();

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
  const recipes = loadRecipes();
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id, 10));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

function parseListField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || value.trim() === '') return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON; fall back to newline splitting
  }
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

app.post('/api/recipes', upload.single('image'), (req, res) => {
  const body = req.body || {};
  const name = (body.name || '').trim();
  const category = (body.category || '').trim();
  const ingredients = parseListField(body.ingredients).map((s) => String(s).trim()).filter(Boolean);
  const instructions = parseListField(body.instructions).map((s) => String(s).trim()).filter(Boolean);

  const missing = [];
  if (!name) missing.push('name');
  if (!category) missing.push('category');
  if (ingredients.length === 0) missing.push('ingredients');
  if (instructions.length === 0) missing.push('instructions');

  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required field(s): ${missing.join(', ')}` });
  }

  const recipes = loadRecipes();
  const newId = recipes.reduce((max, r) => Math.max(max, r.id), 0) + 1;

  const newRecipe = {
    id: newId,
    name,
    category,
    source: (body.source || '').trim(),
    description: (body.description || '').trim(),
    ingredients,
    instructions,
    prepTime: (body.prepTime || '').trim(),
    bakeTime: (body.bakeTime || '').trim(),
    yield: (body.yield || '').trim(),
    difficulty: (body.difficulty || 'Easy').trim(),
    tags: parseListField(body.tags).map((s) => String(s).trim()).filter(Boolean),
  };

  if (req.file) {
    newRecipe.image = `/uploads/${req.file.filename}`;
  }

  recipes.push(newRecipe);
  saveRecipes(recipes);

  res.status(201).json(newRecipe);
});

app.get('/api/categories', (_req, res) => {
  const recipes = loadRecipes();
  const categories = [...new Set(recipes.map((r) => r.category))].sort();
  res.json(categories);
});

app.get('/api/stats', (_req, res) => {
  const recipes = loadRecipes();
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

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err?.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Baking recipe API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
