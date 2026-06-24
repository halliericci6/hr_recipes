import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsBar from './StatsBar';
import { mockStats } from '../test/fixtures';

describe('StatsBar', () => {
  it('renders total recipe count', () => {
    render(<StatsBar stats={mockStats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('recipes')).toBeInTheDocument();
  });

  it('renders category and difficulty breakdowns', () => {
    render(<StatsBar stats={mockStats} />);

    expect(screen.getByText(/Cookies/)).toBeInTheDocument();
    expect(screen.getByText(/Bread/)).toBeInTheDocument();
    expect(screen.getByText('Easy: 4')).toBeInTheDocument();
    expect(screen.getByText('Medium: 3')).toBeInTheDocument();
    expect(screen.getByText('Advanced: 3')).toBeInTheDocument();
  });
});
