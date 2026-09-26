import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Automatically clean up the DOM after every individual test
afterEach(() => {
  cleanup();
});