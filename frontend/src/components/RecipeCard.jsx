import './RecipeCard.css';

const CATEGORY_ICONS = {
  Cookies: '🍪',
  Bread: '🍞',
  'Quick Bread': '🍌',
  Bars: '🍫',
  Cakes: '🎂',
  Pastry: '🥐',
  Muffins: '🧁',
  Pies: '🥧',
};

const DIFFICULTY_CLASS = {
  Easy: 'easy',
  Medium: 'medium',
  Advanced: 'advanced',
};

export default function RecipeCard({ recipe, onClick }) {
  const icon = CATEGORY_ICONS[recipe.category] || '🧁';

  return (
    <article className="recipe-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      {recipe.image ? (
        <div className="recipe-card__image-wrap">
          <img className="recipe-card__image" src={recipe.image} alt={recipe.name} />
          <span className={`recipe-card__difficulty recipe-card__difficulty--${DIFFICULTY_CLASS[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>
      ) : (
        <div className="recipe-card__header">
          <span className="recipe-card__icon" aria-hidden="true">{icon}</span>
          <span className={`recipe-card__difficulty recipe-card__difficulty--${DIFFICULTY_CLASS[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>
      )}
      <h2 className="recipe-card__name">{recipe.name}</h2>
      <p className="recipe-card__description">{recipe.description}</p>
      <div className="recipe-card__meta">
        <span className="recipe-card__category">{recipe.category}</span>
        <span className="recipe-card__source">{recipe.source}</span>
      </div>
      <div className="recipe-card__times">
        <span>Prep: {recipe.prepTime}</span>
        <span>Bake: {recipe.bakeTime}</span>
        <span>{recipe.yield}</span>
      </div>
      <div className="recipe-card__tags">
        {recipe.tags.map((tag) => (
          <span key={tag} className="recipe-card__tag">{tag}</span>
        ))}
      </div>
    </article>
  );
}
