import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddAnimalForm from './AddAnimalForm';
import * as actions from '@/lib/actions';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock('@/lib/actions', () => ({
  createAnimalPost: jest.fn(),
}));

describe('AddAnimalForm', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AddAnimalForm close={mockClose} />);

    expect(screen.getByLabelText(/Вид/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Възраст/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Местоположение/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пол/i, { selector: 'input[name="gender"]' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Информация за животинчто/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Добавете снимки/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добави/i })).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    render(<AddAnimalForm close={mockClose} />);

    fireEvent.click(screen.getByRole('button', { name: /Добави/i }));

    await waitFor(() => {
      expect(screen.getByText(/No type/i)).toBeInTheDocument();
      expect(screen.getByText(/No gender/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter description/i)).toBeInTheDocument();
    });

    expect(mockClose).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    (actions.createAnimalPost as jest.Mock).mockResolvedValueOnce({});

    render(<AddAnimalForm close={mockClose} />);

    await userEvent.type(screen.getByLabelText(/Вид/i), 'Cat');
    await userEvent.type(screen.getByLabelText(/Пол/i, { selector: 'input[name="gender"]' }), 'Female');
    await userEvent.type(screen.getByLabelText(/Информация за животинчто/i), 'Lovely cat');

    const fileInput = screen.getByLabelText(/Добавете снимки/i);
    const file = new File(['(⌐□_□)'], 'cat.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false
    });
    fireEvent.change(fileInput);

    fireEvent.click(screen.getByRole('button', { name: /Добави/i }));

    await waitFor(() => {
      expect(actions.createAnimalPost).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
