const { execSync } = require('child_process');
const testcontainers = require('./testcontainers');

async function runE2ETests() {
  const originalMongoDBUrl = process.env.MONGODB;

  try {
    console.log('Starting E2E test MongoDB container...');
    await testcontainers.startTestContainer();

    console.log('Initializing test database...');
    await testcontainers.initTestDatabase();

    console.log('Running E2E tests...');
    execSync('npx playwright test', { stdio: 'inherit' });
  } catch (error) {
    console.error('E2E test execution failed:', error);
    process.exitCode = 1;
  } finally {
    process.env.MONGODB = originalMongoDBUrl;

    console.log('Shutting down E2E test MongoDB container...');
    try {
      await testcontainers.stopTestContainer();
    } catch (cleanupError) {
      console.error('Failed to shut down E2E test MongoDB container:', cleanupError);
      process.exitCode = 1;
    }
  }
}

runE2ETests().catch(error => {
  console.error('Unhandled error during E2E test execution:', error);
  process.exit(1);
});
