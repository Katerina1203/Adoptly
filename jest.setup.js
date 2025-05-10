// jest.setup.js
import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Suppress specific console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Ignore specific React errors or warnings if needed
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Error: Uncaught [Error: expected]'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
