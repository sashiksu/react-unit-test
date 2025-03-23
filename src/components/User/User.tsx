import { FC, useEffect, useState } from "react";

interface UserData {
  id: number;
  name: string;
}

interface UserProps {
  greetingText: string | null;
}
const User: FC<UserProps> = (props: UserProps) => {
  const { greetingText } = props;
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setUser({ id: 1, name: "John Doe" });
    }, 2500);
  }, []);

  return (
    <div data-testid="user-container">
      <h1 data-testid="user-title">User Info</h1>
      {user ? (
        <p data-testid="user-name">
          {greetingText ? greetingText : "Hey!"} {user.name}
        </p>
      ) : (
        <p data-testid="user-loading">Loading...</p>
      )}
    </div>
  );
};

export default User;