/**
 * E2E Test Setup
 * 
 * Configures MSW (Mock Service Worker) handlers and global test utilities
 * for end-to-end testing against API contracts.
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Setup MSW server with API mock handlers
export const server = setupServer(...handlers);

beforeAll(() => {
  // Start the MSW server before tests
  server.listen({
    onUnhandledRequest: 'warn',
  });
  console.log('MSW server started');
});

afterEach(() => {
  // Reset handlers between tests for isolation
  server.resetHandlers();
});

afterAll(() => {
  // Clean up MSW server
  server.close();
  console.log('MSW server stopped');
});

// Global test utilities
export const TEST_CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'https://api.skintwin.ai',
  environment: process.env.TEST_ENVIRONMENT || 'ci',
  debug: process.env.DEBUG === 'true',
};

/**
 * Helper to generate unique IDs for test isolation
 */
export function generateTestId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Helper to wait for a condition with timeout
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 100 } = options;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}
