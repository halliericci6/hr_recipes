import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RecipeDetail from './RecipeDetail';
import { mockRecipe } from '../test/fixtures';

describe('RecipeDetail', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders recipe details in a dialog', () => {
    render(<RecipeDetail recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: mockRecipe.name })).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    mockRecipe.ingredients.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<RecipeDetail recipe={mockRecipe} onClose={onClose} />);
    await user.click(screen.getByLabelText('Close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<RecipeDetail recipe={mockRecipe} onClose={onClose} />);
    await user.click(document.querySelector('.recipe-detail__overlay'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<RecipeDetail recipe={mockRecipe} onClose={onClose} />);
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open', () => {
    const { unmount } = render(
      <RecipeDetail recipe={mockRecipe} onClose={vi.fn()} />
    );

    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
