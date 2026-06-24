import { useEffect } from 'react';
import './RecipeDetail.css';

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

export default function RecipeDetail({ recipe, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const icon = CATEGORY_ICONS[recipe.category] || '🧁';

  return (
    <div className="recipe-detail__overlay" onClick={onClose}>
      <div
        className="recipe-detail"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={recipe.name}
      >
        <button className="recipe-detail__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {recipe.image && (
          <img
            className="recipe-detail__image"
            src={recipe.image}
            alt={recipe.name}
          />
        )}

        <div className="recipe-detail__header">
          <span className="recipe-detail__icon" aria-hidden="true">{icon}</span>
          <div>
            <h2 className="recipe-detail__name">{recipe.name}</h2>
            <p className="recipe-detail__source">from {recipe.source}</p>
          </div>
        </div>

        <p className="recipe-detail__description">{recipe.description}</p>

        <div className="recipe-detail__info">
          <div className="recipe-detail__info-item">
            <span className="recipe-detail__info-label">Category</span>
            <span>{recipe.category}</span>
          </div>
          <div className="recipe-detail__info-item">
            <span className="recipe-detail__info-label">Difficulty</span>
            <span>{recipe.difficulty}</span>
          </div>
          <div className="recipe-detail__info-item">
            <span className="recipe-detail__info-label">Prep</span>
            <span>{recipe.prepTime}</span>
          </div>
          <div className="recipe-detail__info-item">
            <span className="recipe-detail__info-label">Bake</span>
            <span>{recipe.bakeTime}</span>
          </div>
          <div className="recipe-detail__info-item">
            <span className="recipe-detail__info-label">Yield</span>
            <span>{recipe.yield}</span>
          </div>
        </div>

        <div className="recipe-detail__columns">
          <div className="recipe-detail__section">
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="recipe-detail__section">
            <h3>Instructions</h3>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="recipe-detail__tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="recipe-detail__tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
