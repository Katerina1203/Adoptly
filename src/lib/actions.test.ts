import {Animal, User} from './models';
import {connectDB} from './utils';
import {createUser, deleteUser, getSession, getUserWithCredentials, updateUser} from './actions';
import {auth, signIn} from '@/auth';

jest.mock('@/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  auth: jest.fn()
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}));

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('./models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  },
  Animal: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
    save: jest.fn()
  },
  Photo: {
    create: jest.fn(),
    find: jest.fn()
  }
}));

jest.mock('./utils', () => ({
  connectDB: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn(() => '/mocked/path/to/file')
}));

describe('User-related actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserWithCredentials', () => {
    it('should call signIn with correct credentials', async () => {
      const mockCredentials = {email: 'test@example.com', password: 'password123'};
      const mockResponse = {ok: true, error: null};

      (signIn as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getUserWithCredentials(mockCredentials);

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: mockCredentials.email,
        password: mockCredentials.password,
        redirect: false
      });
      expect(result).toBe(mockResponse);
    });

    it('should handle errors during sign in', async () => {
      const mockCredentials = {email: 'test@example.com', password: 'password123'};
      const mockError = new Error('Sign in failed');

      (signIn as jest.Mock).mockRejectedValue(mockError);

      console.error = jest.fn();

      const result = await getUserWithCredentials(mockCredentials);

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      (User.create as jest.Mock).mockResolvedValue(mockUser);

      await createUser(mockUser);

      expect(connectDB).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors during user creation', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockError = new Error('User creation failed');
      (User.create as jest.Mock).mockRejectedValue(mockError);

      console.error = jest.fn();

      await createUser(mockUser);

      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateUser', () => {
    it('should throw an error if required fields are missing', async () => {
      const mockFormData = {
        get: jest.fn((key) => {
          if (key === 'id') return '123';
          return null;
        })
      } as unknown as FormData;

      (User.findByIdAndUpdate as jest.Mock).mockImplementation(() => {
        throw new Error('Missing required fields');
      });

      await expect(updateUser(mockFormData)).rejects.toThrow('Missing required fields');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and their animals', async () => {
      const userId = '123';
      const mockFormData = new FormData();
      mockFormData.append('id', userId);

      await deleteUser(mockFormData);

      expect(connectDB).toHaveBeenCalled();
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(Animal.deleteMany).toHaveBeenCalledWith({userID: userId});
    });
  });

  describe('getSession', () => {
    it('should return the session when authenticated', async () => {
      const mockSession = {user: {email: 'test@example.com'}};
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const result = await getSession();

      expect(auth).toHaveBeenCalled();
      expect(result).toBe(mockSession);
    });

    it('should return null when there is an error', async () => {
      const mockError = new Error('Auth error');
      (auth as jest.Mock).mockRejectedValue(mockError);

      console.error = jest.fn();

      const result = await getSession();

      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
