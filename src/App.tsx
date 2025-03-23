import React from 'react';
import './App.css';
import User from './components/User/User';
function App() {
  return (
    <div className="App">
      <User greetingText="Good Morning !" initialUserId={1} />
    </div>
  );
}

export default App;
