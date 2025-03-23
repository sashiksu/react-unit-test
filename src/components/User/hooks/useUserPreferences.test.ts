import { act, renderHook } from '@testing-library/react';
import { UserPreferences, useUserPreferences } from './useUserPreferences';

describe('useUserPreferences', () => {
  it('should initialize with default preferences', () => {
    const { result } = renderHook(() => useUserPreferences());
    
    expect(result.current.preferences).toEqual({
      theme: 'light',
      notifications: true,
      language: 'en'
    });
  });

  it('should initialize with custom default preferences', () => {
    const defaultPreferences: Partial<UserPreferences> = {
      theme: 'dark',
      notifications: false
    };
    
    const { result } = renderHook(() => 
      useUserPreferences({ defaultPreferences })
    );
    
    expect(result.current.preferences).toEqual({
      theme: 'dark',
      notifications: false,
      language: 'en'
    });
  });

  it('should update preferences', () => {
    const { result } = renderHook(() => useUserPreferences());
    
    act(() => {
      result.current.updatePreferences({ theme: 'dark' });
    });
    
    expect(result.current.preferences).toEqual({
      theme: 'dark',
      notifications: true,
      language: 'en'
    });
    
    act(() => {
      result.current.updatePreferences({ 
        notifications: false,
        language: 'fr' 
      });
    });
    
    expect(result.current.preferences).toEqual({
      theme: 'dark',
      notifications: false,
      language: 'fr'
    });
  });

  it('should reset preferences', () => {
    const { result } = renderHook(() => useUserPreferences());
    
    // Change preferences
    act(() => {
      result.current.updatePreferences({ 
        theme: 'dark',
        notifications: false,
        language: 'fr'
      });
    });
    
    // Verify changes
    expect(result.current.preferences.theme).toBe('dark');
    
    // Reset preferences
    act(() => {
      result.current.resetPreferences();
    });
    
    // Verify reset
    expect(result.current.preferences).toEqual({
      theme: 'light',
      notifications: true,
      language: 'en'
    });
  });
});