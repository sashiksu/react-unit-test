import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import User from './User';
import { useUserData } from './hooks/useUserData';
import { useUserPreferences } from './hooks/useUserPreferences';

// Mock our custom hooks
jest.mock('./hooks/useUserData');
jest.mock('./hooks/useUserPreferences');

describe('User Component', () => {
  // Setup default mocks for our hooks
  beforeEach(() => {
    // Mock useUserData hook
    (useUserData as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
      setUserId: jest.fn(),
      refreshUserData: jest.fn(),
    });

    // Mock useUserPreferences hook
    (useUserPreferences as jest.Mock).mockReturnValue({
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      updatePreferences: jest.fn(),
      resetPreferences: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    render(<User greetingText={null} />);
    expect(screen.getByTestId('user-loading')).toBeInTheDocument();
    expect(screen.getByTestId('user-loading')).toHaveTextContent('Loading...');
  });

  test('displays user information when loaded', async () => {
    // Update mock to return a loaded user
    (useUserData as jest.Mock).mockReturnValue({
      user: { 
        id: 1, 
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin'
      },
      isLoading: false,
      error: null,
      setUserId: jest.fn(),
      refreshUserData: jest.fn(),
    });

    render(<User greetingText={null} />);
    
    // User info should be displayed
    expect(screen.getByTestId('user-name')).toHaveTextContent('Hey! John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('Email: john.doe@example.com');
    expect(screen.getByTestId('user-role')).toHaveTextContent('Role: Admin');
  });

  test('displays custom greeting text when provided', () => {
    // Update mock to return a loaded user
    (useUserData as jest.Mock).mockReturnValue({
      user: { 
        id: 1, 
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin'
      },
      isLoading: false,
      error: null,
      setUserId: jest.fn(),
      refreshUserData: jest.fn(),
    });

    render(<User greetingText="Hello," />);
    
    expect(screen.getByTestId('user-name')).toHaveTextContent('Hello, John Doe');
  });

  test('displays error state when there is an error', () => {
    (useUserData as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: new Error('User not found'),
      setUserId: jest.fn(),
      refreshUserData: jest.fn(),
    });

    render(<User greetingText={null} />);
    
    expect(screen.getByTestId('user-error')).toBeInTheDocument();
    expect(screen.getByTestId('user-error')).toHaveTextContent('Error: User not found');
  });

  test('handles form submission to change user ID', () => {
    const mockSetUserId = jest.fn();
    (useUserData as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      setUserId: mockSetUserId,
      refreshUserData: jest.fn(),
    });

    render(<User greetingText={null} />);
    
    // Change input value and submit form
    const input = screen.getByTestId('user-id-input');
    const form = screen.getByTestId('user-form');
    
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.submit(form);
    
    // setUserId should be called with the new value
    expect(mockSetUserId).toHaveBeenCalledWith(2);
  });

  test('handles refresh button click', () => {
    const mockRefresh = jest.fn();
    (useUserData as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      setUserId: jest.fn(),
      refreshUserData: mockRefresh,
    });

    render(<User greetingText={null} />);
    
    // Click refresh button
    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    
    // refreshUserData should be called
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('toggles theme preference', () => {
    const mockUpdatePreferences = jest.fn();
    (useUserPreferences as jest.Mock).mockReturnValue({
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      updatePreferences: mockUpdatePreferences,
      resetPreferences: jest.fn(),
    });

    render(<User greetingText={null} />);
    
    // Click theme toggle button
    const themeToggle = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggle);
    
    // updatePreferences should be called with the new theme
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ theme: 'dark' });
  });

  test('toggles notifications preference', () => {
    const mockUpdatePreferences = jest.fn();
    (useUserPreferences as jest.Mock).mockReturnValue({
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      updatePreferences: mockUpdatePreferences,
      resetPreferences: jest.fn(),
    });

    render(<User greetingText={null} />);
    
    // Click notifications toggle button
    const notificationsToggle = screen.getByTestId('notifications-toggle');
    fireEvent.click(notificationsToggle);
    
    // updatePreferences should be called with the new notifications value
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ notifications: false });
  });

  test('applies theme class based on preferences', () => {
    (useUserPreferences as jest.Mock).mockReturnValue({
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
      },
      updatePreferences: jest.fn(),
      resetPreferences: jest.fn(),
    });

    render(<User greetingText={null} />);
    
    // Container should have dark-theme class
    const container = screen.getByTestId('user-container');
    expect(container).toHaveClass('dark-theme');
    expect(container).not.toHaveClass('light-theme');
  });
});