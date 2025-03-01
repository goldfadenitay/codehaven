import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['dotenv/config', './src/test/setup.ts'],
    include: ['**/*.test.ts', '**/*.spec.ts', '**/*.integration.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/*.d.ts',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*',
      ],
      all: true,
    },
    reporters: ['default', 'html'],
    outputFile: {
      html: './coverage/html/index.html',
    },
    deps: {
      inline: [
        // Dependencies that should be inlined during tests
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, './src/common'),
      '@domains': path.resolve(__dirname, './src/domains'),
      '@middleware': path.resolve(__dirname, './src/middleware'),
      '@config': path.resolve(__dirname, './config'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
})
