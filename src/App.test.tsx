import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders splash screen on app start', () => {
  render(<App />);
  expect(screen.getByText('AR Learn')).toBeInTheDocument();
});
