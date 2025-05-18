import {Animal, Photo, User} from './models';
import {connectDB} from './utils';
import {
  createAnimalPost,
  createUser,
  deleteAnimal,
  deleteUser,
  getAnimalById,
  getCleanImagePath,
  getSession,
  getUserWithCredentials,
  takeAllPhotosForSingleAnimal,
  updateAnimal,
  updateUser
} from './actions';
import {auth, signIn} from '@/auth';
import {redirect} from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(),
}));

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
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteMany: jest.fn()
  },
  Photo: {
    create: jest.fn(),
    find: jest.fn(),
    deleteMany: jest.fn()
  }
}));

jest.mock('./utils', () => ({
  connectDB: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn(() => '/mocked/path/to/file')
}));

jest.mock('mongodb', () => ({
  ObjectId: jest.fn(id => ({toString: () => id}))
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
        password: 'password123',
        phone: '1234567890'
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
        password: 'password123',
        phone: '1234567890'
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

describe('Animal-related actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAnimalPost', () => {
    it('should create an animal post with photos successfully', async () => {
      const fs = require('fs/promises');
      (fs.writeFile as jest.Mock).mockImplementation(() => Promise.resolve());
      (fs.mkdir as jest.Mock).mockImplementation(() => Promise.resolve());

      const path = require('path');
      (path.join as jest.Mock).mockReturnValue('./test/path');

      const mockSession = {user: {email: 'test@example.com'}};
      const mockUser = {_id: 'user123'};

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Animal.create as jest.Mock).mockResolvedValue({
        _id: 'animal123',
        photos: []
      });
      (Photo.create as jest.Mock).mockResolvedValue({});

      const formData = new FormData();
      formData.append('description', 'Test');
      formData.append('type', 'dog');
      formData.append('age', '2');
      formData.append('city', 'Sofia');
      formData.append('gender', 'male');

      console.log = jest.fn();

      await createAnimalPost(formData);

      expect(Animal.create).toHaveBeenCalled();
    });

    it('should handle missing form data', async () => {
      const formData = new FormData();
      formData.append('description', 'Test description');

      console.log = jest.fn();

      await createAnimalPost(formData);

      expect(console.log).toHaveBeenCalledWith(
          'Error occurred ',
          expect.any(Error)
      );
      expect(Animal.create).not.toHaveBeenCalled();
    });
  });

  describe('getAnimalById', () => {
    it('should return an animal with formatted _id', async () => {
      const mockAnimalId = 'animal123';
      const mockAnimal = {
        _id: {toString: () => mockAnimalId},
        type: 'dog',
        age: 2,
        city: 'Sofia'
      };

      (Animal.findOne as jest.Mock).mockResolvedValue(mockAnimal);

      const result = await getAnimalById(mockAnimalId);

      expect(connectDB).toHaveBeenCalled();
      expect(Animal.findOne).toHaveBeenCalledWith({_id: {toString: expect.any(Function)}});
      expect(result._id).toBe(mockAnimalId);
    });
  });

  describe('takeAllPhotosForSingleAnimal', () => {
    it('should return all photos for a given animal', async () => {
      const mockAnimalId = 'animal123';
      const mockPhotos = [
        {_id: 'photo1', title: 'photo1.jpg', animalId: mockAnimalId},
        {_id: 'photo2', title: 'photo2.jpg', animalId: mockAnimalId}
      ];

      (Photo.find as jest.Mock).mockResolvedValue(mockPhotos);

      const result = await takeAllPhotosForSingleAnimal(mockAnimalId);

      expect(connectDB).toHaveBeenCalled();
      expect(Photo.find).toHaveBeenCalledWith({animalId: mockAnimalId});
      expect(result).toEqual(mockPhotos);
    });

    it('should handle errors when fetching photos', async () => {
      const mockError = new Error('Database error');
      (Photo.find as jest.Mock).mockRejectedValue(mockError);

      console.error = jest.fn();

      await takeAllPhotosForSingleAnimal('animal123');

      expect(console.error).toHaveBeenCalledWith('Error occurred: ', mockError);
    });
  });

  describe('getCleanImagePath', () => {
    it('should return placeholder for empty path', async () => {
      const result = await getCleanImagePath('');
      expect(result).toBe('/placeholder.jpg');
    });

    it('should clean Windows-style paths', async () => {
      const result = await getCleanImagePath('C:\\path\\to\\uploads\\image.jpg');
      expect(result).toBe('/uploads/image.jpg');
    });

    it('should clean Unix-style paths', async () => {
      const result = await getCleanImagePath('/path/to/uploads/image.jpg');
      expect(result).toBe('/uploads/image.jpg');
    });
  });

  describe('deleteAnimal', () => {
    it('should delete animal and related photos when authorized', async () => {
      const mockRedirect = redirect as jest.Mock;
      mockRedirect.mockImplementation(() => {
      });

      const mockAnimalId = 'animal123';
      const mockUserId = 'user123';
      const formData = new FormData();
      formData.append('id', mockAnimalId);

      const mockSession = {user: {email: 'test@example.com'}};
      const mockUser = {_id: {toString: () => mockUserId}};
      const mockAnimal = {
        _id: mockAnimalId,
        userID: {toString: () => mockUserId}
      };

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Animal.findById as jest.Mock).mockResolvedValue(mockAnimal);
      (Animal.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      (Photo.deleteMany as jest.Mock).mockResolvedValue({});

      try {
        await deleteAnimal(formData);
      } catch (error) {
        if (!(error instanceof Error) || !error.toString().includes('NEXT_REDIRECT')) {
          throw error;
        }
      }

      expect(connectDB).toHaveBeenCalled();
      expect(auth).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
      expect(Animal.findById).toHaveBeenCalledWith(mockAnimalId);
      expect(Animal.findByIdAndDelete).toHaveBeenCalledWith(mockAnimalId);
      expect(Photo.deleteMany).toHaveBeenCalledWith({animalId: mockAnimalId});
    });

    it('should throw error when not authorized', async () => {
      const mockAnimalId = 'animal123';
      const formData = new FormData();
      formData.append('id', mockAnimalId);

      const mockSession = {user: {email: 'test@example.com'}};
      const mockUser = {_id: {toString: () => 'user123'}};
      const mockAnimal = {
        _id: mockAnimalId,
        userID: {toString: () => 'differentUser456'}
      };

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Animal.findById as jest.Mock).mockResolvedValue(mockAnimal);

      await expect(deleteAnimal(formData)).rejects.toThrow('Not authorized');
    });
  });

  describe('updateAnimal', () => {
    it('should update animal when authorized', async () => {
      const mockData = {
        id: 'animal123',
        description: 'Updated description',
        type: 'cat',
        age: '3',
        city: 'Plovdiv',
        gender: 'female'
      };

      const mockSession = {user: {email: 'test@example.com'}};
      const mockUser = {_id: {toString: () => 'user123'}};
      const mockAnimal = {
        _id: 'animal123',
        userID: {toString: () => 'user123'}
      };
      const mockUpdatedAnimal = {...mockData, _id: 'animal123'};

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Animal.findById as jest.Mock).mockResolvedValue(mockAnimal);
      (Animal.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedAnimal);

      const result = await updateAnimal(mockData);

      expect(connectDB).toHaveBeenCalled();
      expect(auth).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
      expect(Animal.findById).toHaveBeenCalledWith(mockData.id);
      expect(Animal.findByIdAndUpdate).toHaveBeenCalledWith(
          mockData.id,
          {
            description: mockData.description,
            type: mockData.type,
            age: mockData.age,
            city: mockData.city,
            gender: mockData.gender
          },
          {new: true}
      );
      expect(result).toEqual(mockUpdatedAnimal);
    });

    it('should throw error when not authorized to update', async () => {
      const mockData = {
        id: 'animal123',
        description: 'Updated description',
        type: 'cat',
        age: '3',
        city: 'Plovdiv',
        gender: 'female'
      };

      const mockSession = {user: {email: 'test@example.com'}};
      const mockUser = {_id: {toString: () => 'user123'}};
      const mockAnimal = {
        _id: 'animal123',
        userID: {toString: () => 'differentUser456'}
      };

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Animal.findById as jest.Mock).mockResolvedValue(mockAnimal);

      await expect(updateAnimal(mockData)).rejects.toThrow('Not authorized to edit this ad');
    });
  });
});
