import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameEditForm from './GameEditForm';

describe('GameEditForm', () => {
  const mockProps = {
    formRef: { current: null },
    current: {
      priority: 50,
      platform: 'PC',
      status: 'Active',
      graphic_style: 'Pixel',
      tags: 'action rpg',
      thoughts: 'Test thoughts',
      playnite_title: 'Test Game'
    },
    saveGame: vi.fn(),
    addRemoveTag: vi.fn()
  };

  it('renders form with all fields', () => {
    render(<GameEditForm {...mockProps} />);

    expect(screen.getByLabelText(/priority/i)).toHaveValue('50');
    expect(screen.getByLabelText(/platform/i)).toHaveValue('PC');
    expect(screen.getByLabelText(/status/i)).toHaveValue('Active');
    expect(screen.getByLabelText(/graphic style/i)).toHaveValue('Pixel');
    expect(screen.getByLabelText(/^tags:/i)).toHaveValue('action rpg');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Test thoughts');
    expect(screen.getByLabelText(/playnite title/i)).toHaveValue('Test Game');
  });

  it('handles form submission', () => {
    render(<GameEditForm {...mockProps} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockProps.saveGame).toHaveBeenCalled();
  });

  it('handles tag button clicks', () => {
    render(<GameEditForm {...mockProps} />);

    const tagButtons = screen.getAllByRole('button');
    const firstTagButton = tagButtons.find(button => button.className === 'tagBtn');

    fireEvent.click(firstTagButton);

    expect(mockProps.addRemoveTag).toHaveBeenCalled();
  });

  it('displays priority description tooltip', () => {
    render(<GameEditForm {...mockProps} />);

    const priorityLabel = screen.getByLabelText(/priority/i);
    expect(priorityLabel.parentElement).toHaveAttribute('title');
    expect(priorityLabel.parentElement.title).toContain('Priorities description');
  });

  it('displays notes tooltip', () => {
    render(<GameEditForm {...mockProps} />);

    const infoLink = screen.getByText('I');
    expect(infoLink).toHaveAttribute('title');
    expect(infoLink.title).toContain('progression types');
  });

  it('renders save button', () => {
    render(<GameEditForm {...mockProps} />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('id', 'saveBtn');
  });

  it.skip('updates input values when props change', () => {
    const { rerender } = render(<GameEditForm {...mockProps} />);

    const updatedProps = {
      ...mockProps,
      current: {
        ...mockProps.current,
        priority: 75,
        platform: 'PS5'
      }
    };

    rerender(<GameEditForm {...updatedProps} />);


    expect(screen.getByTestId('priority-input')).toHaveValue('75');
    expect(screen.getByTestId('platform-input')).toHaveValue('PS5');
  });
});