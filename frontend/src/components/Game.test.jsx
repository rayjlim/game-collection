import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from './Game';

describe('Game', () => {
  const mockGame = {
    id: 1,
    title: 'Test Game',
    fg_id: 123,
    fg_url: 'http://test.com',
    image: 'test.jpg',
    size_calculated: 30,
    genre: 'Action',
    tags: 'to-download installed',
    priority: 50,
    platform: 'PC',
    status: 'Active',
    graphic_style: 'Pixel',
    thoughts: 'Great game',
    fg_article_date: '2023-01-01',
    playnite_title: 'Test Game PN',
    playnite_last: '2023',
    playnite_added: '2022',
    playnite_playtime: '10h'
  };

  it('renders game information correctly', () => {
    render(<Game game={mockGame} />);

    expect(screen.getByText(mockGame.title)).toBeInTheDocument();
    expect(screen.getByText(`fg id: ${mockGame.fg_id}`)).toBeInTheDocument();
    expect(screen.getByText(/Genre: Action/)).toBeInTheDocument();
    expect(screen.getByText(/Size: 30/)).toBeInTheDocument();
    expect(screen.getByText(/Article date:/)).toBeInTheDocument();
  });

  it('renders game tags with correct colors', () => {
    render(<Game game={mockGame} />);

    const tags = screen.getAllByTestId('game-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0]).toHaveTextContent('to-download');
    expect(tags[1]).toHaveTextContent('installed');
  });

  it('applies correct size class based on game size', () => {
    render(<Game game={mockGame} />);
    const gameContainer = screen.getByRole('region');
    expect(gameContainer.querySelector('.game-list-row')).toHaveClass('large-size');
  });

  it('handles edit button click', () => {
    render(<Game game={mockGame} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('opens external link when clicking game image', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    render(<Game game={mockGame} />);

    const image = screen.getByAltText('game poster');
    fireEvent.click(image);

    expect(mockOpen).toHaveBeenCalledWith(mockGame.fg_url, '_blank');
  });

  it('renders playnite information when available', () => {
    render(<Game game={mockGame} />);

    expect(screen.getByText(/pn: Test Game PN/)).toBeInTheDocument();
    expect(screen.getByText(/2023, 2022, 10h/)).toBeInTheDocument();
  });

  it('renders game info without playnite data when not available', () => {
    const gameWithoutPlaynite = {
      ...mockGame,
      playnite_title: '',
      playnite_last: '',
      playnite_added: '',
      playnite_playtime: ''
    };

    render(<Game game={gameWithoutPlaynite} />);

    expect(screen.queryByText(/pn:/)).not.toBeInTheDocument();
  });

  it('renders medium size class for medium-sized games', () => {
    const mediumGame = { ...mockGame, size_calculated: 15 };
    render(<Game game={mediumGame} />);
    const gameContainer = screen.getByRole('region');
    expect(gameContainer.querySelector('.game-list-row')).toHaveClass('medium-size');
  });

  it('renders small size class for small-sized games', () => {
    const smallGame = { ...mockGame, size_calculated: 5 };
    render(<Game game={smallGame} />);
    const gameContainer = screen.getByRole('region');
    expect(gameContainer.querySelector('.game-list-row')).toHaveClass('small-size');
  });
});