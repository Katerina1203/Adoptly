import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import FormSwitcher from '@/app/(auth)/login/page';
import {handleGoogleLogin} from '@/lib/actions';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock('@/lib/actions', () => ({
  handleGoogleLogin: jest.fn(),
}));

jest.mock('@/components/login/login', () => ({
  __esModule: true,
  default: ({toggleForm}: { toggleForm: () => void }) => (
      <div data-testid="login-form">
        <button onClick={toggleForm}>Switch to Register</button>
      </div>
  ),
}));

jest.mock('@/components/login/register', () => ({
  __esModule: true,
  default: ({toggleForm}: { toggleForm: () => void }) => (
      <div data-testid="register-form">
        <button onClick={toggleForm}>Switch to Login</button>
      </div>
  ),
}));

describe('FormSwitcher Component', () => {
  it('should render the login form by default', () => {
    render(<FormSwitcher/>);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    expect(screen.getByText('Вход с Google account')).toBeInTheDocument();
  });

  it('should toggle between login and register forms', () => {
    render(<FormSwitcher/>);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Switch to Register'));

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.getByText('Регистрация с Google account')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Switch to Login'));

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
  });

  it('should render the correct image based on form state', () => {
    render(<FormSwitcher/>);

    expect(screen.getByRole('img', {name: 'Family with dog'})).toBeInTheDocument();

    fireEvent.click(screen.getByText('Switch to Register'));

    expect(screen.getByRole('img', {name: 'Girl with cat'})).toBeInTheDocument();
  });

  it('should call handleGoogleLogin when Google login button is clicked', () => {
    render(<FormSwitcher/>);

    const googleButton = screen.getByText('Вход с Google account');
    fireEvent.click(googleButton);

    expect(handleGoogleLogin).toHaveBeenCalled();
  });
});
