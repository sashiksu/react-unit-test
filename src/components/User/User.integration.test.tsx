import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import User from './User';

// Don't mock the hooks for integration tests
jest.unmock('./hooks/useUserData');
jest.unmock('./hooks/useUserPreferences');

// Use fake timers for async operations
jest.useFakeTimers();

describe('User Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('full user interaction flow', async () => {
    // Render the component
    render(<User greetingText="Welcome," initialUserId={1} />);
    
    // Initially should show loading
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
    
    // Advance timers completely
    jest.advanceTimersByTime(2000); // More than the 1000ms delay in the hook
    
    // Wait for user info to appear using findByTestId
    const userName = await screen.findByTestId('user-name', {}, { timeout: 3000 });
    
    // After loading, check user info
    expect(userName).toHaveTextContent('Welcome, John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john.doe@example.com');
    expect(screen.getByTestId('user-role')).toHaveTextContent('Admin');
    
    // Initial theme should be light
    expect(screen.getByTestId('user-container')).toHaveClass('light-theme');
    
    // Change theme
    fireEvent.click(screen.getByTestId('theme-toggle'));
    
    // Should update theme
    expect(screen.getByTestId('user-container')).toHaveClass('dark-theme');
    
    // Change user ID
    fireEvent.change(screen.getByTestId('user-id-input'), { target: { value: '2' } });
    fireEvent.submit(screen.getByTestId('user-form'));
    
    // Should show loading again
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
    
    // Advance timers
    jest.advanceTimersByTime(2000);
    
    // Wait for updated user info
    const updatedUserName = await screen.findByTestId('user-name', {}, { timeout: 3000 });
    expect(updatedUserName).toHaveTextContent('Welcome, User 2');
    expect(screen.getByTestId('user-role')).toHaveTextContent('User');
    
    // Try to load invalid user
    fireEvent.change(screen.getByTestId('user-id-input'), { target: { value: '999' } });
    fireEvent.submit(screen.getByTestId('user-form'));
    
    // Advance timers
    jest.advanceTimersByTime(2000);
    
    // Wait for error to appear
    const errorElement = await screen.findByTestId('user-error', {}, { timeout: 3000 });
    expect(errorElement).toHaveTextContent('User not found');
    
    // Toggle notifications
    fireEvent.click(screen.getByTestId('notifications-toggle'));
    
    expect(screen.getByTestId('notifications-toggle')).toHaveTextContent('Notifications: Off');
    
    // Refresh data
    fireEvent.click(screen.getByTestId('refresh-button'));
    
    // Should show loading again
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
    
    // Advance timers
    jest.advanceTimersByTime(2000);
    
    // Wait for error to appear again
    const refreshedErrorElement = await screen.findByTestId('user-error', {}, { timeout: 3000 });
    expect(refreshedErrorElement).toHaveTextContent('User not found');
  });
});