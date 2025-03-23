import { act, renderHook, waitFor } from '@testing-library/react';
import { useUserData } from './useUserData';

// Mock timers
jest.useFakeTimers();

describe('useUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state and fetch default user', async () => {
    const { result } = renderHook(() => useUserData({ loadDelay: 500 }));
    
    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Wait for state to update
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check fetched user data
    expect(result.current.user).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin'
    });
  });

  it('should allow changing user ID', async () => {
    const { result } = renderHook(() => useUserData({ loadDelay: 500 }));
    
    // Initial load
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Change user ID
    act(() => {
      result.current.setUserId(2);
    });
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Check fetched user data
    expect(result.current.user).toEqual({
      id: 2,
      name: 'User 2',
      email: 'user2@example.com',
      role: 'User'
    });
  });

  it('should handle refresh', async () => {
    const { result } = renderHook(() => useUserData({ loadDelay: 500 }));
    
    // Initial load
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Refresh
    act(() => {
      result.current.refreshUserData();
    });
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // User should be the same
    expect(result.current.user?.id).toBe(1);
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useUserData({ initialId: 999, loadDelay: 500 }));
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should have error
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('User not found');
    expect(result.current.user).toBe(null);
  });
});