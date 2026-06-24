import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { mockRecipe, mockStats } from './test/fixtures';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function mockFetchSuccess() {
    global.fetch = vi.fn((url) => {
      if (String(url).includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(['Cookies', 'Bread']),
        });
      }
      if (String(url).includes('/api/stats')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStats),
        });
      }
      if (String(url).includes('/api/recipes')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockRecipe]),
        });
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });
  }

  it('loads and displays recipes', async () => {
    mockFetchSuccess();
    render(<App />);

    expect(screen.getByText('Loading recipes…')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Classic Chocolate Chip Cookies')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows error banner when recipe fetch fails', async () => {
    global.fetch = vi.fn((url) => {
      if (String(url).includes('/api/categories')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (String(url).includes('/api/stats')) {
        return Promise.reject(new Error('stats unavailable'));
      }
      return Promise.resolve({ ok: false });
    });

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(/Could not connect to the recipe server/)
      ).toBeInTheDocument();
    });
  });

  it('opens recipe detail modal when a card is selected', async () => {
    mockFetchSuccess();
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Classic Chocolate Chip Cookies')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Classic Chocolate Chip Cookies/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });
});
