import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DeleteUserModal from './deleteUserModal';

describe('DeleteUserModal Component', () => {
  const mockUsername = 'testuser';
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not open', () => {
    const {container} = render(
        <DeleteUserModal
            isOpen={false}
            onClose={mockOnClose}
            onDelete={mockOnDelete}
            username={mockUsername}
        />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal when open', () => {
    render(
        <DeleteUserModal
            isOpen={true}
            onClose={mockOnClose}
            onDelete={mockOnDelete}
            username={mockUsername}
        />
    );

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(mockUsername)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /cancel/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /delete/i})).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(
        <DeleteUserModal
            isOpen={true}
            onClose={mockOnClose}
            onDelete={mockOnDelete}
            username={mockUsername}
        />
    );

    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
        <DeleteUserModal
            isOpen={true}
            onClose={mockOnClose}
            onDelete={mockOnDelete}
            username={mockUsername}
        />
    );

    const deleteButton = screen.getByRole('button', {name: /delete/i});
    await userEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('displays the correct confirmation message with username', () => {
    const customUsername = 'specialUser123';

    render(
        <DeleteUserModal
            isOpen={true}
            onClose={mockOnClose}
            onDelete={mockOnDelete}
            username={customUsername}
        />
    );

    expect(screen.getByText(new RegExp(customUsername, 'i'))).toBeInTheDocument();
  });

  it('has accessible buttons with correct styling', () => {
    render(
        <DeleteUserModal
            isOpen={true}
            onClose={mockOnClose}
            onDelete={mockOnDelete}
            username={mockUsername}
        />
    );

    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    const deleteButton = screen.getByRole('button', {name: /delete/i});

    expect(cancelButton).toHaveClass('px-4 py-2 bg-gray-300 rounded hover:bg-gray-400');
    expect(deleteButton).toHaveClass('px-4 py-2 bg-red-500 rounded hover:bg-red-600');
  });
});
