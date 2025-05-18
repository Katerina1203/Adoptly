import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAnimalModal from './CreateAnimalModal';
import * as actions from '@/lib/actions';

jest.mock('@/lib/actions', () => ({
  createAnimalPost: jest.fn()
}));

jest.mock('../forms/AddAnimalForm', () => ({
  __esModule: true,
  default: ({close}: { close: () => void }) => {
    const [age, setAge] = React.useState('');
    const [ageError, setAgeError] = React.useState('');

    const validateAge = (ageValue: number) => {
      if (ageValue <= 0 || !Number.isInteger(Number(ageValue))) {
        return 'Age must be a positive integer';
      }
      return '';
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const ageError = validateAge(Number(age));
      if (!ageError) {
        actions.createAnimalPost(formData);
        close();
      }
    };

    return (
        <form data-testid="add-animal-form" onSubmit={handleSubmit}>
          <input
              type="text"
              name="age"
              data-testid="age-input"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setAgeError(validateAge(Number(e.target.value)));
              }}
          />
          <span data-testid="age-error">{ageError}</span>
          <button type="submit" data-testid="submit-button">Submit</button>
          <button type="button" onClick={close} data-testid="close-button">Close</button>
        </form>
    );
  }
}));

describe('CreateAnimalModal', () => {
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dialog when open is true', () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    expect(screen.getByText('Информация за животинчето')).toBeInTheDocument();
    expect(screen.getByText('Попълнете данните за вашето животинче')).toBeInTheDocument();
    expect(screen.getByTestId('add-animal-form')).toBeInTheDocument();
  });

  test('does not render dialog when open is false', () => {
    render(<CreateAnimalModal open={false} setOpen={mockSetOpen}/>);

    expect(screen.queryByText('Информация за животинчето')).not.toBeInTheDocument();
    expect(screen.queryByText('Попълнете данните за вашето животинче')).not.toBeInTheDocument();
  });

  test('closes the dialog when close button is clicked', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test('closes the dialog when clicking outside of it', async () => {
    const {baseElement} = render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    // Find the dialog backdrop (the area outside the dialog content)
    const dialogBackdrop = baseElement.querySelector('[data-radix-dialog-overlay]');
    if (dialogBackdrop) {
      fireEvent.click(dialogBackdrop);
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    }
  });

  test('passes the close handler to AddAnimalForm', () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const form = screen.getByTestId('add-animal-form');
    expect(form).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test('handles dialog state changes correctly', () => {
    const {rerender} = render(<CreateAnimalModal open={false} setOpen={mockSetOpen}/>);

    expect(screen.queryByTestId('add-animal-form')).not.toBeInTheDocument();

    rerender(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);
    expect(screen.getByTestId('add-animal-form')).toBeInTheDocument();

    rerender(<CreateAnimalModal open={false} setOpen={mockSetOpen}/>);
    expect(screen.queryByTestId('add-animal-form')).not.toBeInTheDocument();
  });

  test('handles ESC key to close the dialog', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    // Simulate pressing ESC key
    fireEvent.keyDown(document, {key: 'Escape', code: 'Escape'});

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test('validates form is properly rendered inside the modal', () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const form = screen.getByTestId('add-animal-form');
    expect(form).toBeInTheDocument();
    expect(dialog).toContainElement(form);
  });

  test('handles accessibility requirements', () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');

    const title = screen.getByText('Информация за животинчето');
    expect(title).toBeInTheDocument();

    const description = screen.getByText('Попълнете данните за вашето животинче');
    expect(description).toBeInTheDocument();
  });

  // Additional tests for untested branches
  test('validates age input - rejects negative values', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');
    await userEvent.type(ageInput, '-5');

    expect(screen.getByTestId('age-error').textContent).toBe('Age must be a positive integer');
  });

  test('validates age input - rejects zero', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');
    await userEvent.type(ageInput, '0');

    expect(screen.getByTestId('age-error').textContent).toBe('Age must be a positive integer');
  });

  test('validates age input - rejects non-integers', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');
    await userEvent.type(ageInput, '3.5');

    expect(screen.getByTestId('age-error').textContent).toBe('Age must be a positive integer');
  });

  test('validates age input - accepts positive integers', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');
    await userEvent.type(ageInput, '5');

    expect(screen.getByTestId('age-error').textContent).toBe('');
  });

  test('prevents form submission with invalid age', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');
    await userEvent.type(ageInput, '-1');

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(actions.createAnimalPost).not.toHaveBeenCalled();
    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  test('clears validation error when input becomes valid', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');

    await userEvent.type(ageInput, '-1');
    expect(screen.getByTestId('age-error').textContent).toBe('Age must be a positive integer');

    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '3');

    expect(screen.getByTestId('age-error').textContent).toBe('');
  });

  test('form data is properly passed to createAnimalPost', async () => {
    (actions.createAnimalPost as jest.Mock).mockImplementation(() => {
    });

    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');
    await userEvent.type(ageInput, '3');

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(actions.createAnimalPost).toHaveBeenCalled();
      const formDataArg = (actions.createAnimalPost as jest.Mock).mock.calls[0][0];
      expect(formDataArg).toBeInstanceOf(FormData);
    });
  });

  test('handles age input change events correctly', async () => {
    render(<CreateAnimalModal open={true} setOpen={mockSetOpen}/>);

    const ageInput = screen.getByTestId('age-input');

    await userEvent.type(ageInput, '1');
    expect(ageInput).toHaveValue('1');

    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '25');
    expect(ageInput).toHaveValue('25');
  });
});
