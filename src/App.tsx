import React from 'react';
import Home from './components/Home';

/**
 * Main Application Routing Component.
 * Maps root route ("/") to the cinematic Home landing page component.
 */
export const App: React.FC = () => {
  return (
    <div className="app-root min-h-screen bg-black text-white">
      <Home />
    </div>
  );
};

export default App;
