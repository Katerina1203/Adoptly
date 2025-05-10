import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';

const USER_EMAIL = 'test@example.com';
const USER_PASSWORD = 'Test123!';
const USER_NAME = 'Test User';

let mongoContainer: MongoDBContainer | null = null;
let startedContainer: StartedMongoDBContainer | null = null;
let mongoUri: string | null = null;

async function startTestContainer(): Promise<string> {
  try {
    console.log('Starting MongoDB container...');
    mongoContainer = new MongoDBContainer()
      .withCommand(["mongod", "--bind_ip_all", "--noauth"])
      .withTmpFs({ "/data/db": "rw" });

    startedContainer = await mongoContainer.start();

    const mappedPort = startedContainer.getMappedPort(27017);
    mongoUri = `mongodb://localhost:${mappedPort}/test_db`;

    console.log(`MongoDB container started at ${mongoUri}`);
    process.env.MONGODB_TEST = mongoUri;
    process.env.MONGODB = mongoUri;

    return mongoUri;
  } catch (error) {
    console.error('Failed to start MongoDB container:', error);
    throw error;
  }
}

async function initTestDatabase(): Promise<void> {
  if (!mongoUri) {
    throw new Error('MongoDB container not started. Call startTestContainer() first.');
  }

  console.log(`Connecting to MongoDB at: ${mongoUri}`);
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected to test database');
    const db = client.db('test_db');

    await db.collection('users').deleteMany({});

    const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10);
    await db.collection('users').insertOne({
      email: USER_EMAIL,
      password: hashedPassword,
      username: USER_NAME,
      img: '',
      isAdmin: false,
      createdAt: new Date(),
    });

    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function stopTestContainer(): Promise<void> {
  if (startedContainer) {
    try {
      await startedContainer.stop();
      console.log('MongoDB container stopped');
    } catch (error) {
      console.error('Error stopping MongoDB container:', error);
    }
  }
}

module.exports = {
  startTestContainer,
  initTestDatabase,
  stopTestContainer
};
