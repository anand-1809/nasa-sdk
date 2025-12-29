// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    testTimeout: 10000,
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
});
