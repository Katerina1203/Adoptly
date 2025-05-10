import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './register';
import {useRouter} from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('RegisterForm Component', () => {
  const mockToggleForm = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({push: mockPush});
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 201
    });
  });

  it('renders the register form correctly', () => {
    render(<RegisterForm toggleForm={mockToggleForm}/>);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByText(/създай/i)).toBeInTheDocument();
    expect(screen.getByText(/имате акаунт/i)).toBeInTheDocument();
    expect(screen.getByText(/вход/i)).toBeInTheDocument();
  });

  it('toggles password visibility when clicking the toggle buttons', async () => {
    render(<RegisterForm toggleForm={mockToggleForm}/>);

    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    passwordInput.setAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'text');
    passwordInput.setAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    confirmPasswordInput.setAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    confirmPasswordInput.setAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('shows validation errors for empty fields', async () => {
    render(<RegisterForm toggleForm={mockToggleForm}/>);

    const submitButton = screen.getByText(/създай/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Required').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 3 characters.')).toBeInTheDocument();
    });
  });

  it('calls toggleForm when login button is clicked', async () => {
    render(<RegisterForm toggleForm={mockToggleForm}/>);

    const loginButton = screen.getByText(/вход/i);
    await userEvent.click(loginButton);

    expect(mockToggleForm).toHaveBeenCalledTimes(1);
  });

  it('shows error when passwords do not match', async () => {
    render(<RegisterForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password456');

    const submitButton = screen.getByText(/създай/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('handles successful registration and redirects', async () => {
    render(<RegisterForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password123');

    const submitButton = screen.getByText(/създай/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        })
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles registration failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 400
    });

    render(<RegisterForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password123');

    const submitButton = screen.getByText(/създай/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('handles exceptions during registration', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<RegisterForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password123');

    const submitButton = screen.getByText(/създай/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Incorrect credentials!')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
