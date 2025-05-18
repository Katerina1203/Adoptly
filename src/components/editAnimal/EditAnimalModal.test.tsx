import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditAnimalModal from './EditAnimalModal';

describe('EditAnimalModal', () => {
  const mockAnimal = {
    _id: '123',
    description: 'Friendly cat',
    type: 'Cat',
    age: '3',
    city: 'Sofia',
    gender: 'женски'
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(
        <EditAnimalModal
            isOpen={true}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    expect(screen.getByText('Редактирай обявата')).toBeInTheDocument();

    expect(screen.getByDisplayValue(mockAnimal.age)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockAnimal.city)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockAnimal.description)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
        <EditAnimalModal
            isOpen={false}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    expect(screen.queryByText('Редактирай обявата')).not.toBeInTheDocument();
  });

  it('calls onClose when Отказ button is clicked', () => {
    render(
        <EditAnimalModal
            isOpen={true}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    fireEvent.click(screen.getByText('Отказ'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('updates form values when inputs change', async () => {
    render(
        <EditAnimalModal
            isOpen={true}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    const ageInput = screen.getByDisplayValue(mockAnimal.age);
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '5');

    expect(ageInput).toHaveValue('5');
  });

  it('calls onSave with updated animal data when Запази button is clicked', async () => {
    render(
        <EditAnimalModal
            isOpen={true}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    const descriptionInput = screen.getByDisplayValue(mockAnimal.description);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Updated description text');

    fireEvent.click(screen.getByText('Запази'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Updated description text',
        type: mockAnimal.type,
        age: mockAnimal.age,
        city: mockAnimal.city,
        gender: mockAnimal.gender,
      }));
    });
  });

  it('validates form without submitting when form has invalid data', async () => {
    render(
        <EditAnimalModal
            isOpen={true}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    const descriptionInput = screen.getByDisplayValue(mockAnimal.description);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Short');

    fireEvent.click(screen.getByText('Запази'));

    await waitFor(() => {
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('validates age input without submitting when age is invalid', async () => {
    render(
        <EditAnimalModal
            isOpen={true}
            onClose={mockOnClose}
            animal={mockAnimal}
            onSave={mockOnSave}
        />
    );

    const ageInput = screen.getByDisplayValue(mockAnimal.age);
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '25');

    fireEvent.click(screen.getByText('Запази'));

    await waitFor(() => {
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });
});
