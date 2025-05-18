import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {
  changeUser,
  createAnimal,
  filterAnimals,
  getAllUsers,
  getAnimalAd,
  getAnimals,
  getAnimalsByUserId,
  getUser,
  getUserById
} from './data';
import {Animal, User} from './models';
import bcrypt from 'bcryptjs';
import {connectDB} from './utils';

jest.mock('./utils', () => ({
  connectDB: jest.fn(),
}));

jest.mock('next/cache', () => ({
  unstable_noStore: jest.fn(),
}));

describe('User-related methods', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('getUser', () => {
    it('should return a user when valid email is provided', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '1234567890'
      };
      await User.create(mockUser);

      const result = await getUser('test@example.com');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
      expect(result?.username).toBe('testuser');
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return null when user with email does not exist', async () => {
      const result = await getUser('nonexistent@example.com');

      expect(result).toBeNull();
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return null when database error occurs', async () => {
      (connectDB as jest.Mock).mockImplementationOnce(() => {
        throw new Error('DB connection failed');
      });

      const result = await getUser('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return a user when valid ID is provided', async () => {
      const mockUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '1234567890'
      });

      const result = await getUserById(mockUser._id.toString());

      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
      expect(result?.username).toBe('testuser');
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return null when user with ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const result = await getUserById(nonExistentId);

      expect(result).toBeNull();
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return null when database error occurs', async () => {
      (connectDB as jest.Mock).mockRejectedValueOnce(new Error('DB connection failed'));
      const id = new mongoose.Types.ObjectId().toString();

      const result = await getUserById(id);

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await User.create([
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
          isAdmin: false,
          phone: '1234567890'
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password456',
          isAdmin: true,
          phone: '0987654321'
        }
      ]);

      const result = await getAllUsers();

      expect(result).toHaveLength(2);
      expect(result?.map(user => user.username)).toContain('user1');
      expect(result?.map(user => user.username)).toContain('user2');
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      const result = await getAllUsers();

      expect(result).toHaveLength(0);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return null when database error occurs', async () => {
      (connectDB as jest.Mock).mockImplementationOnce(() => {
        throw new Error('DB connection failed');
      });

      const result = await getUser('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('changeUser', () => {
    it('should update user with valid data', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed_password'));

      const user = await User.create({
        username: 'olduser',
        email: 'old@example.com',
        password: 'oldpassword',
        isAdmin: false,
        phone: '1234567890'
      });

      const updates = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
        img: 'profile.jpg',
        phone: '0987654321'
      };

      const result = await changeUser(user._id.toString(), updates);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('new@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return error when user ID is invalid', async () => {
      const result = await changeUser('invalid-id', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
        img: 'profile.jpg',
        phone: '1234567890'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid user ID format.');
    });

    it('should return error when user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const result = await changeUser(nonExistentId, {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
        img: 'profile.jpg',
        phone: '1234567890'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found.');
    });

    it('should return error when password is too short', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'validpassword',
        isAdmin: false,
        phone: '1234567890'
      });

      const result = await changeUser(user._id.toString(), {
        username: 'newuser',
        email: 'new@example.com',
        password: 'short',
        img: 'profile.jpg',
        phone: '0987654321'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Password must be between 8 and 25 characters.');
    });

    it('should handle database errors during update', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'validpassword',
        isAdmin: false,
        phone: '1234567890'
      });

      jest.spyOn(User, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const result = await changeUser(user._id.toString(), {
        username: 'newuser',
        email: 'new@example.com',
        password: 'validpassword',
        img: 'profile.jpg',
        phone: '0987654321'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('An error occurred while updating the user.');
    });
  });
});
