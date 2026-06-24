import './FilterBar.css';

export default function FilterBar({ categories, filters, onFilterChange }) {
  const update = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ search: '', category: '', difficulty: '' });
  };

  const hasFilters = filters.search || filters.category || filters.difficulty;

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <input
          type="search"
          placeholder="Search recipes, sources, tags…"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          aria-label="Search recipes"
        />
      </div>
      <select
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={filters.difficulty}
        onChange={(e) => update('difficulty', e.target.value)}
        aria-label="Filter by difficulty"
      >
        <option value="">All difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Advanced">Advanced</option>
      </select>
      {hasFilters && (
        <button className="filter-bar__clear" onClick={clearFilters}>
          Clear filters
        </button>
      )}
    </div>
  );
}
