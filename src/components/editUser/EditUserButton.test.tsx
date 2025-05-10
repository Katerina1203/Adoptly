import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import EditUserButton from './EditUserButton';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/lib/actions', () => ({
  updateUser: jest.fn(),
}));

jest.mock('./EditUserModal', () => {
  return function MockEditUserModal({isOpen, onClose, onSave, user}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: any) => void;
    user: {
      username: string;
      email: string;
      [key: string]: any;
    };
  }) {
    if (!isOpen) return null;

    return (
        <div data-testid="mock-modal">
          <button onClick={() => onSave(user)}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
    );
  };
});

describe('EditUserButton Component', () => {
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockUserId = 'user123';
  const mockOnUserUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the edit button', () => {
    render(<EditUserButton userId={mockUserId} user={mockUser}/>);
    expect(screen.getByText('Редактирай')).toBeInTheDocument();
  });

  it('opens the modal when edit button is clicked', async () => {
    render(<EditUserButton userId={mockUserId} user={mockUser}/>);

    const editButton = screen.getByText('Редактирай');
    await userEvent.click(editButton);

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  it('handles saving user data correctly', async () => {
    const {updateUser: mockUpdateUser} = require('@/lib/actions');

    render(<EditUserButton
        userId={mockUserId}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
    />);

    const editButton = screen.getByText('Редактирай');
    await userEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);

      const formDataArg = mockUpdateUser.mock.calls[0][0];
      expect(formDataArg instanceof FormData).toBeTruthy();

      expect(mockOnUserUpdated).toHaveBeenCalledWith(mockUser);
    });
  });

  it('calls onUserUpdated when provided', async () => {
    render(<EditUserButton
        userId={mockUserId}
        user={mockUser}
        onUserUpdated={mockOnUserUpdated}
    />);

    const editButton = screen.getByText('Редактирай');
    await userEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnUserUpdated).toHaveBeenCalledTimes(1);
      expect(mockOnUserUpdated).toHaveBeenCalledWith(mockUser);
    });
  });

  it('closes the modal when cancel is clicked', async () => {
    render(<EditUserButton userId={mockUserId} user={mockUser}/>);

    const editButton = screen.getByText('Редактирай');
    await userEvent.click(editButton);

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });
});
