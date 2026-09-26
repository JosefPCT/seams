import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                // Enables global test methods like describe, expect, and it without imports
    environment: 'jsdom',         // Simulates a browser DOM environment inside Node.js
    setupFiles: './src/test/setup.js', // Tells Vitest to run this file before starting any tests
  },
})

