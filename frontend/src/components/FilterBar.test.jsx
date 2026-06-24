import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FilterBar from '../components/FilterBar';

describe('FilterBar', () => {
  const categories = ['Cookies', 'Bread', 'Cakes'];
  const defaultFilters = { search: '', category: '', difficulty: '' };

  it('renders search input and filter selects', () => {
    render(
      <FilterBar
        categories={categories}
        filters={defaultFilters}
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Search recipes')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by difficulty')).toBeInTheDocument();
  });

  it('lists all categories in the select', () => {
    render(
      <FilterBar
        categories={categories}
        filters={defaultFilters}
        onFilterChange={vi.fn()}
      />
    );

    categories.forEach((cat) => {
      expect(screen.getByRole('option', { name: cat })).toBeInTheDocument();
    });
  });

  it('calls onFilterChange when search input changes', () => {
    const onFilterChange = vi.fn();

    render(
      <FilterBar
        categories={categories}
        filters={defaultFilters}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Search recipes'), {
      target: { value: 'choc' },
    });

    expect(onFilterChange).toHaveBeenCalledWith({
      search: 'choc',
      category: '',
      difficulty: '',
    });
  });

  it('shows clear button when filters are active and clears them on click', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    const activeFilters = { search: 'banana', category: 'Bread', difficulty: '' };

    render(
      <FilterBar
        categories={categories}
        filters={activeFilters}
        onFilterChange={onFilterChange}
      />
    );

    const clearButton = screen.getByRole('button', { name: 'Clear filters' });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(onFilterChange).toHaveBeenCalledWith({
      search: '',
      category: '',
      difficulty: '',
    });
  });

  it('hides clear button when no filters are active', () => {
    render(
      <FilterBar
        categories={categories}
        filters={defaultFilters}
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });
});
