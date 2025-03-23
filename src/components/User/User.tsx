import { FC, useState } from "react";
import { useUserData } from "./hooks/useUserData";
import { useUserPreferences } from "./hooks/useUserPreferences";
import './user.css';

interface UserProps {
  greetingText: string | null;
  initialUserId?: number;
}

const User: FC<UserProps> = (props) => {
  const { greetingText, initialUserId = 1 } = props;
  const [userId, setUserIdInput] = useState<string>(initialUserId.toString());

  const { user, isLoading, error, setUserId, refreshUserData } = useUserData({
    initialId: initialUserId,
  });

  const { preferences, updatePreferences } = useUserPreferences();

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserId(parseInt(userId, 10));
  };

  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === "light" ? "dark" : "light",
    });
  };

  const toggleNotifications = () => {
    updatePreferences({
      notifications: !preferences.notifications,
    });
  };

  return (
    <div
      data-testid="user-container"
      className={`user-container ${
        preferences.theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <h1 data-testid="user-title">User Info</h1>

      {/* User ID Input Form */}
      <form onSubmit={handleUserIdSubmit} data-testid="user-form">
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserIdInput(e.target.value)}
          data-testid="user-id-input"
        />
        <button type="submit" data-testid="user-id-submit">
          Load User
        </button>
      </form>

      {/* Refresh Button */}
      <button onClick={refreshUserData} data-testid="refresh-button">
        Refresh
      </button>

      {/* Preference Controls */}
      <div data-testid="user-preferences">
        <button onClick={toggleTheme} data-testid="theme-toggle">
          Theme: {preferences.theme}
        </button>
        <button
          onClick={toggleNotifications}
          data-testid="notifications-toggle"
        >
          Notifications: {preferences.notifications ? "On" : "Off"}
        </button>
      </div>

      {/* User Display */}
      {isLoading ? (
        <p data-testid="user-loading">Loading...</p>
      ) : error ? (
        <p data-testid="user-error">Error: {error.message}</p>
      ) : user ? (
        <div data-testid="user-info">
          <p data-testid="user-name">
            {greetingText ? greetingText : "Hey!"} {user.name}
          </p>
          <p data-testid="user-email">Email: {user.email}</p>
          <p data-testid="user-role">Role: {user.role}</p>
        </div>
      ) : (
        <p data-testid="user-not-found">No user data available</p>
      )}
    </div>
  );
};

export default User;
