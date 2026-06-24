export const mockRecipe = {
  id: 1,
  name: 'Classic Chocolate Chip Cookies',
  category: 'Cookies',
  source: 'Toll House Original',
  description: 'Crispy edges, chewy centers, and plenty of chocolate chips.',
  ingredients: ['2 cups flour', '1 cup butter', '2 cups chocolate chips'],
  instructions: ['Mix ingredients.', 'Bake at 375°F.'],
  prepTime: '15 min',
  bakeTime: '11 min',
  yield: '48 cookies',
  difficulty: 'Easy',
  tags: ['classic', 'dessert'],
};

export const mockStats = {
  total: 10,
  byCategory: { Cookies: 2, Bread: 1, Cakes: 2 },
  byDifficulty: { Easy: 4, Medium: 3, Advanced: 3 },
};
