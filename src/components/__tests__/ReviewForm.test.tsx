import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../tests/utils';
import ReviewForm from '../ReviewForm';

describe('ReviewForm', () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    bookingId: '123',
    revieweeId: '456',
    onSubmit: mockOnSubmit,
  };

  it('renders form fields correctly', () => {
    renderWithProviders(<ReviewForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<ReviewForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText(/submit review/i));
    
    expect(await screen.findByText(/rating is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/comment is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', () => {
    renderWithProviders(<ReviewForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/comment/i), { 
      target: { value: 'Great service!' } 
    });
    
    fireEvent.click(screen.getByText(/submit review/i));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      rating: 5,
      comment: 'Great service!',
    });
  });
});