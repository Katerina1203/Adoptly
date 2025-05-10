import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './login';
import {getUserWithCredentials} from '@/lib/actions';
import {useRouter} from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  getUserWithCredentials: jest.fn(),
}));

describe('LoginForm Component', () => {
  const mockToggleForm = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({push: mockPush});
  });

  it('renders the login form correctly', () => {
    render(<LoginForm toggleForm={mockToggleForm}/>);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
    expect(screen.getByText(/създайте акаунт/i)).toBeInTheDocument();
  });

  it('toggles password visibility when clicking the toggle button', async () => {
    const {container} = render(<LoginForm toggleForm={mockToggleForm}/>);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const passwordContainer = passwordInput.closest('div');

    passwordInput.setAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'text');

    passwordInput.setAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm toggleForm={mockToggleForm}/>);

    const submitButton = screen.getByText(/submit/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email must be at least 10 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('calls toggleForm when create account button is clicked', async () => {
    render(<LoginForm toggleForm={mockToggleForm}/>);

    const createAccountButton = screen.getByText(/създайте акаунт/i);
    await userEvent.click(createAccountButton);

    expect(mockToggleForm).toHaveBeenCalledTimes(1);
  });

  it('handles successful login and redirects', async () => {
    (getUserWithCredentials as jest.Mock).mockResolvedValue({success: true});

    render(<LoginForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');

    const submitButton = screen.getByText(/submit/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(getUserWithCredentials).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when login fails', async () => {
    (getUserWithCredentials as jest.Mock).mockResolvedValue({
      error: {message: 'Incorrect credentials!'}
    });

    render(<LoginForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');

    const submitButton = screen.getByText(/submit/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Incorrect credentials!')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('handles exceptions during login', async () => {
    (getUserWithCredentials as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<LoginForm toggleForm={mockToggleForm}/>);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');

    const submitButton = screen.getByText(/submit/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Incorrect credentials!')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
