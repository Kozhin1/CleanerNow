import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../tests/utils';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('CleanerNow')).toBeInTheDocument();
    expect(screen.getByText('Find Cleaners')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('shows sign in button when user is not authenticated', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});