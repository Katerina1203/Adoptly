import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import EditUserModal from './EditUserModal';

describe('EditUserModal Component', () => {
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const {container} = render(
        <EditUserModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} user={mockUser}/>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal with user information when isOpen is true', () => {
    render(
        <EditUserModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} user={mockUser}/>
    );

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('testuser');
    expect(inputs[1]).toHaveValue('test@example.com');
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('updates username and email when input values change', async () => {
    render(
        <EditUserModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} user={mockUser}/>
    );

    const inputs = screen.getAllByRole('textbox');
    const usernameInput = inputs[0];
    const emailInput = inputs[1];

    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'newusername');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'newemail@example.com');

    expect(usernameInput).toHaveValue('newusername');
    expect(emailInput).toHaveValue('newemail@example.com');
  });

  it('calls onClose when Cancel button is clicked', async () => {
    render(
        <EditUserModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} user={mockUser}/>
    );

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with updated values and onClose when Save button is clicked', async () => {
    render(
        <EditUserModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} user={mockUser}/>
    );

    const inputs = screen.getAllByRole('textbox');
    const usernameInput = inputs[0];
    const emailInput = inputs[1];

    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'newusername');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'newemail@example.com');

    const saveButton = screen.getByText('Save');
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      username: 'newusername',
      email: 'newemail@example.com'
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
