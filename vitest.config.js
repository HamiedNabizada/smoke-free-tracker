import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/js/**/*.js'],
      exclude: ['app/js/firebase-*.js', 'app/js/ui/**/*.js']
    }
  }
});
