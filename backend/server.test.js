const request = require('supertest');
const app = require('./server');
const recipes = require('./data/recipes.json');

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/recipes', () => {
  it('returns all recipes when no filters are applied', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(recipes.length);
  });

  it('filters by category (case-insensitive)', async () => {
    const res = await request(app).get('/api/recipes?category=cookies');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((r) => {
      expect(r.category.toLowerCase()).toBe('cookies');
    });
  });

  it('filters by difficulty (case-insensitive)', async () => {
    const res = await request(app).get('/api/recipes?difficulty=easy');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((r) => {
      expect(r.difficulty.toLowerCase()).toBe('easy');
    });
  });

  it('filters by tag (case-insensitive)', async () => {
    const res = await request(app).get('/api/recipes?tag=classic');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((r) => {
      expect(r.tags.some((t) => t.toLowerCase() === 'classic')).toBe(true);
    });
  });

  it('filters by search across name, description, source, and tags', async () => {
    const res = await request(app).get('/api/recipes?search=chocolate');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((r) => {
      const q = 'chocolate';
      const matches =
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      expect(matches).toBe(true);
    });
  });

  it('applies combined filters', async () => {
    const res = await request(app).get(
      '/api/recipes?category=Cookies&difficulty=Easy'
    );
    expect(res.status).toBe(200);
    res.body.forEach((r) => {
      expect(r.category).toBe('Cookies');
      expect(r.difficulty).toBe('Easy');
    });
  });

  it('returns empty array when no recipes match', async () => {
    const res = await request(app).get('/api/recipes?search=xyznonexistent');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/recipes/:id', () => {
  it('returns a recipe by id', async () => {
    const res = await request(app).get('/api/recipes/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Classic Chocolate Chip Cookies');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/recipes/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Recipe not found' });
  });
});

describe('GET /api/categories', () => {
  it('returns unique sorted categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    const expected = [...new Set(recipes.map((r) => r.category))].sort();
    expect(res.body).toEqual(expected);
  });
});

describe('GET /api/stats', () => {
  it('returns correct aggregate stats', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(recipes.length);

    const byCategory = recipes.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
    expect(res.body.byCategory).toEqual(byCategory);

    const byDifficulty = recipes.reduce((acc, r) => {
      acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
      return acc;
    }, {});
    expect(res.body.byDifficulty).toEqual(byDifficulty);
  });
});
