import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RecipeCard from './RecipeCard';
import { mockRecipe } from '../test/fixtures';

describe('RecipeCard', () => {
  it('renders recipe details', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={vi.fn()} />);

    expect(screen.getByText('Classic Chocolate Chip Cookies')).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Toll House Original')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    mockRecipe.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<RecipeCard recipe={mockRecipe} onClick={onClick} />);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter is pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<RecipeCard recipe={mockRecipe} onClick={onClick} />);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
