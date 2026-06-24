import RecipeCard from './RecipeCard';
import './RecipeGrid.css';

export default function RecipeGrid({ recipes, onSelect }) {
  if (recipes.length === 0) {
    return (
      <div className="recipe-grid__empty">
        <p>No recipes match your filters.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelect(recipe)}
        />
      ))}
    </div>
  );
}
