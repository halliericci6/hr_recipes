import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import RecipeGrid from './components/RecipeGrid';
import RecipeDetail from './components/RecipeDetail';
import AddRecipeModal from './components/AddRecipeModal';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMeta = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});

    fetch('/api/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  };

  useEffect(() => {
    loadMeta();
  }, []);

  const handleRecipeCreated = (recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
    loadMeta();
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);

    fetch(`/api/recipes?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load recipes');
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filters]);

  return (
    <div className="app">
      <Header onAddRecipe={() => setShowAddModal(true)} />
      {stats && <StatsBar stats={stats} />}
      <main className="main">
        <FilterBar
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />
        {error && (
          <div className="error-banner">
            Could not connect to the recipe server. Make sure the backend is
            running on port 3001.
          </div>
        )}
        {loading ? (
          <div className="loading">Loading recipes…</div>
        ) : (
          <RecipeGrid
            recipes={recipes}
            onSelect={setSelectedRecipe}
          />
        )}
      </main>
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
      {showAddModal && (
        <AddRecipeModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleRecipeCreated}
        />
      )}
    </div>
  );
}

export default App;
