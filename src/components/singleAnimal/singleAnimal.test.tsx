import React from 'react';
import {render, screen} from '@testing-library/react';
import SingleAnimal from './singleAnimal';
import {getAnimalAd, getUser, getUserById} from '@/lib/data';
import {takeAllPhotosForSingleAnimal} from '@/lib/actions';
import {auth} from '@/auth';

jest.mock('@/lib/data', () => ({
  getAnimalAd: jest.fn(),
  getUserById: jest.fn(),
  getUser: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  takeAllPhotosForSingleAnimal: jest.fn(),
  deleteAnimal: jest.fn(),
}));

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({children, href}: any) => <a href={href}>{children}</a>
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('@/components/editAnimal/EditAnimalButton', () => ({
  __esModule: true,
  default: () => <button>Edit</button>
}));

jest.mock('@/components/deleteAnimal/DeleteAnimal', () => ({
  __esModule: true,
  default: () => <button>Delete</button>
}));

describe('SingleAnimal', () => {
  const mockAnimal = {
    _id: 'animal123',
    userID: 'user123',
    type: 'Dog',
    age: '2 years',
    gender: 'Male',
    city: 'Sofia',
    description: 'A friendly dog looking for a home',
    createdAt: new Date().toISOString(),
  };

  const mockUser = {
    _id: 'user123',
    username: 'TestUser',
    img: '/uploads/profile.jpg',
    phone: '0888123456',
  };

  const mockPhotos = [
    {_id: 'photo1', src: '/uploads/dog1.jpg'},
    {_id: 'photo2', src: '/uploads/dog2.jpg'},
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getAnimalAd.mockResolvedValue(mockAnimal);
    getUserById.mockResolvedValue(mockUser);
    takeAllPhotosForSingleAnimal.mockResolvedValue(mockPhotos);
  });

  test('should render animal not found when animal is null', async () => {
    getAnimalAd.mockResolvedValue(null);

    const {findByText} = render(await SingleAnimal({id: 'nonexistent'}));

    expect(await findByText('Animal not found.')).toBeInTheDocument();
  });

  test('should render user not found when user is null', async () => {
    getUserById.mockResolvedValue(null);

    const {findByText} = render(await SingleAnimal({id: 'animal123'}));

    expect(await findByText('User not found.')).toBeInTheDocument();
  });

  test('should render animal details correctly', async () => {
    auth.mockResolvedValue({user: null});

    const {findByText} = render(await SingleAnimal({id: 'animal123'}));

    expect(await findByText('вид: Dog')).toBeInTheDocument();
    expect(await findByText('възраст: 2 years')).toBeInTheDocument();
    expect(await findByText('пол: Male')).toBeInTheDocument();
    expect(await findByText('локация: Sofia')).toBeInTheDocument();
    expect(await findByText('A friendly dog looking for a home')).toBeInTheDocument();
    expect(await findByText('TestUser')).toBeInTheDocument();
    expect(await findByText('0888123456')).toBeInTheDocument();
  });

  test('should not show edit and delete buttons for non-owner', async () => {
    auth.mockResolvedValue({
      user: {email: 'other@example.com'}
    });
    getUser.mockResolvedValue({
      _id: 'otheruser',
      username: 'OtherUser'
    });

    const result = await SingleAnimal({id: 'animal123'});
    render(result);

    expect(screen.queryByRole('button', {name: /edit/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /delete/i})).not.toBeInTheDocument();
  });

  test('should show edit and delete buttons for owner', async () => {
    auth.mockResolvedValue({
      user: {email: 'owner@example.com'}
    });
    getUser.mockResolvedValue({
      _id: 'user123',
      username: 'TestUser'
    });

    const result = await SingleAnimal({id: 'animal123'});
    render(result);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('should handle images correctly', async () => {
    auth.mockResolvedValue({user: null});

    const result = await SingleAnimal({id: 'animal123'});
    render(result);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
