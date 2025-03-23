import { useEffect, useState } from "react";

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UseUserDataOptions {
  initialId?: number;
  loadDelay?: number;
}

interface UseUserDataReturn {
  user: UserData | null;
  isLoading: boolean;
  error: Error | null;
  setUserId: (id: number) => void;
  refreshUserData: () => void;
}

export const useUserData = ({
  initialId = 1,
  loadDelay = 1000,
}: UseUserDataOptions = {}): UseUserDataReturn => {
  const [userId, setUserId] = useState<number>(initialId);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, loadDelay));

      // Mock user data - in a real app, this would be an API call
      if (id === 999) {
        throw new Error("User not found");
      }

      const userData: UserData = {
        id,
        name: id === 1 ? "John Doe" : `User ${id}`,
        email: id === 1 ? "john.doe@example.com" : `user${id}@example.com`,
        role: id === 1 ? "Admin" : "User",
      };

      setUser(userData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch user data when userId changes
  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  const refreshUserData = () => {
    fetchUserData(userId);
  };

  return { user, isLoading, error, setUserId, refreshUserData };
};
