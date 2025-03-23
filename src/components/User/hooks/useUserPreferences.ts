import { useCallback, useState } from "react";

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
}

interface UseUserPreferencesOptions {
  defaultPreferences?: Partial<UserPreferences>;
}

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultUserPreferences: UserPreferences = {
  theme: "light",
  notifications: true,
  language: "en",
};

export const useUserPreferences = (
  options: UseUserPreferencesOptions = {}
): UseUserPreferencesReturn => {
  const initialPreferences = {
    ...defaultUserPreferences,
    ...options.defaultPreferences,
  };

  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);

  const updatePreferences = useCallback(
    (newPrefs: Partial<UserPreferences>) => {
      setPreferences((prevPrefs) => ({
        ...prevPrefs,
        ...newPrefs,
      }));
    },
    []
  );

  const resetPreferences = useCallback(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
};
