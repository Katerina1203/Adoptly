import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DeleteUserButton from './deleteUserBtn';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/lib/actions', () => ({
  deleteUser: jest.fn(),
}));

jest.mock('./deleteUserModal', () => {
  return function MockDeleteUserModal({isOpen, onClose, onDelete, username}: {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    username: string;
  }) {
    if (!isOpen) return null;

    return (
        <div data-testid="mock-delete-modal">
          <p>Delete {username}?</p>
          <button onClick={onDelete}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
    );
  };
});

describe('DeleteUserButton Component', () => {
  const mockUserId = 'user123';
  const mockUsername = 'testuser';
  const mockOnUserDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the delete button', () => {
    render(<DeleteUserButton userId={mockUserId} username={mockUsername}/>);
    expect(screen.getByText('Изтрий')).toBeInTheDocument();
  });

  it('opens the modal when delete button is clicked', async () => {
    render(<DeleteUserButton userId={mockUserId} username={mockUsername}/>);

    const deleteButton = screen.getByText('Изтрий');
    await userEvent.click(deleteButton);

    expect(screen.getByTestId('mock-delete-modal')).toBeInTheDocument();
    expect(screen.getByText(`Delete ${mockUsername}?`)).toBeInTheDocument();
  });

  it('handles deleting user correctly', async () => {
    const {deleteUser: mockDeleteUser} = require('@/lib/actions');

    render(
        <DeleteUserButton
            userId={mockUserId}
            username={mockUsername}
            onUserDeleted={mockOnUserDeleted}
        />
    );

    const deleteButton = screen.getByText('Изтрий');
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByText('Confirm');
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledTimes(1);

      const formDataArg = mockDeleteUser.mock.calls[0][0];
      expect(formDataArg instanceof FormData).toBeTruthy();
    });
  });

  it('calls onUserDeleted when provided', async () => {
    render(
        <DeleteUserButton
            userId={mockUserId}
            username={mockUsername}
            onUserDeleted={mockOnUserDeleted}
        />
    );

    const deleteButton = screen.getByText('Изтрий');
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByText('Confirm');
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnUserDeleted).toHaveBeenCalledTimes(1);
    });
  });

  it('closes the modal when cancel is clicked', async () => {
    render(<DeleteUserButton userId={mockUserId} username={mockUsername}/>);

    const deleteButton = screen.getByText('Изтрий');
    await userEvent.click(deleteButton);

    expect(screen.getByTestId('mock-delete-modal')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(screen.queryByTestId('mock-delete-modal')).not.toBeInTheDocument();
  });
});
