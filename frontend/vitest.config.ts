/**
 * Task 1.1.1.21a: Vitest Configuration
 * 
 * Testing infrastructure for the PM Platform frontend.
 * Configured for React/Next.js with jsdom environment.
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '.next/',
      ],
      thresholds: {
        // Minimum coverage thresholds
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
    
    // Include patterns
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      '.next',
      'dist',
    ],
    
    // Test timeout
    testTimeout: 10000,
    
    // Reporter
    reporters: ['verbose'],
    
    // Watch mode exclusions
    watchExclude: ['node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
