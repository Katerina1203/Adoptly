import {fireEvent, render, screen} from '@testing-library/react';
import DeleteAnimalForm from './DeleteAnimal';
import '@testing-library/jest-dom';

describe('DeleteAnimalForm', () => {
  const mockDeleteAction = jest.fn();
  const animalId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders delete button initially without modal', () => {
    render(<DeleteAnimalForm animalId={animalId} deleteAction={mockDeleteAction}/>);

    expect(screen.getByRole('button', {name: 'Изтрий'})).toBeInTheDocument();
    expect(screen.queryByText('Потвърди изтриване')).not.toBeInTheDocument();
  });

  test('shows modal when delete button is clicked', () => {
    render(<DeleteAnimalForm animalId={animalId} deleteAction={mockDeleteAction}/>);

    fireEvent.click(screen.getByRole('button', {name: 'Изтрий'}));

    expect(screen.getByText('Потвърди изтриване')).toBeInTheDocument();
    expect(screen.getByText('Сигурни ли сте, че искате да изтриете обявата?')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Отказ'})).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: 'Изтрий'})[1]).toBeInTheDocument();
  });

  test('closes modal when cancel button is clicked', () => {
    render(<DeleteAnimalForm animalId={animalId} deleteAction={mockDeleteAction}/>);

    fireEvent.click(screen.getByRole('button', {name: 'Изтрий'}));
    fireEvent.click(screen.getByRole('button', {name: 'Отказ'}));

    expect(screen.queryByText('Потвърди изтриване')).not.toBeInTheDocument();
  });

  test('hidden form has correct animal ID and action', () => {
    render(<DeleteAnimalForm animalId={animalId} deleteAction={mockDeleteAction}/>);

    const form = document.getElementById('delete-animal-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('hidden');

    const hiddenInput = screen.getByDisplayValue(animalId);
    expect(hiddenInput).toHaveAttribute('name', 'id');
    expect(hiddenInput).toHaveAttribute('type', 'hidden');
  });

  test('confirm button changes to loading state and submits form', () => {
    // Mock form submission
    const mockRequestSubmit = jest.fn();
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'delete-animal-form') {
        return {requestSubmit: mockRequestSubmit} as unknown as HTMLElement;
      }
      return null;
    });

    render(<DeleteAnimalForm animalId={animalId} deleteAction={mockDeleteAction}/>);

    fireEvent.click(screen.getByRole('button', {name: 'Изтрий'}));
    fireEvent.click(screen.getAllByRole('button', {name: 'Изтрий'})[1]);

    expect(mockRequestSubmit).toHaveBeenCalled();

    expect(screen.getByText('Изтриване...')).toBeInTheDocument();
    expect(screen.getByText('Изтриване...').closest('button')).toBeDisabled();
  });
});
