import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RecipeGrid from './RecipeGrid';
import { mockRecipe } from '../test/fixtures';

describe('RecipeGrid', () => {
  it('shows empty state when no recipes match', () => {
    render(<RecipeGrid recipes={[]} onSelect={vi.fn()} />);
    expect(screen.getByText('No recipes match your filters.')).toBeInTheDocument();
  });

  it('renders a card for each recipe', () => {
    const recipes = [mockRecipe, { ...mockRecipe, id: 2, name: 'Banana Bread' }];
    render(<RecipeGrid recipes={recipes} onSelect={vi.fn()} />);

    expect(screen.getByText('Classic Chocolate Chip Cookies')).toBeInTheDocument();
    expect(screen.getByText('Banana Bread')).toBeInTheDocument();
  });

  it('calls onSelect when a recipe card is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<RecipeGrid recipes={[mockRecipe]} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /Classic Chocolate Chip Cookies/i }));

    expect(onSelect).toHaveBeenCalledWith(mockRecipe);
  });
});
