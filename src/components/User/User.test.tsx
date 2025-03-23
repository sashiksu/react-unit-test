import { render, screen, } from '@testing-library/react';
import React from 'react';
import User from './User';

describe('User Component', () => {
  test('displays loading state initially', () => {
    render(<User greetingText={null} />);
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
    expect(screen.getByTestId('user-loading')).toHaveTextContent('Loading...');
  });

  test('displays user information after loading', async () => {
    render(<User greetingText={null} />);
    
    // Initially in loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // After the timeout, user information should be displayed
    const userElement = await screen.findByTestId('user-name', {}, { timeout: 3000 });
    expect(userElement).toHaveTextContent('Hey! John Doe');
  });

  test('displays custom greeting text when provided', async () => {
    render(<User greetingText="Hello," />);
    
    // After the timeout, user information should be displayed with custom greeting
    const userElement = await screen.findByTestId('user-name', {}, { timeout: 3000 });
    expect(userElement).toHaveTextContent('Hello, John Doe');
  });

  test('renders title correctly', () => {
    render(<User greetingText={null} />);
    expect(screen.getByTestId('user-title')).toBeInTheDocument();
    expect(screen.getByTestId('user-title')).toHaveTextContent('User Info');
  });

  // Testing with different props
  test('handles null greeting text properly', async () => {
    render(<User greetingText={null} />);
    
    const userElement = await screen.findByTestId('user-name', {}, { timeout: 3000 });
    expect(userElement).toHaveTextContent('Hey! John Doe');
  });
});