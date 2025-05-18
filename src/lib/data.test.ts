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

describe('Animal-related methods', () => {
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
    await Animal.deleteMany({});
  });

  describe('createAnimal', () => {
    it('should create a new animal ad', async () => {
      const animalData = {
        description: 'Test animal',
        type: 'cat',
        age: '2',
        city: 'Sofia',
        gender: 'female'
      };
      const userId = new mongoose.Types.ObjectId().toString();

      const result = await createAnimal(animalData, userId);

      expect(result).toBeDefined();
      expect(result?.description).toBe('Test animal');
      expect(result?.type).toBe('cat');
      expect(result?.userID.toString()).toBe(userId);
    });

    it('should return undefined when error occurs', async () => {
      jest.spyOn(Animal.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'));

      const animalData = {
        description: 'Test animal',
        type: 'cat'
      };
      const userId = new mongoose.Types.ObjectId().toString();

      const result = await createAnimal(animalData, userId);

      expect(result).toBeUndefined();
    });
  });

  describe('getAnimals', () => {
    it('should return all animals', async () => {
      await Animal.create([
        {
          description: 'First animal',
          type: 'cat',
          age: '2',
          city: 'Sofia',
          gender: 'female',
          userID: new mongoose.Types.ObjectId()
        },
        {
          description: 'Second animal',
          type: 'dog',
          age: '3',
          city: 'Plovdiv',
          gender: 'male',
          userID: new mongoose.Types.ObjectId()
        }
      ]);

      const result = await getAnimals();

      expect(result).toHaveLength(2);
      const descriptions = result.map(animal => animal.description);
      expect(descriptions).toEqual(expect.arrayContaining(['First animal', 'Second animal']));
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return empty array when no animals exist', async () => {
      const result = await getAnimals();

      expect(result).toEqual([]);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return empty array when database error occurs', async () => {
      (connectDB as jest.Mock).mockRejectedValueOnce(new Error('DB connection failed'));

      const result = await getAnimals();

      expect(result).toEqual([]);
    });
  });

  describe('filterAnimals', () => {
    beforeEach(async () => {
      await Animal.create([
        {
          description: 'Cat in Sofia',
          type: 'cat',
          age: '2',
          city: 'Sofia',
          gender: 'female',
          userID: new mongoose.Types.ObjectId()
        },
        {
          description: 'Dog in Plovdiv',
          type: 'dog',
          age: '3',
          city: 'Plovdiv',
          gender: 'male',
          userID: new mongoose.Types.ObjectId()
        },
        {
          description: 'Cat in Plovdiv',
          type: 'cat',
          age: '1',
          city: 'Plovdiv',
          gender: 'male',
          userID: new mongoose.Types.ObjectId()
        }
      ]);
    });

    it('should filter animals by type', async () => {
      const result = await filterAnimals({type: 'cat'});

      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.type === 'cat')).toBe(true);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should filter animals by city', async () => {
      const result = await filterAnimals({city: 'Plovdiv'});

      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.city === 'Plovdiv')).toBe(true);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should filter animals by gender', async () => {
      const result = await filterAnimals({gender: 'male'});

      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.gender === 'male')).toBe(true);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should filter animals by multiple criteria', async () => {
      const result = await filterAnimals({
        type: 'cat',
        city: 'Plovdiv'
      });

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('cat');
      expect(result[0].city).toBe('Plovdiv');
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return all animals when no filters provided', async () => {
      const result = await filterAnimals({});

      expect(result).toHaveLength(3);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return empty array when database error occurs', async () => {
      (connectDB as jest.Mock).mockRejectedValueOnce(new Error('DB connection failed'));

      const result = await filterAnimals({type: 'cat'});

      expect(result).toEqual([]);
    });
  });

  describe('getAnimalAd', () => {
    it('should return animal when valid ID is provided', async () => {
      const animal = await Animal.create({
        description: 'Test animal',
        type: 'cat',
        age: '2',
        city: 'Sofia',
        gender: 'female',
        userID: new mongoose.Types.ObjectId()
      });

      const result = await getAnimalAd(animal._id.toString());

      expect(result).not.toBeNull();
      expect(result?._id.toString()).toBe(animal._id.toString());
      expect(result?.description).toBe('Test animal');
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return null when animal with ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const result = await getAnimalAd(nonExistentId);

      expect(result).toBeNull();
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe('getAnimalsByUserId', () => {
    it('should return animals for a specific user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const differentUserId = new mongoose.Types.ObjectId();

      await Animal.create([
        {
          description: 'User animal 1',
          type: 'cat',
          age: '2',
          city: 'Sofia',
          gender: 'female',
          userID: userId
        },
        {
          description: 'User animal 2',
          type: 'dog',
          age: '3',
          city: 'Plovdiv',
          gender: 'male',
          userID: userId
        },
        {
          description: 'Different user animal',
          type: 'bird',
          age: '1',
          city: 'Varna',
          gender: 'male',
          userID: differentUserId
        }
      ]);

      const result = await getAnimalsByUserId(userId.toString());

      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.userID.toString() === userId.toString())).toBe(true);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should return empty array when user has no animals', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const result = await getAnimalsByUserId(userId);

      expect(result).toHaveLength(0);
      expect(connectDB).toHaveBeenCalled();
    });

    it('should throw error when database error occurs', async () => {
      (connectDB as jest.Mock).mockRejectedValueOnce(new Error('DB connection failed'));
      const userId = new mongoose.Types.ObjectId().toString();

      await expect(getAnimalsByUserId(userId)).rejects.toThrow();
    });
  });
});
