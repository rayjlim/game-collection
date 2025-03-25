import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Game Collection heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Game Collection/i);
    expect(headingElement).toBeInTheDocument();
  });
});