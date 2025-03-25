import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './SearchForm';

describe('SearchForm', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onClear: vi.fn(),
    onTitleChange: vi.fn(),
    formRef: { current: document.createElement('form') }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form elements', () => {
    render(<SearchForm {...mockProps} />);

    expect(screen.getByLabelText(/search title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size min/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size max/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order by/i)).toBeInTheDocument();
  });

  it.skip('renders all order by options', () => {
    render(<SearchForm {...mockProps} />);

    const orderBySelect = screen.getByLabelText(/order by/i);
    expect(orderBySelect).toBeInTheDocument();

    expect(screen.getByText('Updated At')).toBeInTheDocument();
    expect(screen.getByText('Article Date')).toBeInTheDocument();
    expect(screen.getByText('Updated At - Asc')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('size')).toBeInTheDocument();
  });

  it.skip('handles form submission', () => {
    render(<SearchForm {...mockProps} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('handles clear button click', () => {
    render(<SearchForm {...mockProps} />);

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('handles title change', () => {
    render(<SearchForm {...mockProps} />);

    const titleInput = screen.getByLabelText(/search title/i);
    fireEvent.change(titleInput, { target: { value: 'test game' } });

    expect(mockProps.onTitleChange).toHaveBeenCalled();
  });

  it.skip('updates tag input and order by when tag is selected', () => {
    const formElement = document.createElement('form');
    const mockFormRef = { current: formElement };

    render(<SearchForm {...mockProps} formRef={mockFormRef} />);

    const tagSelect = screen.getByTestId('tagsSelect');
    fireEvent.change(tagSelect, { target: { value: 'to-download' } });

    const tagInput = formElement.querySelector('input[name="tags"]');
    const orderSelect = formElement.querySelector('select[name="orderBy"]');

    expect(tagInput.value).toBe('to-download');
    expect(orderSelect.value).toBe('priority');
  });

  it('renders all missing checkboxes', () => {
    render(<SearchForm {...mockProps} />);

    expect(screen.getByLabelText(/installed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to-install/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to-download/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tried/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^priority/i)).toBeInTheDocument();
  });
});