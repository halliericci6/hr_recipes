import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AddRecipeModal from './AddRecipeModal';

describe('AddRecipeModal', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = vi.fn(() => 'blob:preview');
      global.URL.revokeObjectURL = vi.fn();
    }
  });

  afterEach(() => {
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('renders the form fields', () => {
    render(<AddRecipeModal onClose={vi.fn()} onCreated={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Add a recipe' })).toBeInTheDocument();
    expect(screen.getByText('Name *')).toBeInTheDocument();
    expect(screen.getByText('Ingredients *')).toBeInTheDocument();
    expect(screen.getByText('Instructions *')).toBeInTheDocument();
  });

  it('shows a validation error when required fields are empty', async () => {
    const onCreated = vi.fn();
    const user = userEvent.setup();
    render(<AddRecipeModal onClose={vi.fn()} onCreated={onCreated} />);

    await user.click(screen.getByRole('button', { name: 'Save Recipe' }));

    expect(await screen.findByText(/Please enter a recipe name/)).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it('submits and calls onCreated on success', async () => {
    const created = { id: 99, name: 'New Cake' };
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(created) })
    );
    const onCreated = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<AddRecipeModal onClose={onClose} onCreated={onCreated} />);

    await user.type(screen.getByText('Name *').parentElement.querySelector('input'), 'New Cake');
    await user.type(screen.getByText('Category *').parentElement.querySelector('input'), 'Cakes');
    await user.type(screen.getByPlaceholderText('Ingredient 1'), 'Flour');
    await user.type(screen.getByPlaceholderText('Step 1'), 'Bake it');

    await user.click(screen.getByRole('button', { name: 'Save Recipe' }));

    expect(global.fetch).toHaveBeenCalledWith('/api/recipes', expect.objectContaining({ method: 'POST' }));
    await vi.waitFor(() => expect(onCreated).toHaveBeenCalledWith(created));
  });
});
