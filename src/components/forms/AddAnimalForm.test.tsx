import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
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
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AddAnimalForm close={mockClose}/>);

    expect(screen.getByLabelText(/Вид/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Възраст/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Местоположение/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', {name: /Пол/i})).toBeInTheDocument();
    expect(screen.getByLabelText(/Описание/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Снимки/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Добави/i})).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    render(<AddAnimalForm close={mockClose}/>);

    const submitButton = screen.getByRole('button', {name: /Добави/i});
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Въведете вид/i)).toBeInTheDocument();
      expect(screen.getByText(/Въведете местоположение/i)).toBeInTheDocument();
      expect(screen.getByText(/Моля въведете описание/i)).toBeInTheDocument();

      expect(actions.createAnimalPost).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    (actions.createAnimalPost as jest.Mock).mockResolvedValue({success: true});

    render(<AddAnimalForm close={mockClose}/>);

    await user.type(screen.getByLabelText(/Вид/i), 'Котка');
    await user.type(screen.getByLabelText(/Възраст/i), '3');
    await user.type(screen.getByLabelText(/Местоположение/i), 'София');
    const genderSelect = screen.getByRole('combobox', {name: /Пол/i});
    await user.selectOptions(genderSelect, 'мъжки');
    await user.type(screen.getByLabelText(/Описание/i), 'Много послушна котка');

    const fileInput = screen.getByLabelText(/Снимки/i);
    const file = new File(['(⌐□_□)'], 'cat.png', {type: 'image/png'});
    await user.upload(fileInput, file);

    const submitButton = screen.getByRole('button', {name: /Добави/i});
    await user.click(submitButton);

    await waitFor(() => {
      expect(actions.createAnimalPost).toHaveBeenCalled();
      const formDataArg = (actions.createAnimalPost as jest.Mock).mock.calls[0][0];
      expect(formDataArg instanceof FormData).toBeTruthy();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    (actions.createAnimalPost as jest.Mock).mockRejectedValue(new Error('Failed to add animal'));

    render(<AddAnimalForm close={mockClose}/>);

    await user.type(screen.getByLabelText(/Вид/i), 'Котка');
    await user.type(screen.getByLabelText(/Възраст/i), '3');
    await user.type(screen.getByLabelText(/Местоположение/i), 'София');
    const genderSelect = screen.getByRole('combobox', {name: /Пол/i});
    await user.selectOptions(genderSelect, 'мъжки');
    await user.type(screen.getByLabelText(/Описание/i), 'Много послушна котка');

    const fileInput = screen.getByLabelText(/Снимки/i);
    const file = new File(['test'], 'cat.png', {type: 'image/png'});
    await user.upload(fileInput, file);

    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(actions.createAnimalPost).toHaveBeenCalled();
    }, {timeout: 3000});

    await waitFor(() => {
      expect(screen.getByText(/Възникна грешка при създаване на обявата/i)).toBeInTheDocument();
    }, {timeout: 3000});
  });
});
