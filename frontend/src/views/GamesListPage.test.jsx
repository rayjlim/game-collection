import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import useSearchGames from '../hooks/useSearchGames';
import GamesListPage from './GamesListPage';

// Mock the hooks and components
const mockHookData = {
  loadGames: vi.fn(),
  handlePageClick: vi.fn(),
  searchLetter: vi.fn(),
  clearFields: vi.fn(),
  changeTitle: vi.fn(),
  removeDuplicates: vi.fn(),
  isLoading: false,
  games: [],
  page: 1,
  pageMeta: {
    current_page: 1,
    last_page: 1,
    total: 0
  }
};

vi.mock('../hooks/useSearchGames', () => ({
  default: vi.fn(() => mockHookData)
}));

vi.mock('../components/Game', () => ({
  default: () => <div data-testid="game-component">Game Component</div>
}));

vi.mock('../components/PaginationBar', () => ({
  default: () => <div>Pagination</div>
}));

vi.mock('../components/PnForm', () => ({
  default: () => <div>PnForm</div>
}));

vi.mock('../components/TagList', () => ({
  default: () => <div>TagList</div>
}));

vi.mock('../components/SearchForm', () => ({
  default: () => <div>SearchForm</div>
}));

describe('GamesListPage', () => {
  it('renders main heading', () => {
    render(<GamesListPage />);
    expect(screen.getByText('Game Collection')).toBeInTheDocument();
  });

  it('renders loading state', async () => {
    useSearchGames.mockImplementation(() => ({
      ...mockHookData,
      isLoading: true
    }));

    render(<GamesListPage />);
    expect(screen.getByText('LOADING')).toBeInTheDocument();
  });

  it('renders pagination info', () => {
    render(<GamesListPage />);
    expect(screen.getByText('page: 1 total: 0')).toBeInTheDocument();
  });

  it('renders letter buttons A-Z', () => {
    render(<GamesListPage />);
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

    letters.forEach(letter => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it('renders remove duplicates button', () => {
    render(<GamesListPage />);
    expect(screen.getByText('Remove Duplicates')).toBeInTheDocument();
  });
});
