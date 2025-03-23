import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

const User = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setUser({ id: 1, name: "John Doe" });
    }, 2500);
  }, []);

  return (
    <div>
      <h1>User Info</h1>
      {user ? (
        <p data-testid="user-name">Name: {user.name}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default User;
