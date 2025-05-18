import {render} from '@testing-library/react';
import UserPage from './page';
import {auth} from '@/auth';
import {getAnimalsByUserId, getUser} from '@/lib/data';
import {redirect} from 'next/navigation.js';
import UserProfile from '@/components/userProfile/userProfile';

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/data', () => ({
  getUser: jest.fn(),
  getAnimalsByUserId: jest.fn(),
}));

jest.mock('next/navigation.js', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/components/userProfile/userProfile', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

describe('UserPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to login if user is not found', async () => {
    (auth as jest.Mock).mockResolvedValue({user: {email: 'test@example.com'}});
    (getUser as jest.Mock).mockResolvedValue(null);

    const mockRedirect = redirect as jest.Mock;

    try {
      await UserPage();
      fail('Expected an error but none was thrown');
    } catch (error) {
      expect(mockRedirect).toHaveBeenCalledWith('/login');
    }
  });

  it('should render UserProfile when user exists', async () => {
    const mockDate = new Date('2023-01-01');
    const mockUser = {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
      img: 'profile.jpg',
      isAdmin: false,
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    const mockAnimals = [
      {
        _id: 'animal1',
        description: 'A cute dog',
        type: 'dog',
        age: '2',
        city: 'New York',
        gender: 'male',
        userID: '123',
        createdAt: mockDate,
        updatedAt: mockDate,
      }
    ];

    (auth as jest.Mock).mockResolvedValue({user: {email: 'test@example.com'}});
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (getAnimalsByUserId as jest.Mock).mockResolvedValue(mockAnimals);

    const component = await UserPage();

    render(<div>{component}</div>);

    expect(getUser).toHaveBeenCalledWith('test@example.com');
    expect(getAnimalsByUserId).toHaveBeenCalledWith('123');
    expect(UserProfile).toHaveBeenCalled();

    const userProfileCalls = (UserProfile as jest.Mock).mock.calls;
    if (userProfileCalls.length > 0) {
      const props = userProfileCalls[0][0];
      expect(props.user._id).toBe('123');
      expect(props.user.username).toBe('testuser');
      expect(props.animals[0]._id).toBe('animal1');
    }
  });

  it('should handle authentication errors properly', async () => {
    (auth as jest.Mock).mockRejectedValue(new Error('Auth error'));

    try {
      await UserPage();
      fail('Expected error to be thrown');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('Auth error');
      } else {
        fail('Expected error to be an instance of Error');
      }
    }
  });
});
