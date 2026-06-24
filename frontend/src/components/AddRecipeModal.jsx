import { useEffect, useState } from 'react';
import './AddRecipeModal.css';

const DIFFICULTIES = ['Easy', 'Medium', 'Advanced'];

const EMPTY_FORM = {
  name: '',
  category: '',
  source: '',
  description: '',
  prepTime: '',
  bakeTime: '',
  yield: '',
  difficulty: 'Easy',
  tags: '',
};

export default function AddRecipeModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleField = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleListChange = (setter) => (index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addRow = (setter) => () => setter((prev) => [...prev, '']);

  const removeRow = (setter) => (index) =>
    setter((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

  const handleImage = (e) => {
    const file = e.target.files?.[0] || null;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanIngredients = ingredients.map((s) => s.trim()).filter(Boolean);
    const cleanInstructions = instructions.map((s) => s.trim()).filter(Boolean);
    const cleanTags = form.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!form.name.trim()) return setError('Please enter a recipe name.');
    if (!form.category.trim()) return setError('Please enter a category.');
    if (cleanIngredients.length === 0)
      return setError('Please add at least one ingredient.');
    if (cleanInstructions.length === 0)
      return setError('Please add at least one instruction.');

    const data = new FormData();
    data.append('name', form.name.trim());
    data.append('category', form.category.trim());
    data.append('source', form.source.trim());
    data.append('description', form.description.trim());
    data.append('prepTime', form.prepTime.trim());
    data.append('bakeTime', form.bakeTime.trim());
    data.append('yield', form.yield.trim());
    data.append('difficulty', form.difficulty);
    data.append('ingredients', JSON.stringify(cleanIngredients));
    data.append('instructions', JSON.stringify(cleanInstructions));
    data.append('tags', JSON.stringify(cleanTags));
    if (imageFile) data.append('image', imageFile);

    setSubmitting(true);
    try {
      const res = await fetch('/api/recipes', { method: 'POST', body: data });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to create recipe');
      }
      const created = await res.json();
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-recipe__overlay" onClick={onClose}>
      <div
        className="add-recipe"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add a recipe"
      >
        <button
          className="add-recipe__close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>

        <h2 className="add-recipe__title">Add a Recipe</h2>

        <form className="add-recipe__form" onSubmit={handleSubmit}>
          <div className="add-recipe__grid">
            <label className="add-recipe__field">
              <span>Name *</span>
              <input name="name" value={form.name} onChange={handleField} />
            </label>
            <label className="add-recipe__field">
              <span>Category *</span>
              <input
                name="category"
                value={form.category}
                onChange={handleField}
                placeholder="e.g. Cookies"
              />
            </label>
            <label className="add-recipe__field">
              <span>Source</span>
              <input name="source" value={form.source} onChange={handleField} />
            </label>
            <label className="add-recipe__field">
              <span>Difficulty</span>
              <select name="difficulty" value={form.difficulty} onChange={handleField}>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="add-recipe__field">
              <span>Prep time</span>
              <input name="prepTime" value={form.prepTime} onChange={handleField} placeholder="e.g. 15 min" />
            </label>
            <label className="add-recipe__field">
              <span>Bake time</span>
              <input name="bakeTime" value={form.bakeTime} onChange={handleField} placeholder="e.g. 25 min" />
            </label>
            <label className="add-recipe__field">
              <span>Yield</span>
              <input name="yield" value={form.yield} onChange={handleField} placeholder="e.g. 24 cookies" />
            </label>
          </div>

          <label className="add-recipe__field">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleField}
              rows={2}
            />
          </label>

          <div className="add-recipe__list-section">
            <span className="add-recipe__list-label">Ingredients *</span>
            {ingredients.map((value, i) => (
              <div className="add-recipe__list-row" key={i}>
                <input
                  value={value}
                  onChange={(e) => handleListChange(setIngredients)(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`}
                />
                <button
                  type="button"
                  className="add-recipe__row-remove"
                  onClick={() => removeRow(setIngredients)(i)}
                  aria-label="Remove ingredient"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-recipe__add-row" onClick={addRow(setIngredients)}>
              + Add ingredient
            </button>
          </div>

          <div className="add-recipe__list-section">
            <span className="add-recipe__list-label">Instructions *</span>
            {instructions.map((value, i) => (
              <div className="add-recipe__list-row" key={i}>
                <textarea
                  value={value}
                  onChange={(e) => handleListChange(setInstructions)(i, e.target.value)}
                  placeholder={`Step ${i + 1}`}
                  rows={2}
                />
                <button
                  type="button"
                  className="add-recipe__row-remove"
                  onClick={() => removeRow(setInstructions)(i)}
                  aria-label="Remove instruction"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-recipe__add-row" onClick={addRow(setInstructions)}>
              + Add step
            </button>
          </div>

          <label className="add-recipe__field">
            <span>Tags (comma separated)</span>
            <input name="tags" value={form.tags} onChange={handleField} placeholder="classic, dessert" />
          </label>

          <label className="add-recipe__field">
            <span>Picture</span>
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
          {imagePreview && (
            <img className="add-recipe__preview" src={imagePreview} alt="Preview" />
          )}

          {error && <div className="add-recipe__error">{error}</div>}

          <div className="add-recipe__actions">
            <button type="button" className="add-recipe__btn add-recipe__btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-recipe__btn" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
