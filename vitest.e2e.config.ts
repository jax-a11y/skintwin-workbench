import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.e2e.test.ts'],
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    retry: process.env.CI ? 1 : 0,
    sequence: {
      shuffle: false,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage/e2e',
    },
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: 'test-results/e2e-results.json',
      html: 'test-results/e2e-results.html',
    },
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    setupFiles: ['tests/e2e/setup.ts'],
  },
});
