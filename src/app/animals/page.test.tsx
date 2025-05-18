import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Animals from '@/app/animals/page';
import {getAnimals} from '@/lib/data';

jest.mock('@/lib/data', () => ({
  getAnimals: jest.fn(),
}));

jest.mock('@/components/animalCard/AnimalCard', () => ({
  __esModule: true,
  default: ({animal}: { animal: any }) => (
      <div data-testid={`animal-card-${animal._id}`}>
        <h3>{animal.name}</h3>
      </div>
  ),
}));

describe('Animals Component', () => {
  const mockAnimals = [
    {_id: '1', name: 'Buddy'},
    {_id: '2', name: 'Max'},
    {_id: '3', name: 'Bella'},
  ];

  beforeEach(() => {
    (getAnimals as jest.Mock).mockResolvedValue(mockAnimals);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all animals from the API', async () => {
    render(await Animals());

    mockAnimals.forEach(animal => {
      expect(screen.getByTestId(`animal-card-${animal._id}`)).toBeInTheDocument();
      expect(screen.getByText(animal.name)).toBeInTheDocument();
    });
  });

  it('should call getAnimals function', async () => {
    render(await Animals());

    expect(getAnimals).toHaveBeenCalledTimes(1);
  });

  it('should render the correct number of animal cards', async () => {
    render(await Animals());

    const animalCards = screen.getAllByTestId(/animal-card-/);
    expect(animalCards).toHaveLength(mockAnimals.length);
  });

  it('should render each animal in a grid layout', async () => {
    const {container} = render(await Animals());

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();

    expect(gridContainer).toHaveClass('grid');
  });

  it('should handle case when no animals are returned', async () => {
    (getAnimals as jest.Mock).mockResolvedValue([]);

    const {container} = render(await Animals());

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();

    const animalCards = screen.queryAllByTestId(/animal-card-/);
    expect(animalCards).toHaveLength(0);
  });
});
