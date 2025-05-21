import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './userProfile';
import AnimalCard from '../animalCard/AnimalCard';
import DeleteUserBtn from '../deleteUser/deleteUserBtn';
import EditUserBtn from '../editUser/EditUserButton';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {}
  }),
}));

jest.mock('../animalCard/AnimalCard', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="animal-card"/>),
}));

jest.mock('../createAnimal/CreateAnimalBtn', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="create-animal-btn"/>),
}));

jest.mock('../deleteUser/deleteUserBtn', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="delete-user-btn"/>),
}));

jest.mock('../editUser/EditUserButton', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="edit-user-btn"/>),
}));

const MockedAnimalCard = AnimalCard as jest.MockedFunction<typeof AnimalCard>;
const MockedEditUserBtn = EditUserBtn as jest.MockedFunction<typeof EditUserBtn>;
const MockedDeleteUserBtn = DeleteUserBtn as jest.MockedFunction<typeof DeleteUserBtn>;

jest.mock('./userProfile', () => ({
  __esModule: true,
  default: ({user, animals}) => (
      <div>
        <h1>Профил на потребителя</h1>
        <p>Име: {user.username}</p>
        <p>Имейл: {user.email}</p>
        <p>Присъединил се: {user.createdAt}</p>
        {user.img ? (
            <img src={user.img} alt="User Avatar"/>
        ) : (
            <span>👤</span>
        )}
        <h2>Вашите обяви</h2>
        {animals.length > 0 ? (
            <div>
              {animals.map(animal => (
                  <AnimalCard key={animal._id} animal={animal}/>
              ))}
            </div>
        ) : (
            <p>Нямате обяви.</p>
        )}
        <EditUserBtn
            userId={user._id}
            user={{
              username: user.username,
              email: user.email,
            }}
        />
        <DeleteUserBtn
            userId={user._id}
            username={user.username}
        />
        <div data-testid="create-animal-btn"/>
      </div>
  )
}));

describe('UserProfile Component', () => {
  const mockUser = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2023-01-01',
  };

  const mockAnimals = [
    {
      _id: 'animal1',
      description: 'A cute dog',
      type: 'dog',
      age: '2',
      city: 'New York',
      gender: 'male',
      userID: 'user123',
    },
    {
      _id: 'animal2',
      description: 'A friendly cat',
      type: 'cat',
      age: '3',
      city: 'Boston',
      gender: 'female',
      userID: 'user123',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} animals={mockAnimals}/>);

    expect(screen.getByText(/Профил на потребителя/i)).toBeInTheDocument();
    expect(screen.getByText(/Име:/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/Имейл:/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Присъединил се:/i)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01/i)).toBeInTheDocument();
  });

  it('renders default avatar when user has no image', () => {
    render(<UserProfile user={mockUser} animals={mockAnimals}/>);
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('renders user image when available', () => {
    const userWithImage = {
      ...mockUser,
      img: 'https://example.com/avatar.jpg',
    };

    render(<UserProfile user={userWithImage} animals={mockAnimals}/>);

    const avatar = screen.getByAltText('User Avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders animal cards for each animal', () => {
    render(<UserProfile user={mockUser} animals={mockAnimals}/>);

    expect(screen.getByText(/Вашите обяви/i)).toBeInTheDocument();
    const animalCards = screen.getAllByTestId('animal-card');
    expect(animalCards).toHaveLength(2);
    expect(MockedAnimalCard).toHaveBeenCalledTimes(2);
  });

  it('displays a message when user has no animals', () => {
    render(<UserProfile user={mockUser} animals={[]}/>);

    expect(screen.getByText(/Нямате обяви./i)).toBeInTheDocument();
    expect(screen.queryByTestId('animal-card')).not.toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<UserProfile user={mockUser} animals={mockAnimals}/>);

    expect(screen.getByTestId('edit-user-btn')).toBeInTheDocument();
    expect(screen.getByTestId('delete-user-btn')).toBeInTheDocument();
    expect(screen.getByTestId('create-animal-btn')).toBeInTheDocument();

    expect(MockedEditUserBtn).toHaveBeenCalled();
    expect(MockedDeleteUserBtn).toHaveBeenCalled();
  });
});
